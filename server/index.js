"use strict"

const Database = require("./database");
const express = require("express");
const cors = require("cors");
const { body, validationResult, Result } = require("express-validator");
const { initAuthentication, isLoggedIn } = require("./auth");
const passport = require("passport");

const PORT = 3001;
const app = new express();
const db = new Database("posti_aereo.db");
const crypto = require('crypto');

app.use(express.json());
app.use(cors({
    //origin: "http://localhost:5173",
    credentials: true
}));

initAuthentication(app, db);

// GET /api/flights: Restituisce la situazione dei posti degli aerei disponibili
app.get("/api/aereo", async (req, res) => {
    try {
      console.log("aerei");
        const aerei = await db.getAereo(); // Ottieni la lista degli aerei disponibili

        // Implementa la logica per consentire all'utente di selezionare un aereo sulla pagina principale

        // Quando l'utente seleziona un aereo, ottieni l'ID dell'aereo selezionato
        //const selectedFlightId = req.query.flightId;

        // Ottieni la situazione dei posti per l'aereo selezionato
        //const seatStatus = await db.getSeatStatus(selectedFlightId);

        // Restituisci la situazione dei posti dell'aereo selezionato come risposta JSON
        res.json({
            aerei: aerei
        });
    } catch (error) {
        res.status(500).json({ errors: ["Database error"] });
    }
});

//  -GET  `/api/flights/:flightId` Restituisce i dettagli dei posti disponibili per un determinato aereo, inclusi i loro stati (prenotati o liberi).

