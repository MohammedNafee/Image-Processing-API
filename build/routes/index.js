import express from 'express';
import resizedImages from './api/resizedImages.js';
const routes = express.Router();
routes.get('/', (req, res) => {
    res.send('List of images');
});
routes.use('/', resizedImages);
export default routes;
//# sourceMappingURL=index.js.map