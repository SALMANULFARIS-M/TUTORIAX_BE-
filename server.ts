declare module 'express';

import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

app.use(
    cors({
      credentials: true,
      origin: [process.env.ORIGIN as string],
    })
  );
  app.use(express.static(path.join(__dirname, "public/images/")));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.json());

  mongoose
  .connect(process.env.MONGODBSERVER as string)
  .then(() => {
    app.listen(process.env.PORT as string, () => {
      console.log("Database connected and Working On " + process.env.PORT);
    });
  })
  .catch((err: Error) => {
    console.log(err);
  });
