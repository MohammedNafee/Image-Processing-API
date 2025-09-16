import express from "express";
import resizedImages from "./api/imageProcessingController.js";
const routes = express.Router();
routes.get("/", (req, res) => {
    res.send("List of images");
});
routes.use("/", resizedImages);
export default routes;
//# sourceMappingURL=index.js.map