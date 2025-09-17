import sharp from "sharp";
import fs from "fs";

export async function processImage(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<string> {
  // If already processed, return the existing file path
  if (fs.existsSync(outputPath)) {
    return outputPath;
  }

  await sharp(inputPath).resize(width, height).toFile(outputPath);
  return outputPath;
}

export default { processImage };
