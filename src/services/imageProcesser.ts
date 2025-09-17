import sharp from "sharp";
import fs from "fs";

export async function processImage(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<string> {
  // Validate width & height
  if (isNaN(width) || isNaN(height)) {
    throw new Error("Width and height must be valid numbers.");
  }
  if (width <= 0 || height <= 0) {
    throw new Error("Width and height must be positive numbers.");
  }

  // Validate input file
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file "${inputPath}" not found.`);
  }
  // If already processed, return the existing file path
  if (fs.existsSync(outputPath)) {
    return outputPath;
  }

  await sharp(inputPath).resize(width, height).toFile(outputPath);
  return outputPath;
}

export default { processImage };
