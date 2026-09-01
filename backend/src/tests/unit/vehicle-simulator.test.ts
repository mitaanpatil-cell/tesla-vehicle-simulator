import { expect, test, vi } from "vitest";
import { runVehicleSimulationTick } from "../../simulation/vehicle-simulator";

const vehicle = {
  id: 1,
  name: "Model 3",
  locked: false,
  batteryLevel: 80,
  charging: true,
  climateOn: false,
};

function createPrisma(vehicleState: typeof vehicle | null) {
  return {
    vehicle: {
      findUnique: vi.fn().mockResolvedValue(vehicleState),
      update: vi.fn(),
    },
  };
}

test("charging vehicle battery increases by 1", async () => {
  const prisma = createPrisma(vehicle);

  await runVehicleSimulationTick(prisma);

  expect(prisma.vehicle.update).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      batteryLevel: 81,
      charging: true,
    },
  });
});

test("battery does not go over 100", async () => {
  const prisma = createPrisma({
    ...vehicle,
    batteryLevel: 100,
  });

  await runVehicleSimulationTick(prisma);

  expect(prisma.vehicle.update).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      batteryLevel: 100,
      charging: false,
    },
  });
});

test("charging stops when battery reaches 100", async () => {
  const prisma = createPrisma({
    ...vehicle,
    batteryLevel: 99,
  });

  await runVehicleSimulationTick(prisma);

  expect(prisma.vehicle.update).toHaveBeenCalledWith({
    where: { id: 1 },
    data: {
      batteryLevel: 100,
      charging: false,
    },
  });
});

test("battery does not change when vehicle is not charging", async () => {
  const prisma = createPrisma({
    ...vehicle,
    charging: false,
  });

  await runVehicleSimulationTick(prisma);

  expect(prisma.vehicle.update).not.toHaveBeenCalled();
});
