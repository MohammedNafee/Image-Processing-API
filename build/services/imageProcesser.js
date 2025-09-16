import sharp from "sharp";
import fs from "fs";
export async function processImage(inputPath, outputPath, width, height) {
    // If already processed, return the existing file path
    if (fs.existsSync(outputPath)) {
        return outputPath;
    }
    await sharp(inputPath)
        .resize(width, height)
        .toFile(outputPath);
    return outputPath;
}
//# sourceMappingURL=imageProcesser.js.map