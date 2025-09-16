import express from 'express';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
const resizedImages = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
resizedImages.get('/images', async (req, res) => {
    const { filename, width, height } = req.query;
    if (!filename || !width || !height) {
        return res
            .status(400)
            .send('Missing required query parameters: filename, width, height');
    }
    const inputPath = path.join(__dirname, '../../../assets/full', `${filename}.jpg`);
    const outputPath = path.join(__dirname, '../../../assets/thumbs', `${filename}_${width}x${height}.jpg`);
    if (fs.existsSync(outputPath)) {
        return res.sendFile(outputPath);
    }
    console.log('Input path:', inputPath);
    console.log('Output path:', outputPath);
    try {
        await sharp(inputPath)
            .resize(parseInt(width, 10), parseInt(height, 10))
            .toFile(outputPath);
        return res.sendFile(outputPath);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Error processing image');
    }
});
export default resizedImages;
//# sourceMappingURL=resizedImages.js.map