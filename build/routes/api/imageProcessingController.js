import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { processImage } from "../../services/imageProcesser.js";
const processedImages = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
processedImages.get("/images", async (req, res) => {
    const { filename, width, height } = req.query;
    if (!filename || !width || !height) {
        return res.status(400).send("Missing required query parameters: filename, width, height");
    }
    const inputPath = path.join(__dirname, "../../../assets/full", `${filename}.jpg`);
    const outputPath = path.join(__dirname, "../../../assets/thumbs", `${filename}_${width}x${height}.jpg`);
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
        return res.status(404).send(`Input file "${filename}.jpg" not found.`);
    }
    // Validate width and height
    if (isNaN(Number(width)) || isNaN(Number(height))) {
        return res.status(400).send("Width and height must be valid numbers.");
    }
    // Validate positive dimensions
    if (Number(width) <= 0 || Number(height) <= 0) {
        return res.status(400).send("Width and height must be positive numbers.");
    }
    // Process and send the image
    try {
        const processedPath = await processImage(inputPath, outputPath, parseInt(width, 10), parseInt(height, 10));
        return res.sendFile(processedPath);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Error processing image");
    }
});
export default processedImages;
//# sourceMappingURL=imageProcessingController.js.map