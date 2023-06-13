import { Injectable } from '@nestjs/common';
import moment from 'moment';
import puppeteer, { Page } from 'puppeteer';
import { CampeonatosService } from '../campeonatos/campeonatos.service';
import { Campeonato } from '../campeonatos/entities/campeonato.entity';
import { ClassificacaoService } from '../classificacao/classificacao.service';
import { PartidaService } from '../partida/partida.service';
import { ImageUtils } from '../utils/image-utils';

@Injectable()
export class CampeonatosScraperService {
    constructor(
        private readonly partidasService: PartidaService,
        private readonly campeonatosService: CampeonatosService,
        private readonly classificacaoService: ClassificacaoService
    ) { }

    async scrapeCampeonatos() {
        const campeonatos = await this.campeonatosService.findAll();
        for (var campeonato of campeonatos) {
            await this.scrapeCampeonatoFromUrl(campeonato.link);
        }
    }

    private async scrapeCampeonatoFromUrl(url: string) {
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
            ]
        });
        const page = await browser.newPage();

        const campeonato = await page.evaluate(() => {
            const nome = document.querySelector(".heading__name").textContent;
            const ano = document.querySelector(".heading__info").textContent;
            const urlImagem = document.querySelector<HTMLImageElement>(".heading__logo").src;

            return {
                id: url,
                link: url,
                nome: nome,
                ano: ano,
                logo: urlImagem,
            };
        }).then(async (campeonato) => {
            campeonato.logo = await ImageUtils.convertImageUrlToBase64(campeonato.logo, 30, 30);
            return campeonato;
        });

        const savedCampeonato = await this.campeonatosService.findOne(campeonato.id);

        if (campeonato.ano > savedCampeonato.ano) {
            await this.classificacaoService.removeWithCampeonatoId(campeonato.id);
            await this.partidasService.removeWithCampeonatoId(campeonato.id);
        }

        await browser.close();

        this.campeonatosService.create(campeonato)

        await this.scrapePartidasForCampeonato(page, campeonato);
    }

    private async scrapePartidasForCampeonato(
        page: Page,
        campeonato: Campeonato,
    ) {
        const resultadosUrl = campeonato.link + "resultados";
        const calendarioUrl = campeonato.link + "calendario";

        await page.goto(resultadosUrl, {
            waitUntil: 'networkidle0',
        });

        const roundLength = await this.scrapeRoundsFromPage(page, campeonato, true, 0);

        await page.goto(calendarioUrl, {
            waitUntil: 'networkidle0',
        });

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
            .evaluate(() => {
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
                                timeCasa: timeCasa,
                                timeFora: timeFora,
                                golsCasa: golsCasa,
                                golsFora: golsFora,
                                campeonato: "",
                                campeonatoId: "",
                                partidaFlamengo: [timeCasa, timeFora].some(time => time == "Flamengo"),
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
            })
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

