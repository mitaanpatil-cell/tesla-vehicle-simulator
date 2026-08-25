import { prisma } from "./lib/prisma";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

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

app.get("/api/vehicle", async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findFirst();

    if (!vehicle) {
      return res.status(404).json({
        error: "Vehicle not found",
      });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("Failed to fetch vehicle:", error);

    res.status(500).json({
      error: "Failed to fetch vehicle",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Locking and unlocking the vehicle - will eventually changed with a POST
app.patch("/api/vehicle/lock", async (req, res) => {
  try {
    const { locked } = req.body;

    if (typeof locked !== "boolean") {
      return res.status(400).json({
        error: "locked must be a boolean",
      });
    } 

    
    const vehicle = await prisma.vehicle.findFirst();

    if (!vehicle) {
      return res.status(404).json({
        error: "Vehicle not found",
      });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: vehicle.id,
      },
      data: {
        locked,
      },
    });

    res.json(updatedVehicle);
  } catch (error) {
    console.error("Failed to update vehicle lock state:", error);

    res.status(500).json({
      error: "Failed to update vehicle lock state",
    });
  }
});

// Starting charging
app.post("/api/vehicle/charging/start", async (req, res) => {
  const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: 1,
      },
  });

  if (!vehicle) {
    return res.status(404).json({
      error: "Vehicle not found",
    });
  }

  if (vehicle.batteryLevel >= 100) {
    return res.status(400).json({
      error: "Vehicle battery is already full",
    });
  }

  const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: 1,
      },
      data: {
        charging: true,
      },
  });

  return res.json(updatedVehicle);
});

app.post("/api/vehicle/charging/stop", async (req, res) => {
  const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: 1,
      },
  });

  if (!vehicle) {
    return res.status(404).json({
      error: "Vehicle not found",
    });
  }

  if (!vehicle.charging) {
    return res.status(400).json({
      error: "Vehicle is not currently charging",
    });
  }

  const updatedVehicle = await prisma.vehicle.update({
      where: {
        id: 1,
      },
      data: {
        charging: false,
      },
  });

  return res.json(updatedVehicle);  
});