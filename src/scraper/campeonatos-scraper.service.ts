import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { ElementHandle, Page } from 'puppeteer';
import { CampeonatosService } from '../campeonatos/campeonatos.service';
import { Campeonato } from '../campeonatos/entities/campeonato.entity';
import { PartidaService } from '../partida/partida.service';
import { PosicaoService } from '../posicao/posicao.service';
import { ImageUtils } from '../utils/image-utils';
import { ScraperUtils } from './scraper-utils';

@Injectable()
export class CampeonatosScraperService {
    constructor(
        private readonly partidasService: PartidaService,
        private readonly campeonatosService: CampeonatosService,
        private readonly posicaoService: PosicaoService,
    ) { }

    private readonly logger = new Logger(CampeonatosScraperService.name);

    async scrapeCampeonatos() {
        await ScraperUtils.scrapePage({}, async (page) => {
            await this.scrapeCampeonatosUrlsFromUrl({
                url: "https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/resultados/",
                page: page,
            });
            await this.scrapeCampeonatosUrlsFromUrl({
                url: "https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/calendario/",
                page: page,
            });
            const campeonatos = await this.campeonatosService.findAll();
            for (var campeonato of campeonatos) {
                await this.scrapeCampeonato({
                    campeonatoToScrape: campeonato,
                    page: page,
                });
            }
        });
    }

    private async scrapeCampeonatosUrlsFromUrl(options: {
        page: Page,
        url: string,
    }) {
        try {
            const campeonatosWithUrl = await ScraperUtils.scrapePage({ url: options.url, page: options.page }, async (page) => {

                const cookieConsentButton = await options.page.$("#onetrust-accept-btn-handler");
                if (cookieConsentButton) {
                    await Promise.all([
                        options.page.evaluate((consentButton: HTMLElement) => consentButton.click(), cookieConsentButton).catch(e => null),
                        page.waitForNavigation({ waitUntil: ['networkidle0', 'domcontentloaded'] }).catch(e => null),
                    ]);
                }

                const campeonatosWithUrl = new Map<string, { id: string, url: string }>();
                let links = await ((await page.$(".sportName")).$$(".event__title--name"))
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];

                    const campeonato = (await (await link.getProperty("innerText")).jsonValue()).toString();

                    if (![...campeonatosWithUrl.keys()].includes(campeonato)) {
                        await Promise.all([
                            page.waitForNavigation(),
                            page.evaluate((el: HTMLSpanElement) => el.click(), link),
                        ])

                        const url = page.url();
                        const id = new URL(url).pathname.split('/').filter(Boolean).pop();
                        campeonatosWithUrl.set(campeonato, { id, url });

                        await Promise.all([
                            page.waitForNavigation(),
                            page.goBack(),
                        ]);

                        links = await ((await page.$(".sportName")).$$(".event__title--name"))
                    }
                }

                return campeonatosWithUrl;
            });

