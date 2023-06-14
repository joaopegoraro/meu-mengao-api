import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { CampeonatosService } from '../campeonatos/campeonatos.service';
import { PartidaService } from '../partida/partida.service';
import { ImageUtils } from '../utils/image-utils';
import { ScraperUtils } from './scraper-utils';

@Injectable()
export class PartidasScraperService {
    constructor(
        private readonly partidasService: PartidaService,
        private readonly campeonatosService: CampeonatosService
    ) { }

    async scrapePartidas() {
        await this.scrapeResultados();
        await this.scrapeCalendario();
    }

    private async scrapeResultados() {
        const resutadosUrl = "https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/resultados/";
        await this.scrapePartidasFromUrl(resutadosUrl);
    }

    private async scrapeCalendario() {
        const calendarioUrl = "https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/calendario/";
        await this.scrapePartidasFromUrl(calendarioUrl);
    }

    private async scrapePartidasFromUrl(url: string) {
        try {
            const campeonatosWithUrl = await ScraperUtils.scrapePage({ url }, async (page) => {
                // Fecha sheet de consentimentos de cookies
                (await page.$("#onetrust-accept-btn-handler")).click();


                const partidas = await Promise.all(await page
                    .evaluate(() => {
                        return [...document.querySelectorAll<HTMLDivElement>(".sportName > div")]
                            .reduce<HTMLDivElement[][]>((result, value) => {
                                if (value.classList.contains("event__header")) {
                                    result.push([value])
                                } else {
                                    result[result.length - 1].push(value);
                                }

                                return result;
                            }, [])
                            .flatMap((chunk) => {
                                const campeonato = chunk[0].querySelector<HTMLSpanElement>(".event__title--name").textContent;

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
                                            campeonato: campeonato,
                                            campeonatoId: "",
                                            partidaFlamengo: true,
                                            escudoCasa: escudoCasaUrl,
                                            escudoFora: escudoForaUrl,
                                        }
                                    });
                            });
                    })
                    .then(async (partidas) =>
                        partidas.map(async partida => {
                            const data = moment(partida.data, "DD.MM. HH:mm").toDate() || moment(partida.data, "DD.MM.YYYY").toDate();
                            partida.data = data.getTime().toString();

                            partida.escudoCasa = await ImageUtils.convertImageUrlToBase64(partida.escudoCasa, 30, 30);
                            partida.escudoFora = await ImageUtils.convertImageUrlToBase64(partida.escudoFora, 30, 30);
                            return partida;

                        })
                    ));

                const campeonatosWithUrl = new Map<string, { id: string, url: string }>();
                let links = await ((await page.$(".sportName")).$$(".event__title--name"))
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];

                    const campeonato = (await (await link.getProperty("innerText")).jsonValue()).toString();

                    if (![...campeonatosWithUrl.keys()].includes(campeonato)) {
                        await Promise.all([
                            page.evaluate((el: HTMLSpanElement) => el.click(), link),
                            page.waitForNavigation(),
                        ])

                        const url = page.url();
                        const id = new URL(url).pathname.split('/').filter(Boolean).pop();
                        campeonatosWithUrl.set(campeonato, { id, url });

                        await Promise.all([
                            page.goBack(),
                            page.waitForNavigation(),
                        ]);

                        links = await ((await page.$(".sportName")).$$(".event__title--name"))
                    }
                }

                for (var partida of partidas) {
                    const campeonatoData = campeonatosWithUrl.get(partida.campeonato);
                    partida.campeonatoId = campeonatoData.id;
                    await this.partidasService.create(partida);
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
        } catch (exception) {
            console.log(`Exception ao tentar fazer scraping da url ${url}: ` + exception)
        }
    }

}

