import { dirname } from 'path';
import { fileURLToPath } from 'url';
import jimp from "jimp";

class ImageManipulation {
    async preview(text) {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        let textFrame = await jimp.read(__dirname + '/../resources/Text-Frame.png');
        let font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        
        textFrame.print(font, 0, 0, {
        text: text,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        }, 560, 360);

        let template = await jimp.read(__dirname + '/../resources/Template.png');
        template.composite(textFrame, 80, 180);
        
        let image = await template.getBufferAsync(jimp.MIME_PNG)

        return image;
    }

    async save(text, timestamp) {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        let textFrame = await jimp.read(__dirname + '/../resources/Text-Frame.png');
        let font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        
        textFrame.print(font, 0, 0, {
        text: text,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
        }, 560, 360);

        let template = await jimp.read(__dirname + '/../resources/Template.png');
        template.composite(textFrame, 80, 180);
        await template.writeAsync(__dirname + "/../../server_data/igFeed/" + timestamp + ".jpg");

        return true;
    }
};

export default ImageManipulation;