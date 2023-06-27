declare module 'express';
import express, { Application, Request, Response, NextFunction } from "express";
import studentRoutes from "./routes/student_routes";
import adminRoutes from "./routes/admin_routes";
import teacherRoutes from "./routes/teacher_routes";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import * as http from 'http';
import { initializeSocket } from "./socket.io/socketIO";

dotenv.config();
const app: Application = express()


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
app.use("/", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/tutor", teacherRoutes);

// Handle 404 errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not found' });
});

// Handle 500 errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: 'Internal server error' });
});

// Handle 502 errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(502).json({ error: 'Bad gateway' });
});

mongoose
  .connect(process.env.MONGODBSERVER as string)
  .then(() => {
    const server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> = app.listen(process.env.PORT as string, () => {
      console.log("Database connected and Working On " + process.env.PORT);
    });
    initializeSocket(server);
  })
  .catch((err: Error) => {
    next(err);
  });

function next(err: Error) {
  throw new Error("Function not implemented.");
}
