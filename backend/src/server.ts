import { prisma } from "./prisma";
import { createApp } from "./app";
import { runVehicleSimulationTick } from "./simulation/vehicleSimulator";
import { VehicleService } from "./services/VehicleService";

const PORT = 3000;
const vehicleService = new VehicleService(prisma);
const app = createApp({ vehicleService });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

setInterval(async () => {
  try {
    await runVehicleSimulationTick(prisma);
  } catch (error) {
    console.error("Simulation tick failed:", error);
  }
}, 5000);
