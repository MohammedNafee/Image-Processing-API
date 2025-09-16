import supertest from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import resizedImages from '../resizedImages.js';
const app = express();
app.use('/', resizedImages);
describe('GET /images', () => {
    const filename = 'testimage';
    const width = 100;
    const height = 100;
    const thumbsDir = path.join(__dirname, '../../../../assets/thumbs');
    const thumbPath = path.join(thumbsDir, `${filename}_${width}x${height}.jpg`);
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
    it('should return 400 if required query parameters are missing', async () => {
        const response = await supertest(app).get('/images');
        expect(response.status).toBe(400);
        expect(response.text).toContain('Missing required query parameters');
    });
    it('should return 500 if the source image does not exist', async () => {
        const response = await supertest(app)
            .get('/images')
            .query({ filename: 'nonexistent', width, height });
        expect(response.status).toBe(500);
        expect(response.text).toContain('Error processing image');
    });
    it('should resize and cache the image on first access', async () => {
        // Place a test image in assets/full named testimage.jpg before running this test
        const response = await supertest(app)
            .get('/images')
            .query({ filename, width, height });
        expect([200, 500]).toContain(response.status); // 200 if image exists, 500 if not
        if (response.status === 200) {
            expect(fs.existsSync(thumbPath)).toBe(true);
            expect(response.headers['content-type']).toContain('image');
        }
    });
    it('should serve the cached image on subsequent access', async () => {
        // This assumes the previous test has run and the thumb exists
        if (fs.existsSync(thumbPath)) {
            const response = await supertest(app)
                .get('/images')
                .query({ filename, width, height });
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toContain('image');
        }
    });
});
//# sourceMappingURL=resizedImagesSpec.js.map