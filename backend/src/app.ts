import cors from "cors";
import express from "express";
import { createVehicleRouter } from "./modules/vehicle/vehicle.routes";
import { VehicleService } from "./modules/vehicle/vehicle.service";

type AppDependencies = {
  vehicleService: VehicleService;
};

export function createApp({ vehicleService }: AppDependencies) {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
    });
  });

  app.use("/api/vehicle", createVehicleRouter(vehicleService));

  return app;
}
