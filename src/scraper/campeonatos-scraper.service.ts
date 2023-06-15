import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Page } from 'puppeteer';
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
        const campeonatos = await this.campeonatosService.findAll();
        for (var campeonato of campeonatos) {
            await this.scrapeCampeonato(campeonato);
        }
    }

    private async scrapeCampeonato(campeonatoToScrape: Campeonato) {
        try {
            await ScraperUtils.scrapePage({ url: campeonatoToScrape.link, headless: false }, async (page) => {

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
                    scrapedCampeonato.id = campeonatoToScrape.id;
                    scrapedCampeonato.link = campeonatoToScrape.link;
                    scrapedCampeonato.logo = await ImageUtils.convertImageUrlToBase64(scrapedCampeonato.logo, 30, 30);
                    return scrapedCampeonato;
                });

                const savedCampeonato = await this.campeonatosService.findOne(campeonato.id);

                if (savedCampeonato && savedCampeonato.ano != null && campeonato.ano > savedCampeonato.ano) {
                    await this.posicaoService.removeWithCampeonatoId(campeonato.id);
                    await this.partidasService.removeWithCampeonatoId(campeonato.id);
                }

                await this.campeonatosService.create(campeonato)

                await this.scrapePartidasForCampeonato(page, campeonato);
                await this.scrapeClassificacoesForCampeonato(page, campeonato);
            });
        } catch (e: unknown) {
            const message = `Exception ao tentar fazer scraping do campeonato ${campeonatoToScrape.id} (${campeonatoToScrape.nome}): `
            if (e instanceof Error) {
                this.logger.error(message + e.message, e.stack)
            } else {
                this.logger.error(message + e)
            }
        }
    }

    private async scrapeClassificacoesForCampeonato(
        page: Page,
        campeonato: Campeonato,
    ) {
        const classificacaoUrl = campeonato.link + "classificacao";

        await ScraperUtils.scrapePage({ url: classificacaoUrl, page: page }, async (page) => {
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
                                    posicao: posicao,
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
                    posicao.campeonatoId = campeonato.id;
                    posicao.id = posicao.nomeTime + posicao.classificacaoIndex + posicao.campeonatoId;
                    posicao.escudoTime = await ImageUtils.convertImageUrlToBase64(posicao.escudoTime, 20, 20);
                    return posicao;
                })
                ));

            for (var posicao of posicoes) {
                await this.posicaoService.create(posicao);
            }
        })
    }

    private async scrapePartidasForCampeonato(
        page: Page,
        campeonato: Campeonato,
    ) {
        const resultadosUrl = campeonato.link + "resultados";
        const calendarioUrl = campeonato.link + "calendario";

        await ScraperUtils.scrapePage({ url: resultadosUrl, page: page });

        // Partidas da lista de resultados são dos mais recentes para os mais antigos, por isso é passado reverseRounds = true, para que a lista fique dos mais antigos para os mais novos.
        const roundLength = await this.scrapeRoundsFromPage(page, campeonato, true, 0);

        await ScraperUtils.scrapePage({ url: calendarioUrl, page: page });

        await this.scrapeRoundsFromPage(page, campeonato, false, roundLength);
    }


    /**
     * Faz o scrape das rodadas na página, e retorna o número de rodadas salvas
     */
    private async scrapeRoundsFromPage(
        page: Page,
        campeonato: Campeonato,
        reverseRounds: boolean,
        startingRoundIndex: number,
    ): Promise<number> {
        const partidasWithRounds = await page
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
                    const roundName = chunk[0].innerText;
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
                                roundIndex: roundIndex,
                                roundName: roundName,
                            }
                        });
                });

                return {
                    roundsSize: rounds.length,
                    partidas: partidas,
                };
            }, reverseRounds, startingRoundIndex)
            .then(async (partidasWithRounds) => {
                partidasWithRounds.partidas = await Promise.all(partidasWithRounds.partidas.map(async partida => {
                    partida.campeonato = campeonato.nome;
                    partida.campeonatoId = campeonato.id;

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
