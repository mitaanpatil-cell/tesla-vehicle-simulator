import type { PrismaClient, Vehicle } from "../generated/prisma/client";

type VehicleClient = Pick<PrismaClient, "vehicle">;

type ServiceSuccess<T> = {
  ok: true;
  data: T;
};

type ServiceFailure = {
  ok: false;
  statusCode: number;
  error: string;
};

export type ServiceResult<T> = ServiceSuccess<T> | ServiceFailure;

export class VehicleService {
  private readonly vehicleId = 1;

  constructor(private readonly prisma: VehicleClient) {}

  async getVehicle(): Promise<ServiceResult<Vehicle>> {
    const vehicle = await this.findVehicle();

    if (!vehicle) {
      return this.failure(404, "Vehicle not found");
    }

    return this.success(vehicle);
  }

  async setLockState(locked: unknown): Promise<ServiceResult<Vehicle>> {
    if (typeof locked !== "boolean") {
      return this.failure(400, "locked must be a boolean");
    }

    const vehicle = await this.findVehicle();

    if (!vehicle) {
      return this.failure(404, "Vehicle not found");
    }

    const updatedVehicle = await this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { locked },
    });

    return this.success(updatedVehicle);
  }

  async startCharging(): Promise<ServiceResult<Vehicle>> {
    const vehicle = await this.findVehicle();

    if (!vehicle) {
      return this.failure(404, "Vehicle not found");
    }

    if (vehicle.batteryLevel >= 100) {
      return this.failure(400, "Vehicle battery is already full");
    }

    const updatedVehicle = await this.updateVehicle({
      charging: true,
    });

    return this.success(updatedVehicle);
  }

  async stopCharging(): Promise<ServiceResult<Vehicle>> {
    const vehicle = await this.findVehicle();

    if (!vehicle) {
      return this.failure(404, "Vehicle not found");
    }

    if (!vehicle.charging) {
      return this.failure(400, "Vehicle is not currently charging");
    }

    const updatedVehicle = await this.updateVehicle({
      charging: false,
    });

    return this.success(updatedVehicle);
  }

  async startClimate(): Promise<ServiceResult<Vehicle>> {
    return this.setClimateState(true);
  }

  async stopClimate(): Promise<ServiceResult<Vehicle>> {
    return this.setClimateState(false);
  }

  private async setClimateState(climateOn: boolean): Promise<ServiceResult<Vehicle>> {
    const vehicle = await this.findVehicle();

    if (!vehicle) {
      return this.failure(404, "Vehicle not found");
    }

    const updatedVehicle = await this.updateVehicle({
      climateOn,
    });

    return this.success(updatedVehicle);
  }

  private async findVehicle(): Promise<Vehicle | null> {
    return this.prisma.vehicle.findUnique({
      where: { id: this.vehicleId },
    });
  }

  private async updateVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    return this.prisma.vehicle.update({
      where: { id: this.vehicleId },
      data,
    });
  }

  private success<T>(data: T): ServiceSuccess<T> {
    return {
      ok: true,
      data,
    };
  }

  private failure(statusCode: number, error: string): ServiceFailure {
    return {
      ok: false,
      statusCode,
      error,
    };
  }
}
