import request from "supertest";
import { expect, test, vi } from "vitest";
import { createApp } from "../../app";

const vehicle = {
  id: 1,
  name: "Model 3",
  locked: false,
  batteryLevel: 80,
  charging: false,
  climateOn: false,
};

function createTestApp(fakeVehicleService: any) {
  return createApp({
    vehicleService: fakeVehicleService,
  });
}

test("GET /api/vehicle returns vehicle data", async () => {
  const fakeVehicleService = {
    getVehicle: vi.fn().mockResolvedValue({
      ok: true,
      data: vehicle,
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app).get("/api/vehicle");

  expect(response.status).toBe(200);
  expect(response.body).toEqual(vehicle);
});

test("GET /api/vehicle returns 404 when vehicle is not found", async () => {
  const fakeVehicleService = {
    getVehicle: vi.fn().mockResolvedValue({
      ok: false,
      statusCode: 404,
      error: "Vehicle not found",
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app).get("/api/vehicle");

  expect(response.status).toBe(404);
  expect(response.body).toEqual({
    error: "Vehicle not found",
  });
});

test("PATCH /api/vehicle/lock returns 200 on success", async () => {
  const updatedVehicle = {
    ...vehicle,
    locked: true,
  };

  const fakeVehicleService = {
    setLockState: vi.fn().mockResolvedValue({
      ok: true,
      data: updatedVehicle,
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app)
    .patch("/api/vehicle/lock")
    .send({ locked: true });

  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedVehicle);
  expect(fakeVehicleService.setLockState).toHaveBeenCalledWith(true);
});

test("PATCH /api/vehicle/lock returns 400 for invalid input", async () => {
  const fakeVehicleService = {
    setLockState: vi.fn().mockResolvedValue({
      ok: false,
      statusCode: 400,
      error: "locked must be a boolean",
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app)
    .patch("/api/vehicle/lock")
    .send({ locked: "true" });

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: "locked must be a boolean",
  });
  expect(fakeVehicleService.setLockState).toHaveBeenCalledWith("true");
});

test("POST /api/vehicle/charging/start returns 200 on success", async () => {
  const updatedVehicle = {
    ...vehicle,
    charging: true,
  };

  const fakeVehicleService = {
    startCharging: vi.fn().mockResolvedValue({
      ok: true,
      data: updatedVehicle,
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app).post("/api/vehicle/charging/start");

  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedVehicle);
});

test("POST /api/vehicle/charging/start returns 400 when charging cannot start", async () => {
  const fakeVehicleService = {
    startCharging: vi.fn().mockResolvedValue({
      ok: false,
      statusCode: 400,
      error: "Vehicle battery is already full",
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app).post("/api/vehicle/charging/start");

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: "Vehicle battery is already full",
  });
});

test("POST /api/vehicle/charging/stop returns 200 on success", async () => {
  const updatedVehicle = {
    ...vehicle,
    charging: false,
  };

  const fakeVehicleService = {
    stopCharging: vi.fn().mockResolvedValue({
      ok: true,
      data: updatedVehicle,
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app).post("/api/vehicle/charging/stop");

  expect(response.status).toBe(200);
  expect(response.body).toEqual(updatedVehicle);
});

test("POST /api/vehicle/charging/stop returns 400 when charging cannot stop", async () => {
  const fakeVehicleService = {
    stopCharging: vi.fn().mockResolvedValue({
      ok: false,
      statusCode: 400,
      error: "Vehicle is not currently charging",
    }),
  } as any;

  const app = createTestApp(fakeVehicleService);

  const response = await request(app).post("/api/vehicle/charging/stop");

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    error: "Vehicle is not currently charging",
  });
});
