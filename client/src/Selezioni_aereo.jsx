import { createContext } from "react";
import { Alert, Button, Container, Nav, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

/** Context used to propagate the list of planes */
const planesContext = createContext();

/** Context used to propagate the user object */
const userContext = createContext();

/** Context used to propagate all the booking related functions */
const bookingActivitiesContext = createContext();

/** Context used to propagate the waiting state to everything that might need it */
const waitingContext = createContext();

/** Bootstrap's Alert component used to show errors */
function ErrorsAlert(props) {
  // same as in your original code...
}

/** A round button component */
function SmallRoundButton(props) {
  // same as in your original code...
}

/** 
 * Check if a seat is available, considering various factors.
 * This function would need to be implemented according to your business logic.
 */
function checkSeatAvailability(seat, bookings, user) {
  // Implement your logic...
  return {
    result: true
  };
}

/** 
 * Check if the booking has been modified. 
 * This function would need to be implemented according to your business logic.
 */
function checkBookingModified(saved, current) {
  // Implement your logic...
  return false;
}

/** The navigation bar at the top of the app */
function MyNavbar(props) {
  const navigate = useNavigate();
  
  // Here you need to modify the Navbar to fit your application needs...
}

/** 
 * Informs the user that the route is not valid 
 */
function NotFoundPage() {
  // same as in your original code...
}

export {
  MyNavbar,
  NotFoundPage,
  ErrorsAlert,
  planesContext,
  userContext,
  bookingActivitiesContext,
  waitingContext,
  SmallRoundButton,
  checkSeatAvailability,
  checkBookingModified
};
