import express, { Application } from "express";
import { AppDataSource } from "../loaders/dbLoader";
import cors from "cors";
// import { dbLoader } from "../loaders/dbLoader";
import routeLoader from "./routeLoader";
import { errorHandler } from "../api/middlewares/errorHandler";
import responseTime from "../api/middlewares/responseTime";

export default async function expressLoader(
  app: Application
): Promise<Application> {
  try {
    // const db = await dbLoader();
    const corsOptions = {
      origin: ["http://localhost:8080"],
      credentials: true,
    };
    app.use(responseTime);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cors(corsOptions));

    // app.set("db", db);
    app.set("connection", AppDataSource);

    routeLoader(app);
    app.use(errorHandler);

    return app;
  } catch (error) {
    console.error(
      "Error occurred during Express loader initialization:",
      error
    );
    throw error;
  }
}