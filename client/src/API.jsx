const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api/`;

const APICall = async (endpoint, method = "GET", body = undefined, headers = undefined, expectResponse = true) => {
  let errors = [];

  try {
    const response = await fetch(new URL(endpoint, SERVER_BASE), {
        method,
        body,
        headers,
        credentials: "include"
    });

    if (response.ok) {
      if (expectResponse) return await response.json();
    }
    else errors = (await response.json()).errors;
  } catch {
    const err = ["Failed to contact the server"];
    throw err;
  }

  if (errors.length !== 0)
    throw errors;
};

const fetchAirplanes = async () => await APICall("airplanes");

const fetchSeats = async (airplaneId) => await APICall(`airplanes/${airplaneId}/seats`);

const reserveSeat = async (airplaneId, seatId) => await APICall(
  `airplanes/${airplaneId}/seats/${seatId}`,
  "POST",
  undefined,
  { "Content-Type": "application/json" },
  false
);

const cancelReservation = async (fligthId, seatId) => await APICall(
  `airplanes/${airplaneId}/seats/${seatId}`,
  "DELETE",
  undefined,
  undefined,
  false
);

const login = async (email, password) => await APICall(
  "session",
  "POST",
  JSON.stringify({username: email, password}),
  { "Content-Type": "application/json" }
);

const logout = async () => await APICall(
  "session",
  "DELETE",
  undefined,
  undefined,
  false
);

const fetchCurrentUser = async () => await APICall("session/current");

const API = {
  fetchAirplanes,
  fetchSeats,
  reserveSeat,
  deleteBooking,
  login,
  logout,
  fetchCurrentUser
};

export { API };




