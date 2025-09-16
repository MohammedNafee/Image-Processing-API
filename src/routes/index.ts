import express from "express";
import resizedImages from "./api/resizedImages.ts";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("List of images");
});

routes.use("/", resizedImages);

export default routes;
