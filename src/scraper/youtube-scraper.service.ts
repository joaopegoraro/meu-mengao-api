import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { NoticiasService } from '../noticias/noticias.service';
import { ImageUtils } from '../utils/image-utils';

@Injectable()
export class YoutubeScraperService {
    constructor(
        private readonly httpService: HttpService,
        private readonly noticiasService: NoticiasService,
    ) { }


    async scrapeYoutube() {
        await this.scrapeVeneCasagrande();
        await this.scrapeFlaTV();
        await this.scrapeMauroCezar();
    }

    private async scrapeVeneCasagrande() {
        const veneCasagrandeChannelId = "UC084Mraf1n0rUIhz0V3sZfg"
        this.scrapeYoutubeChannel(veneCasagrandeChannelId);
    }

    private async scrapeFlaTV() {
        const flaTVChannelId = "UCOa-WaNwQaoyFHLCDk7qKIw"
        this.scrapeYoutubeChannel(flaTVChannelId);
    }

    private async scrapeMauroCezar() {
        const mauroCezarChannelId = "UCRcRAyb5Y4x3HVNKBZ9SMLA"
        this.scrapeYoutubeChannel(mauroCezarChannelId);
    }

    private async scrapeYoutubeChannel(channelId: string) {
        const invidiousUrl = "https://vid.puffyan.us/api/v1/channels/";
        const youtubeUrl = "https://www.youtube.com/watch?v=";

        const response = await axios.get(invidiousUrl + channelId)
        const video = response.data["latestVideos"][0];

        // Thumbnail 5 é a 'default', de tamanho 120x90
        const thumbnail = video["videoThumbnails"][5];

        // Thumbnail do autor 2 tem tamanho 76x76
        const logo = response.data["authorThumbnails"][2];

        const noticia = {
            titulo: video["title"],
            link: youtubeUrl + video["videoId"],
            site: video["author"],
            data: video["published"],
            logoSite: await ImageUtils.convertImageUrlToBase64(logo["url"], 76, 76),
            foto: await ImageUtils.convertImageUrlToBase64(thumbnail["url"], 120, 90),
        };

        await this.noticiasService.removeWithSite(noticia.site);
        await this.noticiasService.create(noticia);
    }

}

