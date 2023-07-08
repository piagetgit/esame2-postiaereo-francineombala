const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_BASE = `${SERVER_HOST}:${SERVER_PORT}/api/`;

const ChiamaAPI = async (endpoint, metodo = "GET", corpo = undefined, headers = undefined, aspettaRisposta = true) => {
  let errori = [];

  try {
    const risposta = await fetch(new URL(endpoint, SERVER_BASE), {
      method: metodo,
      body: corpo,
      headers,
      credentials: "include"
    });

    if (risposta.ok) {
      if (aspettaRisposta) return await risposta.json();
    }
    else errori = (await risposta.json()).errors;
  } catch {
    const err = ["Impossibile contattare il server"];
    throw err;
  }

  if (errori.length !== 0)
    throw errori;
};
// recupera tutti gli aerei disponibili.
const recuperaAerei = async () => await ChiamaAPI("aerei");
// recupera tutti i posti per un determinato aereo.
const recuperaPosti = async (idAereo) => await ChiamaAPI(`aerei/${idAereo}/posti`);

//  effettua una prenotazione per un elenco di posti su un determinato aereo.
const prenotaPosti = async (idAereo, posti) => await ChiamaAPI(
  `aerei/${idAereo}/prenota`,
  "POST",
  JSON.stringify({ posti }),
  { "Content-Type": "application/json" },
  false
);
//annulla una prenotazione per un elenco di posti su un determinato aereo.
const rilasciaPosti = async (idAereo, posti) => await ChiamaAPI(
  `aerei/${idAereo}/rilascia`,
  "POST",
  JSON.stringify({ posti }),
  { "Content-Type": "application/json" },
  false
);

const login = async (nomeUtente, password) => await ChiamaAPI(
  "sessione",
  "POST",
  JSON.stringify({ username: nomeUtente, password }),
  { "Content-Type": "application/json" }
);

const logout = async () => await ChiamaAPI(
  "sessione",
  "DELETE",
  undefined,
  undefined,
  false
);

const recuperaUtenteCorrente = async () => await ChiamaAPI("sessione/corrente");

const API = {
  recuperaAerei,
  recuperaPosti,
  prenotaPosti,
  rilasciaPosti,
  login,
  logout,
  recuperaUtenteCorrente
};

export { API };