app.get("/api/aereo/:aereo_id", async (req, res) => {
    try {
        const aereo_id = req.params.aereo_id; // Ottieni l'ID del volo dalla richiesta
        
        /*const prenotazioni = await db.dbAllAsync(
            this.db,
            "SELECT * FROM prenotazioni WHERE aereo_id = ?",
            [aereo_id]
        );*/ // Ottieni i dettagli del volo dal database
        const prenotazioni = await db.getPrenotazioni(aereo_id);

        if (!prenotazioni) {
            return res.status(404).json({ error: "Flight not found" });
        }
       
        //const seatLayout = flight.seatLayout; // Ottieni la disposizione dei posti del volo

        /*const seatStatuses = await dbAllAsync(
            this.db,
            "SELECT * FROM seatStatus WHERE flightId = ?",
            [flightId]
        ); // Ottieni lo stato attuale di ogni posto del volo dal database

        let numOccupiedSeats = 0;
        let numUnoccupiedSeats = 0;*/

        // Calcola il numero di posti occupati, non occupati e il totale dell'aereo
        /*for (const row of seatLayout) {
            for (const seat of row) {
                const seatStatus = seatStatuses.find(s => s.seatId === seat.seatId);
                if (seatStatus) {
                    if (seatStatus.status === "occupied") {
                        numOccupiedSeats++;
                    } else if (seatStatus.status === "unoccupied") {
                        numUnoccupiedSeats++;
                    }
                    seat.status = seatStatus.status;
                } else {
                    seat.status = "unknown";
                }
            }
        }*/

        /*res.json({
            flightId,
            seatLayout,
            numOccupiedSeats,
            numUnoccupiedSeats,
            totalSeats: seatLayout.reduce((acc, row) => acc + row.length, 0)
        });*/

         res.json({
          prenotazioni: prenotazioni
        });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

//POST `/api/bookings`: 

// POST /api/bookings: Crea una nuova prenotazione
app.post("/api/bookings", isLoggedIn, async (req, res) => {
 
    try {
      let { aereo_id, numero_posti, lista_posti } = req.body; // Dati della prenotazione forniti dall'utente
  
      // Verifica se l'aereo selezionato esiste ed è disponibile
      const aereo = await db.getAereo(aereo_id);
      if (!aereo) {
        return res.status(400).json({ errors: ["Invalid flight"] });
      }
      //console.log(aereo)
      // Verifica se ci sono abbastanza posti disponibili per la prenotazione
      const posti = await db.getPrenotazioni(aereo_id);
      //console.log(postiPrenotati)
      const postiPrenotati=[]
      posti.forEach(element=>{
        element.posti_prenotati.split(',').forEach(el => {
            postiPrenotati.push(el)}
          );
      })
      
      if (aereo.numero_posti * aereo.numero_file < postiPrenotati.length + numero_posti){
        return res.status(400).json({ errors: ["Not enough available seats"] });
      }
  
      
      if(lista_posti === ""){
         //scelta casuale dei posti
        lista_posti = generateRandomPosto(aereo.numero_file,aereo.numero_posti,postiPrenotati,numero_posti)
      }

      console.log(lista_posti)
      try{
        await db.insertPrenotazione(aereo_id, req.user.email, lista_posti);
      }catch (error){
        console.log(error)
      }
      
      res.json({responseCode:200, message: "Booking created successfully"});
    } catch (error) {
      res.status(500).json({ errors: ["Database error"] });
    }
  });

  function generateRandomPosto(numeroFile, numeroPosti, postiPrenotati,numeroPostidaPrenotare) {
    
    let result=""; 
    const digits = '123456789'.substring(0,numeroPosti);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0,numeroFile);
  
    let index = 0;

    while(index < numeroPostidaPrenotare){
      const randomDigit = digits.charAt(Math.floor(Math.random() * digits.length));
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      
      const posto = randomDigit + randomLetter;
      
      if(!postiPrenotati.includes(posto)){
          result+=","+posto;
          index=index+1;
      }
    }

    
    result = result.slice(1)
    //console.log("result:"+result)
    return result;
  }
  /**
 * Authenticate and login
 */
app.post(
  "/api/session",
  body("username", "username is not a valid email").isEmail(),
  body("password", "password must be a non-empty string").isString().notEmpty(),
  (req, res, next) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(400).json({errors: errList});
    }

    // Perform the actual authentication
    passport.authenticate("local", (err, user) => {
      if (err) {
        res.status(err.status).json({errors: [err.msg]});
      } else {
        req.login(user, err => {
          if (err) return next(err);
          else res.json({id:user.id, email: user.username, name: user.name});
        });
      }
    })(req, res, next);
  }
);
 /*
  //GET `/api/bookings/:userId`
  
  // POST /api/bookings
app.post("/api/bookings", isLoggedIn, async (req, res) => {
    try {
      const { userId, flightId, seats } = req.body;
  
      // Verifica lo stato dei posti nel database
      const seatStatuses = await db.getSeatStatuses(flightId);
  
      // Verifica la disponibilità dei posti e aggiorna lo stato dei posti selezionati
      const updatedSeatStatuses = seatStatuses.map((status, index) => {
        if (seats.includes(index) && status === "free") {
          return "requested";
        }
        return status;
      });
  
      // Verifica se tutti i posti selezionati sono liberi
      const allSeatsAreFree = seats.every(index => seatStatuses[index] === "free");
  
      if (allSeatsAreFree) {
        // Tutti i posti sono liberi, procedi con la prenotazione
        const booking = await db.createBooking(userId, flightId, seats);
  
        // Aggiorna lo stato dei posti nel database
        await db.updateSeatStatuses(flightId, updatedSeatStatuses);
  
        // Aggiorna i numeri di posti occupati, liberi, richiesti e totali
        const { occupiedSeats, freeSeats, requestedSeats, totalSeats } = await db.getSeatStatistics(flightId);
  
        res.json({
          bookingId: booking.id,
          occupiedSeats,
          freeSeats,
          requestedSeats,
          totalSeats
        });
      } else {
        // Alcuni posti selezionati sono già occupati o richiesti, annulla la prenotazione
        res.status(400).json({ errors: ["Alcuni posti selezionati sono già occupati o richiesti."] });
      }
    } catch (error) {
      res.status(500).json({ errors: ["Database error"] });
    }
  });
  
  // Visualizzazione bidimensionale dei posti
  app.get("/api/flights/:flightId/seats", async (req, res) => {
    try {
      const flightId = req.params.flightId;
  
      // Ottieni la disposizione dei posti e lo stato attuale di ogni posto dal database
      const seatLayout = await db.getSeatLayout(flightId);
      const seatStatuses = await db.getSeatStatuses(flightId);
  
      // Calcola i numeri di posti occupati, liberi, richiesti e totali
      let occupiedSeats = 0;
      let freeSeats = 0;
      let requestedSeats = 0;
  
      for (const seatStatus of seatStatuses) {
        if (seatStatus === "occupied") {
          occupiedSeats++;
        } else if (seatStatus === "free") {
          freeSeats++;
        } else if (seatStatus === "requested") {
          requestedSeats++;
        }
      }
  
      res.json({
        seatLayout,
        seatStatuses,
        occupiedSeats,
        freeSeats,
        requestedSeats,
        totalSeats: seatLayout.length * seatLayout[0].length
      });
    } catch (error) {
      res.status(500).json({ errors: ["Database error"] });
    }
  });
  
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
  


  // DELETE /api/bookings/:bookingId
app.delete("/api/bookings/:bookingId", isLoggedIn, async (req, res) => {
    try {
      const bookingId = req.params.bookingId;
  
      // Verifica se la prenotazione esiste per l'utente corrente
      const booking = await db.getBookingById(bookingId);
  
      if (!booking || booking.userId !== req.user.id) {
        return res.status(404).json({ errors: ["Prenotazione non trovata"] });
      }
  
      // Verifica se l'utente ha già effettuato una prenotazione per lo stesso volo
      const existingBooking = await db.getBookingByUserIdAndFlightId(req.user.id, booking.flightId);
  
      if (existingBooking && existingBooking.id !== bookingId) {
        return res.status(400).json({ errors: ["Hai già effettuato una prenotazione per questo volo"] });
      }
  
      // Ottieni l'ID del volo associato alla prenotazione
      const flightId = booking.flightId;
  
      // Cancella la prenotazione
      await db.deleteBooking(bookingId);
  
      // Aggiorna lo stato dei posti nel database
      await db.updateSeatStatuses(flightId, "free", booking.seats);
  
      res.json({ message: "Prenotazione cancellata con successo" });
    } catch (error) {
      res.status(500).json({ errors: ["Database error"] });
    }
  });
  
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
  


/**
 * Authenticate and login
 */
