import { Router, type Request, type RequestHandler, type Response } from "express";
import { type ServiceResult, VehicleService } from "../services/VehicleService";

function sendResult<T>(res: Response, result: ServiceResult<T>) {
  if (!result.ok) {
    return res.status(result.statusCode).json({
      error: result.error,
    });
  }

  return res.json(result.data);
}

function serviceHandler<T>(
  action: (req: Request) => Promise<ServiceResult<T>>,
  logMessage: string,
  errorMessage: string
): RequestHandler {
  return async (req, res) => {
    try {
      return sendResult(res, await action(req));
    } catch (error) {
      console.error(logMessage, error);

      return res.status(500).json({
        error: errorMessage,
      });
    }
  };
}

export function createVehicleRouter(vehicleService: VehicleService) {
  const router = Router();

  router.get(
    "/",
    serviceHandler(
      () => vehicleService.getVehicle(),
      "Failed to fetch vehicle:",
      "Failed to fetch vehicle"
    )
  );

  router.patch(
    "/lock",
    serviceHandler(
      (req) => vehicleService.setLockState(req.body.locked),
      "Failed to update vehicle lock state:",
      "Failed to update vehicle lock state"
    )
  );

  router.post(
    "/charging/start",
    serviceHandler(
      () => vehicleService.startCharging(),
      "Failed to start vehicle charging:",
      "Failed to start vehicle charging"
    )
  );

  router.post(
    "/charging/stop",
    serviceHandler(
      () => vehicleService.stopCharging(),
      "Failed to stop vehicle charging:",
      "Failed to stop vehicle charging"
    )
  );

  router.post(
    "/climate/start",
    serviceHandler(
      () => vehicleService.startClimate(),
      "Failed to start vehicle climate:",
      "Failed to start vehicle climate"
    )
  );

  router.post(
    "/climate/stop",
    serviceHandler(
      () => vehicleService.stopClimate(),
      "Failed to stop vehicle climate:",
      "Failed to stop vehicle climate"
    )
  );

  return router;
}
