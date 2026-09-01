import { expect, test, vi } from "vitest";
import { VehicleService } from "../../modules/vehicle/vehicle.service";

const vehicle = {
  id: 1,
  name: "Model 3",
  locked: false,
  batteryLevel: 80,
  charging: false,
  climateOn: false,
};

function createService(vehicleState: typeof vehicle | null, updatedVehicle = vehicle) {
  const fakePrisma = {
    vehicle: {
      findUnique: vi.fn().mockResolvedValue(vehicleState),
      update: vi.fn().mockResolvedValue(updatedVehicle),
    },
  } as any;

  return new VehicleService(fakePrisma);
}

test("vehicle must exist", async () => {
  const service = createService(null);

  const result = await service.getVehicle();

  expect(result).toEqual({
    ok: false,
    statusCode: 404,
    error: "Vehicle not found",
  });
});

test("lock state must be a boolean", async () => {
  const service = createService(vehicle);

  const result = await service.setLockState("true" as any);

  expect(result).toEqual({
    ok: false,
    statusCode: 400,
    error: "locked must be a boolean",
  });
});

test("locked can be set to true", async () => {
  const updatedVehicle = {
    ...vehicle,
    locked: true,
  };

  const service = createService(vehicle, updatedVehicle);

  const result = await service.setLockState(true);

  expect(result).toEqual({
    ok: true,
    data: updatedVehicle,
  });
});

test("charging cannot start when battery is full", async () => {
  const service = createService({
    ...vehicle,
    batteryLevel: 100,
  });

  const result = await service.startCharging();

  expect(result).toEqual({
    ok: false,
    statusCode: 400,
    error: "Vehicle battery is already full",
  });
});

test("charging can start when battery is not full", async () => {
  const updatedVehicle = {
    ...vehicle,
    charging: true,
  };

  const service = createService(vehicle, updatedVehicle);

  const result = await service.startCharging();

  expect(result).toEqual({
    ok: true,
    data: updatedVehicle,
  });
});

test("charging cannot stop when vehicle is not charging", async () => {
  const service = createService({
    ...vehicle,
    charging: false,
  });

  const result = await service.stopCharging();

  expect(result).toEqual({
    ok: false,
    statusCode: 400,
    error: "Vehicle is not currently charging",
  });
});

test("charging can stop when vehicle is charging", async () => {
  const chargingVehicle = {
    ...vehicle,
    charging: true,
  };

  const updatedVehicle = {
    ...chargingVehicle,
    charging: false,
  };

  const service = createService(chargingVehicle, updatedVehicle);

  const result = await service.stopCharging();

  expect(result).toEqual({
    ok: true,
    data: updatedVehicle,
  });
});

test("climate can be started", async () => {
  const updatedVehicle = {
    ...vehicle,
    climateOn: true,
  };

  const service = createService(vehicle, updatedVehicle);

  const result = await service.startClimate();

  expect(result).toEqual({
    ok: true,
    data: updatedVehicle,
  });
});

test("climate can be stopped", async () => {
  const climateVehicle = {
    ...vehicle,
    climateOn: true,
  };

  const updatedVehicle = {
    ...climateVehicle,
    climateOn: false,
  };

  const service = createService(climateVehicle, updatedVehicle);

  const result = await service.stopClimate();

  expect(result).toEqual({
    ok: true,
    data: updatedVehicle,
  });
});
