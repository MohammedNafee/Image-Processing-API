import express from "express";
import resizedImages from "./api/imageProcessingController.ts";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("List of images");
});

routes.use("/", resizedImages);

export default routes;
