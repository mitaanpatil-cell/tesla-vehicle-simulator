import { useEffect, useState } from "react";

type Vehicle = {
  id: number;
  name: string;
  locked: boolean;
  batteryLevel: number;
  charging: boolean;
};

function App() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  const localHost = "http://localhost:3000"; // Replace with your backend server URL
  
  useEffect(() => {
    fetch(`${localHost}/api/vehicle`)
      .then((response) => {
        console.log("GET /api/vehicle status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Vehicle received:", data);
        setVehicle(data);
      })
      .catch((error) => {
        console.error("Failed to fetch vehicle:", error);
      });
  }, []);

  async function toggleLock() {
    if (!vehicle) return;

    const response = await fetch(`${localHost}/api/vehicle/lock`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locked: !vehicle.locked,
      }),
    });

    const updatedVehicle = await response.json();

    setVehicle(updatedVehicle);
  }

  async function startCharging() {
    const response = await fetch(`${localHost}/api/vehicle/charging/start`, {
      method: "POST",
    });

    const updatedVehicle = await response.json();
    setVehicle(updatedVehicle);
  }

    async function stopCharging() {
    const response = await fetch(`${localHost}/api/vehicle/charging/stop`, {
      method: "POST",
    });

    const updatedVehicle = await response.json();
    setVehicle(updatedVehicle);
  }

  if (!vehicle) {
    return <p>Loading vehicle...</p>;
  }

  return (
    <div>
      <h1>{vehicle.name}</h1>
      <p>Locked: {vehicle.locked ? "Yes" : "No"}</p>
      <p>Battery: {vehicle.batteryLevel}%</p>
      <p>Charging: {vehicle.charging ? "Yes" : "No"}</p>

      <button onClick={toggleLock}>
        {vehicle.locked ? "Unlock" : "Lock"}
      </button>

      {vehicle.charging ? (
        <button onClick={stopCharging}>
          Stop Charging
        </button>
      ) : (
        <button onClick={startCharging}>
          Start Charging
        </button>
      )}
    </div>
  );
}

export default App;