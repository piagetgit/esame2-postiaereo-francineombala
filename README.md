[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/_8yXOlwa)
# Esame #2: "Posti aereo"
## Student: s319110 FRANCINE TATIANA OLANGA OMBALA

## React Client Application Routes

-Route `/`: pagina principale, mostra la lista completa dei corsi quando si arriva sul sito
-Route `/login`: pagina per fare il login
-Route *: per le pagine che non esistono

## API Server

-POST /api/session
 -request parameters and request body content
 -response body content
 -DELETE
-GET /api/session/current ... decidere qui quali informazioni ritornare EVENTUALMENTE oltre alle info dell'utente

-GET `/api/flights`: Non autenticata, Questa API restituisce una lista degli aerei disponibili che l'utente può prenotare.

-GET  `/api/flights/:flightId`:flightId: Non autenticata,Questa API restituisce i dettagli di un volo specifico, tra cui la disposizione dei posti e lo stato attuale di ogni posto.

-POST `/api/bookings`: Autenticata,Questa API permette all'utente di creare una nuova prenotazione.
 L'utente invierà i dettagli della prenotazione, come l'ID del volo e i posti da prenotare, e l'API aggiornerà lo stato dei posti . 

-GET `/api/bookings/:userId`:userId:Autenticata, Questa API restituisce le prenotazioni esistenti per un utente specifico.Questa API restituisce le prenotazioni esistenti per un utente specifico.

-DELETE `/api/bookings/:bookingId`:bookingId: Autenticata,Questa API permette all'utente di cancellare una prenotazione esistente.Questa API permette all'utente di cancellare una prenotazione esistente. Dopo la cancellazione, lo stato dei posti prenotati viene aggiornato per riflettere che sono di nuovo disponibili.

## Database Tables
-Users: (ID,Username,Password)contiene le informazioni sugli utenti. 

-Planes: (id,name)contiene informazioni sugli aerei. 

-Seats: (seatID,airplaneID,row,column,status)contiene informazioni sui posti a sedere sugli aerei. 

-Bookings(bookingID,userID,seatID): contiene informazioni sulle prenotazioni effettuate dagli utenti. 


## Main React Components

-ListOfSomething (in List.js): component purpose and main functionality
-GreatButton (in GreatButton.js): component purpose and main functionality
...
(only main components, minor ones may be skipped)
## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

