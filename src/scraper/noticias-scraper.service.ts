import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { NoticiasService } from '../noticias/noticias.service';

@Injectable()
export class NoticiasScraperService {
    constructor(
        private readonly httpService: HttpService,
        private readonly noticiasService: NoticiasService,
    ) { }

    private readonly logoBase64GE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE3ElEQVR4AbxWA3QtSxDcaJNv27Zt/+Dbtm3btm1dxbZt27ad+l1zso8Xz5XTZ+5mert6umtmR1OA5saB8DL5H+Zt8/9At/hnev3n16Gb/CZ0k++8jFg9U+9MMAZjMSZjk2N5TuOH6Srd2xrwnm4NGNNDL4QeFADd6g/dzGBrZnyXMRiLMRmbHOQyuEnsochN/uF69CWLhL5zagX/+S2sKblhjMFYjMnY5CAXORU3IWV6T4+5hMTT64TUeTLT5CKnRsjEwbrZf0pKJas2yNerLZCLnOTWvE2+H+uhF6iy02FDGLnISW5NHnJEJKpPGzCBeXKSm/3voFJd9J7CsT+3Br7kIie5NbXPzY4DbWy+QP32/M8XPmZ/bGQO4Mg5jo58OfKZPg63KLk1R6X3ESK3f8+D9uepKuBmloug/XM2tL/PgBr/PVeNhq/7f4bv+cqXo/bXqRLjXM47bIXmiFz75yzsHHQ1Pqg0IbuvElUjLYjpyoNv0jN4ufRXpPaU4pXS3+D2zzmSzDnYMfBKvFvxDzJ6y1Epvhl95fi42oLdQq5jLIdJaHZXLis7JOI2NIx2YkUsyN/0/AyI1N5SaH+chIPFt3akDfbQMt6DwyPvhLuRhLMEvMW8TL7YWMbCwToYKBtuwh8N0cjurwIxtzCvLLwjG55/n4mCgVoQ43NT+LImCNdmvIGva0MwtZho4UAdNmJscjhLgKLR/joN12S8CQOmlmRsLBpgf93/Pguf1dhg4L+WJJyf/CyI+YUFPFv8A7TfjxednCnjifis2qb+T1yc+rLEPp0idp4AiZg9Sz05N40DpbwU3ubWi+Emvd428Ar0TA2C+Ks5Hq+X/UFfqcgcKoabUT7UhOqRVpQNNaJ2tF1VivPvV/7H2ORwncA/zQkgeqeGsa3tclU6tfUke66gXFqiEmiKx6eySoIJ2APJiW9kUaucwEdVZvUisz874Ukp5wlCzLlTVEXGZidB/C0VeL74J/qqUt+b9wmOkPkz4x/HKXGP4Iiou3FszP04MfZB7BB0Fbemcw1wdSz3uYlPL/Z1XpXyhJj7sIXMHRx+C5J7ihUhYRZ9HBfz4BLfyI4cJWDtt2PFjsGFKS8gQoQa11WAi1JehNtfZzjXAM1bSs0t868IzMCslLdO+kpNLFvWqM5c2YYnwtaaCgMtEz2qNdEytyyOjLpH4p4NH5cJmHhGn48t5DT7vTFWlXZZpMne75jsBxHWnqVatpX1EgS2pcEeeqeGcHnaK9wBrs+BZZNgYO2341UPHy/8RqndT07BvUNvxNDMmKrCLw1Ratuyr5qciBdKmSk2bk8K+bniH7GP+LOtq3wS8iCiWL6rC8MtWe+rl7VfjqJRhFKVGBi4M+cjlegmlguZtPiezmcmxZHGY9rou11b7mNEpfPl27M/NDgoQllNIv5sikOV6MAA27CN7VImS3JDxNxJjMPR6deQRu7lPscMQKXek/MJRmcn4AgjMsePEqvDd9b0xkzulS4kqpT/nIlDI+7AO/J1S+8tQ/tEH7omB1Ay2IAf6sNxmHxcnPWVtqoXErtXMpaN33r20ENKvLXtMjmCL+dq2SLOkXzdXMkcXEqZhHFsShLn8cJBgTIJkq/LS6nraznbomxdXsst/pPk1v7fQHdMBrxrNuCd0wHvngMANOrfDIKHn/cAAAAASUVORK5CYII=";

    async scrapeNoticias() {
        await this.scrapeGE();
    }

    private async scrapeGE() {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.goto("https://ge.globo.com/futebol/times/flamengo/");

        const noticias = await Promise.all(await page.evaluate(() => {
            const noticiasPrincipais = [...document.querySelectorAll(".bstn-hl")]
                .filter((element) => ![...element.classList.values()].includes("type-eventos-esportivos"))
                .map((element) => {
                    const anchor = element.querySelector<HTMLAnchorElement>(".bstn-hl-link");
                    const title = element.querySelector(".bstn-hl-title");
                    const imageUrl = window
                        .getComputedStyle(element)
                        .getPropertyValue("--bstn-hl-cover")
                        .match(/url\("(.*)"/)[1];

                    const data = new Date(Date.now());
                    data.setHours(data.getHours() - 1.5);

                    return {
                        titulo: title.textContent,
                        link: anchor.href,
                        site: anchor.host,
                        data: data.getTime().toString(),
                        logoSite: "",
                        foto: imageUrl,
                    };
                });

            const noticiasSecundarias = [...document.querySelectorAll(".feed-post-body")]
                .slice(0, 3)
                .map((element) => {
                    const anchor = element.querySelector<HTMLAnchorElement>(".feed-post-link");
                    const horasAtras = element.querySelector<HTMLSpanElement>(".feed-post-datetime")
                        // "Há 7 horas" || "Ontem"
                        .innerText
                        .match(/\d/g)
                        // "7" || ""
                        .join("");

                    const data = new Date(Date.now());
                    if (horasAtras == "") {
                        data.setHours(data.getHours() - 24);
                    } else {
                        data.setHours(data.getHours() - parseInt(horasAtras));
                    }

                    const imageUrl = element.querySelector<HTMLImageElement>(".bstn-fd-picture-image").src;

                    return {
                        titulo: anchor.innerText,
                        link: anchor.href,
                        site: anchor.host,
                        data: data.getTime().toString(),
                        logoSite: "",
                        foto: imageUrl,
                    };
                });

            return [...noticiasPrincipais, ...noticiasSecundarias];
        }).then((noticias) => noticias.map(async noticia => {
            const response = await axios.get(noticia.foto, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            const image = await sharp(buffer)
                .resize(300, 300)
                .toBuffer();
            const image64 = image.toString('base64');
            noticia.foto = image64;
            noticia.logoSite = this.logoBase64GE;
            return noticia;
        })));

        await browser.close();

        console.log("DELETANDO NOTICIAS");
        await this.noticiasService.removeWithSite(noticias[0].site);

        for (var noticia of noticias) {
            console.log("SALVANDO NOTICIA: " + noticia.data);
            await this.noticiasService.create(noticia);
        }
    }
}

