import supertest from "supertest";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { processImage } from "../services/imageProcesser.js";
import processedImages from "../routes/api/imageProcessingController.js";
const app = express();
app.use("/", processedImages);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
describe("Image Processing Functionality", () => {
    const testFilePath = path.resolve(__dirname, "../../assets/full/encenadaport.jpg");
    const outputFilePath = path.resolve(__dirname, "../../assets/thumbs/encenadaport_200x100.jpg");
    const testWidth = 200;
    const testHeight = 100;
    afterAll(() => {
        // Clean up the generated test image after tests
        if (fs.existsSync(outputFilePath)) {
            fs.unlinkSync(outputFilePath);
        }
    });
    it("should resize an image to the specified dimensions", async () => {
        // Ensure the test image exists
        if (!fs.existsSync(testFilePath)) {
            // Fail the test if the test image is missing
            fail(`Test image missing: ${testFilePath}. Please add a testImage.jpg to assets/full.`);
            return;
        }
        try {
            await processImage(testFilePath, outputFilePath, testWidth, testHeight);
        }
        catch (error) {
            fail(`Image processing failed: ${error}`);
        }
        expect(fs.existsSync(outputFilePath)).toBe(true);
        console.log("Passed: Image resized successfully");
    });
    it("should throw an error if width or height is invalid", async () => {
        try {
            await processImage(testFilePath, outputFilePath, NaN, testHeight);
            fail("Expected an error for invalid width");
        }
        catch (err) {
            if (err instanceof Error) {
                expect(err.message).toMatch("Width and height must be valid numbers");
            }
            else {
                fail("Thrown value is not an Error");
            }
        }
        try {
            await processImage(testFilePath, outputFilePath, testWidth, -100);
            fail("Expected an error for non-positive height");
        }
        catch (err) {
            if (err instanceof Error) {
                expect(err.message).toMatch("Width and height must be positive numbers");
            }
            else {
                fail("Thrown value is not an Error");
            }
        }
        console.log("Passed: Error thrown for invalid dimensions");
    });
    it("should throw an error if the input file does not exist", async () => {
        const fakeFile = path.resolve(__dirname, "../../assets/full/nonexistent.jpg");
        try {
            await processImage(fakeFile, outputFilePath, testWidth, testHeight);
            fail("Expected an error for missing input file");
        }
        catch (err) {
            if (err instanceof Error) {
                expect(err.message).toMatch("Input file .* not found");
            }
            else {
                fail("Thrown value is not an Error");
            }
        }
        console.log("Passed: Error thrown for missing input file");
    });
});
describe("GET /images", () => {
    const filename = "encenadaport";
    const width = 200;
    const height = 200;
    const thumbsDir = path.join(__dirname, "../../assets/thumbs");
    const fullDir = path.join(__dirname, "../../assets/full");
    const thumbPath = path.join(thumbsDir, `${filename}_${width}x${height}.jpg`);
    const fullImagePath = path.join(fullDir, `${filename}.jpg`);
    beforeAll(() => {
        // Ensure thumbs directory exists
        if (!fs.existsSync(thumbsDir)) {
            fs.mkdirSync(thumbsDir, { recursive: true });
        }
        // Remove the test thumb if it exists
        if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
        }
    });
    afterAll(() => {
        // Clean up the generated thumb
        if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
        }
    });
    it("should return 400 if required query parameters are missing", async () => {
        const response = await supertest(app).get("/images");
        expect(response.status).toBe(400);
        expect(response.text).toContain("Missing required query parameters");
        console.log("Passed: returns 400 if required query parameters are missing");
    });
    it("should return 404 if the source image does not exist", async () => {
        const response = await supertest(app)
            .get("/images")
            .query({ filename: "nonexistentfile", width, height });
        expect(response.status).toBe(404);
        expect(response.text).toContain(`Input file "nonexistentfile.jpg" not found.`);
        console.log("Passed: returns 404 if the source image does not exist");
    });
    it("should return 400 if width or height is not a number", async () => {
        const response = await supertest(app).get("/images?filename=encenadaport&width=abc&height=200");
        expect(response.status).toBe(400);
        expect(response.text).toContain("Width and height must be valid numbers.");
        console.log("Passed: returns 400 if width or height is not a number");
    });
    it("should return 400 if width or height is non-positive", async () => {
        const response = await supertest(app).get("/images?filename=encenadaport&width=0&height=-100");
        expect(response.status).toBe(400);
        expect(response.text).toContain("Width and height must be positive numbers.");
        console.log("Passed: returns 400 if width or height is non-positive");
    });
    it("should resize and cache the image on first access", async () => {
        // Make sure the source image exists for this test to pass!
        if (!fs.existsSync(fullImagePath)) {
            // Fail the test if the source image is missing
            fail(`Source image missing: ${fullImagePath}. Please add encenadaport.jpg to assets/full.`);
            return;
        }
        const response = await supertest(app).get("/images").query({ filename, width, height });
        expect(response.status).toBe(200);
        expect(fs.existsSync(thumbPath)).toBe(true);
        expect(response.headers["content-type"]).toContain("image");
        console.log("Passed: resizes and caches the image on first access");
    });
    it("should serve the cached image on subsequent access", async () => {
        // This assumes the previous test has run and the thumb exists
        if (fs.existsSync(thumbPath)) {
            const response = await supertest(app).get("/images").query({ filename, width, height });
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toContain("image");
            console.log("Passed: serves the cached image on subsequent access");
        }
    });
});
//# sourceMappingURL=resizedImagesSpec.js.map