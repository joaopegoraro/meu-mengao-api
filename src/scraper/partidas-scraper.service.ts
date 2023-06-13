import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';
import { PartidaService } from '../partida/partida.service';
import { ImageUtils } from '../utils/image-utils';

@Injectable()
export class PartidasScraperService {
    constructor(
        private readonly httpService: HttpService,
        private readonly partidasService: PartidaService,
    ) { }


    async scrapePartidas() {
        await this.scrapeResultados();
        await this.scrapeCalendario();
    }

    @Cron(CronExpression.EVERY_30_SECONDS)
    private async scrapeResultados() {
        const resutadosUrl = "https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/resultados/";
        this.scrapePartidasFromUrl(resutadosUrl);
    }

    private async scrapeCalendario() {
        const calendarioUrl = "https://www.flashscore.com.br/equipe/flamengo/WjxY29qB/calendario/";
        this.scrapePartidasFromUrl(calendarioUrl);
    }

    private async scrapePartidasFromUrl(url: string) {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto(url);

        const partidas = await Promise.all(await page
            .evaluate(() => {
                return [...document.querySelectorAll<HTMLDivElement>(".sportName > div")]
                    // Divide a lista em pares
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
                                const data = element.querySelector(".event__time").textContent;
                                const timeCasa = element.querySelector(".event__participant--home").textContent;
                                const timeFora = element.querySelector(".event__participant--away").textContent;
                                const golsCasa = element.querySelector(".event__score--home").textContent;
                                const golsFora = element.querySelector(".event__score--away").textContent;
                                const escudoCasaUrl = element.querySelector<HTMLImageElement>(".event__logo--home").src;
                                const escudoForaUrl = element.querySelector<HTMLImageElement>(".event__logo--away").src;

                                return {
                                    id: data + timeCasa + timeFora,
                                    data: data,
                                    timeCasa: timeCasa,
                                    timeFora: timeFora,
                                    golsCasa: golsCasa,
                                    golsFora: golsFora,
                                    campeonato: campeonato,
                                    escudoCasa: escudoCasaUrl,
                                    escudoFora: escudoForaUrl
                                }
                            });
                    });
            })
            .then(async (partidas) =>
                partidas.map(async partida => {
                    partida.escudoCasa = await ImageUtils.convertImageUrlToBase64(partida.escudoCasa, 30, 30);
                    partida.escudoFora = await ImageUtils.convertImageUrlToBase64(partida.escudoFora, 30, 30);
                    return partida;
                })
            ));

        console.log(partidas);

        await browser.close();

    }

}

