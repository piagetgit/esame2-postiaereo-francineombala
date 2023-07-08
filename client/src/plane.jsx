

//id: A unique identifier for the plane.

//type: The type of the plane, which can be 'locale', 'regionale', or 'internazionale'.

//numRows: The number of rows of seats in the plane.

//numSeatsPerRow: The number of seats in each row.

//seats: An array representing all the seats in the plane. Each seat could be an object with properties such as id (e.g., "10A"), status (e.g., "free", "occupied", or "requested"), and user (the user who has booked or requested the seat).

//availableSeats: The number of seats that are currently available (i.e., not occupied or requested).@


function Plane(
    id,
    type,
    numRows,
    numSeatsPerRow,
    seats = [],
    availableSeats = numRows * numSeatsPerRow,
  ) {
    this.id = id;
    this.type = type;
    this.numRows = numRows;
    this.numSeatsPerRow = numSeatsPerRow;
    this.seats = seats;
    this.availableSeats = availableSeats;
  }
  
  export { Plane };
  
  
  