app.post(
    "/api/login",
    body("email", "Email is not valid").isEmail(),
    body("password", "Password must be a non-empty string").notEmpty(),
    (req, res, next) => {
      // Check if validation is ok
      const salt = crypto.randomBytes(16).toString('hex');
      //const hash = crypto.createHash('sha256').update(req.body.password+sa).digest('hex');
      
      crypto.scrypt(req.body.password, salt, 32, (err, derivedKey) => {
        if (err) throw err;
      
        // Convert the derived key to a hexadecimal string
        const hashedPassword = derivedKey.toString('hex');
      
        // Store the hashed password and salt in the database
        console.log('Hashed password:', hashedPassword);
        console.log('Salt:', salt);
      });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      console.log(req.body)
      // Perform the actual authentication
      passport.authenticate("local", (err, user) => {
        if (err) {
          return res.status(500).json({ errors: [{ msg: "Authentication error" }] });
        }
        if (!user) {
          return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
        }
  
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
  
          // Get the user's information and return the response
          const { id, email, name } = user;
          res.json({ id, email, name });
        });
      })(req, res, next);
    }
  );
  
  /**
   * Logout
   */
  /*app.delete("/api/session", isLoggedIn, (req, res) => {
    req.logout(() => res.end());
  });
  
  /**
 * Check if the user is logged in and return their info
 */
  /*app.get("/api/session/current", isLoggedIn, async (req, res) => {
    try {
      let studyPlan;
  
      if (req.user.fullTime !== null) {
        studyPlan = await db.getStudyPlan(req.user.id);
      }
  
      res.json({
        email: req.user.username,
        name: req.user.name,
        fullTime: req.user.fullTime,
        studyPlan: studyPlan || null,
      });
    } catch (error) {
      res.status(500).json({ errors: ["Database error"] });
    }
  });*/
  
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));
 
  
  
  
  
  