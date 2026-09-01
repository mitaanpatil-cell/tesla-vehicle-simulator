import type { PrismaClient } from "../generated/prisma/client";

type VehicleClient = {
  vehicle: Pick<PrismaClient["vehicle"], "findUnique" | "update">;
};

export async function runVehicleSimulationTick(prisma: VehicleClient) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: 1,
    },
  });

  if (!vehicle || !vehicle.charging) {
    return;
  }

  const newBatteryLevel = Math.min(vehicle.batteryLevel + 1, 100);

  await prisma.vehicle.update({
    where: {
      id: 1,
    },
    data: {
      batteryLevel: newBatteryLevel,
      charging: newBatteryLevel < 100,
    },
  });
}
