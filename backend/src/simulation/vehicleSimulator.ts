export async function runVehicleSimulationTick(prisma: any) {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: 1,
    },
  });

  if (!vehicle) {
    return;
  }

  if (!vehicle.charging) {
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