            for (var campeonatoWithUrl of campeonatosWithUrl) {
                const campeonatoData = campeonatoWithUrl[1]
                const campeonatoNome = campeonatoWithUrl[0]
                const newCampeonato = {
                    id: campeonatoData.id,
                    link: campeonatoData.url,
                    nome: campeonatoNome,
                };
                await this.campeonatosService.create(newCampeonato)
            }
        } catch (e: unknown) {
            const message = `Erro ao tentar fazer scraping da url ${options.url}: `
            if (e instanceof Error) {
                this.logger.error(message + e.message, e.stack)
            } else {
                this.logger.error(message + e)
            }
        }
    }

    private async scrapeCampeonato(options: {
        campeonatoToScrape: Campeonato,
        page: Page,
    }) {
        try {
            await ScraperUtils.scrapePage({ url: options.campeonatoToScrape.link, page: options.page }, async (page) => {

                const campeonato = await page.evaluate(() => {
                    const nome = document.querySelector(".heading__name").textContent;
                    const ano = document.querySelector(".heading__info").textContent;
                    const urlImagem = document.querySelector<HTMLImageElement>(".heading__logo").src;

                    return {
                        id: "",
                        link: "",
                        nome: nome,
                        ano: ano,
                        logo: urlImagem,
                    };
                }).then(async (scrapedCampeonato) => {
                    scrapedCampeonato.id = options.campeonatoToScrape.id;
                    scrapedCampeonato.link = options.campeonatoToScrape.link;
                    scrapedCampeonato.logo = await ImageUtils.convertImageUrlToBase64(scrapedCampeonato.logo, 30, 30);
                    return scrapedCampeonato;
                });

                const savedCampeonato = await this.campeonatosService.findOne(campeonato.id);

                if (savedCampeonato && savedCampeonato.ano != null && campeonato.ano > savedCampeonato.ano) {
                    await this.posicaoService.removeWithCampeonatoId(campeonato.id);
                    await this.partidasService.removeWithCampeonatoId(campeonato.id);
                }

                await this.campeonatosService.create(campeonato)

                await this.scrapePartidasForCampeonato({
                    page: page,
                    campeonatoId: campeonato.id,
                    nomeCampeonato: campeonato.nome,
                    linkCampeonato: campeonato.link,
                });
                await this.scrapeClassificacoesForCampeonato({
                    page: page,
                    campeonatoId: campeonato.id,
                    campeonatoLink: campeonato.link
                });
            });
        } catch (e: unknown) {
            const message = `Exception ao tentar fazer scraping do campeonato ${options.campeonatoToScrape.id} (${options.campeonatoToScrape.nome}): `
            if (e instanceof Error) {
                this.logger.error(message + e.message, e.stack)
            } else {
                this.logger.error(message + e)
            }
        }
    }

    private async scrapeClassificacoesForCampeonato(options: {
        page: Page,
        campeonatoLink: string,
        campeonatoId: string,
    }) {
        const classificacaoUrl = options.campeonatoLink + "classificacao";

        await ScraperUtils.scrapePage({ url: classificacaoUrl, page: options.page }, async (page) => {
            const posicoes = await Promise.all(await page
                .evaluate(() => {
                    return [...document.querySelectorAll<HTMLDivElement>(".ui-table")]
                        .flatMap((tabela, index) => {
                            const nomeTabela = tabela.querySelector(".ui-table__header > .table__headerCell--participant").textContent;

                            return [...tabela.querySelectorAll(".ui-table__body > .ui-table__row")].map((element) => {
                                const posicao = element.querySelector(".tableCellRank").textContent;
                                const nomeTime = element.querySelector(".tableCellParticipant__name").textContent;
                                const escudoUrl = element.querySelector<HTMLImageElement>(".participant__image").src;

                                const colunas = element.querySelectorAll(".table__cell--value");
                                const jogos = colunas[0].textContent;
                                const vitorias = colunas[1].textContent;
                                const empates = colunas[2].textContent;
                                const derrotas = colunas[3].textContent;
                                const score = colunas[4].textContent.split(":");
                                const golsFeitos = parseInt(score[0]) | 0;
                                const golsSofridos = parseInt(score[1]) | 0;
                                const saldoGols = golsFeitos - golsSofridos;
                                const pontos = colunas[5].textContent;

                                return {
                                    id: "",
                                    posicao: posicao.replace(/\D/g, ""),
                                    nomeTime: nomeTime.includes("Flamengo") ? "Flamengo" : nomeTime,
                                    escudoTime: escudoUrl,
                                    pontos: pontos,
                                    jogos: jogos,
                                    vitorias: vitorias,
                                    empates: empates,
                                    derrotas: derrotas,
                                    golsFeitos: golsFeitos,
                                    golsSofridos: golsSofridos,
                                    saldoGols: saldoGols,
                                    campeonatoId: "",
                                    classificacaoName: nomeTabela,
                                    classificacaoIndex: index,
                                };
                            });
                        });
                })
                .then(async (posicoes) => posicoes.map(async (posicao) => {
                    posicao.campeonatoId = options.campeonatoId;
                    posicao.id = posicao.nomeTime + posicao.classificacaoIndex + posicao.campeonatoId;
                    posicao.escudoTime = await ImageUtils.convertImageUrlToBase64(posicao.escudoTime, 20, 20);
                    return posicao;
                })
                ));

            if (posicoes.length > 0) {
                await this.campeonatosService.update(options.campeonatoId, { possuiClassificacao: true });
            }

            for (var posicao of posicoes) {
                await this.posicaoService.create(posicao);
            }
        })
    }

    private async scrapePartidasForCampeonato(options: {
        linkCampeonato: string,
        campeonatoId: string,
        nomeCampeonato: string,
        page: Page,
    }) {
        const resultadosUrl = options.linkCampeonato + "resultados";
        const calendarioUrl = options.linkCampeonato + "calendario";

        await ScraperUtils.scrapePage({ url: resultadosUrl, page: options.page });

        // Partidas da lista de resultados são dos mais recentes para os mais antigos, por isso é passado reverseRounds = true, para que a lista fique dos mais antigos para os mais novos.
        const roundLength = await this.scrapeRoundsFromPage({
            page: options.page,
            campeonatoId: options.campeonatoId,
            nomeCampeonato: options.nomeCampeonato,
            reverseRounds: true,
            startingRoundIndex: 0,
        });

        await ScraperUtils.scrapePage({ url: calendarioUrl, page: options.page });

        await this.scrapeRoundsFromPage({
            page: options.page,
            campeonatoId: options.campeonatoId,
            nomeCampeonato: options.nomeCampeonato,
            reverseRounds: false,
            startingRoundIndex: roundLength,
        });
    }


    /**
     * Faz o scrape das rodadas na página, e retorna o número de rodadas salvas
     */
    private async scrapeRoundsFromPage(options: {
        page: Page,
        campeonatoId: string,
        nomeCampeonato: string,
        reverseRounds: boolean,
        startingRoundIndex: number,
    }): Promise<number> {

        const cookieConsentButton = await options.page.$("#onetrust-accept-btn-handler");
        if (cookieConsentButton) {
            await Promise.all([
                options.page.evaluate((consentButton: HTMLElement) => consentButton.click(), cookieConsentButton).catch(e => null),
                options.page.waitForNavigation({ waitUntil: ['networkidle0', 'domcontentloaded'] }).catch(e => null),
            ]);
        }

        for (var moreButton: ElementHandle<Element>; moreButton = await options.page.$(".event__more");) {
            await Promise.all([
                options.page.evaluate((moreButton: HTMLAnchorElement) => moreButton.click(), moreButton).catch(e => null),
                options.page.waitForNavigation({ waitUntil: ['networkidle0', 'domcontentloaded'] }).catch(e => null),
            ]);
        }

        const partidasWithRounds = await options.page
            .evaluate((reverseRounds, startingRoundIndex) => {
                const rounds = [...document.querySelectorAll<HTMLDivElement>(".sportName > div")]
                    .reduce<HTMLDivElement[][]>((result, value) => {
                        if (value.classList.contains("event__round")) {
                            result.push([value])
                        } else if (value.classList.contains("event__match")) {
                            result[result.length - 1].push(value);
                        }

                        return result;
                    }, [])

                if (reverseRounds) rounds.reverse();

                const partidas = rounds.flatMap((chunk, index) => {
                    const roundName = chunk[0].innerHTML;
                    const roundIndex = index + startingRoundIndex;

                    return chunk
                        .filter((element, index) => index != 0)
                        .map((element) => {
                            const dataText = element.querySelector(".event__time").textContent;
                            const timeCasa = element.querySelector(".event__participant--home").textContent;
                            const timeFora = element.querySelector(".event__participant--away").textContent;
                            const golsCasa = element.querySelector(".event__score--home").textContent;
                            const golsFora = element.querySelector(".event__score--away").textContent;
                            const escudoCasaUrl = element.querySelector<HTMLImageElement>(".event__logo--home").src;
                            const escudoForaUrl = element.querySelector<HTMLImageElement>(".event__logo--away").src;

                            return {
                                id: element.id,
                                data: dataText,
                                timeCasa: timeCasa.includes("Flamengo") ? "Flamengo" : timeCasa,
                                timeFora: timeFora.includes("Flamengo") ? "Flamengo" : timeFora,
                                golsCasa: golsCasa,
                                golsFora: golsFora,
                                campeonato: "",
                                campeonatoId: "",
                                partidaFlamengo: [timeCasa, timeFora].some(time => time.includes("Flamengo")),
                                escudoCasa: escudoCasaUrl,
                                escudoFora: escudoForaUrl,
                                rodadaName: roundName,
                                rodadaIndex: roundIndex,
                            }
                        });
                });

                return {
                    roundsSize: rounds.length,
                    partidas: partidas,
                };
            }, options.reverseRounds, options.startingRoundIndex)
            .then(async (partidasWithRounds) => {
                partidasWithRounds.partidas = await Promise.all(partidasWithRounds.partidas.map(async partida => {
                    partida.campeonato = options.nomeCampeonato;
                    partida.campeonatoId = options.campeonatoId;

                    const data = moment(partida.data, "DD.MM. HH:mm").toDate() || moment(partida.data, "DD.MM.YYYY").toDate();
                    partida.data = data.getTime().toString();

                    partida.escudoCasa = await ImageUtils.convertImageUrlToBase64(partida.escudoCasa, 30, 30);
                    partida.escudoFora = await ImageUtils.convertImageUrlToBase64(partida.escudoFora, 30, 30);
                    return partida;
                }));

                return partidasWithRounds;
            });

        for (var partida of partidasWithRounds.partidas) {
            await this.partidasService.create(partida);
        }

        return partidasWithRounds.roundsSize;
    }
}
