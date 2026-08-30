import { useEffect, useState } from "react";

type Vehicle = {
  id: number;
  name: string;
  locked: boolean;
  batteryLevel: number;
  charging: boolean;
  climateOn: boolean;

};

function App() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const response = await fetch("/api/vehicle");

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error("Failed to fetch vehicle:", error);
      }
    }

    fetchVehicle();

    const intervalId = setInterval(fetchVehicle, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  async function toggleLock() {
    if (!vehicle) return;

    const response = await fetch("/api/vehicle/lock", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locked: !vehicle.locked,
      }),
    });

    if (!response.ok) {
      console.error("Failed to update lock state");
      return;
    }

    const updatedVehicle = await response.json();
    setVehicle(updatedVehicle);
  }

  async function startCharging() {
    const response = await fetch("/api/vehicle/charging/start", {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to start charging:", error);
      return;
    }

    const updatedVehicle = await response.json();
    setVehicle(updatedVehicle);
  }

  async function stopCharging() {
    const response = await fetch("/api/vehicle/charging/stop", {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to stop charging:", error);
      return;
    }

    const updatedVehicle = await response.json();
    setVehicle(updatedVehicle);
  }

  async function startClimate() {
  const response = await fetch("/api/vehicle/climate/start", {
    method: "POST",
  });

  if (!response.ok) {
    console.error("Failed to start climate control");
    return;
  }

  const updatedVehicle = await response.json();
  setVehicle(updatedVehicle);
}

async function stopClimate() {
  const response = await fetch("/api/vehicle/climate/stop", {
    method: "POST",
  });

  if (!response.ok) {
    console.error("Failed to stop climate control");
    return;
  }

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
        <button onClick={stopCharging}>Stop Charging</button>
      ) : (
        <button onClick={startCharging}>Start Charging</button>
      )}
      <p>Climate Control: {vehicle.climateOn ? "On" : "Off"}</p>
      {vehicle.climateOn ? (
        <button onClick={stopClimate}>Stop Climate Control</button>
      ) : (
        <button onClick={startClimate}>Start Climate Control</button>
      )}
    </div>
  );
}

export default App;