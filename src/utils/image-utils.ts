import axios from "axios";
import sharp from "sharp";

export class ImageUtils {

    static readonly DEFAULT_WIDTH = 90;
    static readonly DEFAULT_HEIGHT = 120;

    static async convertImageUrlToBase64(
        imageUrl: string,
        width: number = this.DEFAULT_WIDTH,
        height: number = this.DEFAULT_HEIGHT,
    ) {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        const image = await sharp(buffer)
            .resize(width, height)
            .toBuffer();
        return image.toString('base64');
    }
}