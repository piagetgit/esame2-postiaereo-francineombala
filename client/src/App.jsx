import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
//import './App.css';
import { Aereo } from './Aereo';
import { CourseList } from './AereoList';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import { checkAereoConstraints, aereoContext, SmallRoundButton, prenotazioneContext, userContext, waitingContext } from './...';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { API } from './API';
import { LoginForm } from './LoginForm';
import { prenotazione_List } from './Prenotazione_List';
import { prenotazione_Posti } from './prenotazione_Posti';
import { Gestione_Prenotazione} from  './Gestione_Prenotazione';
import { selezione_aereo} from '/selezione_aereo';

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const navigate = useNavigate();
  /** la list dei aeri */
  const [aerei, setAerei] = useState([]);
  /** A list delle errore */
  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the list of aerei from the server
    API.fetchAerei()
      .then(aerei => {
        setAerei(aerei);
        setLoading(false);
      })
      .catch(err => setErrors(err));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errors.length > 0) {
    return (
      <div>
        <h2>Error:</h2>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <HomePage />} />
        <Route exact path="/aerei" render={() => <AereoList aerei={aerei} />} />
        <Route path="/aerei/:id" render={(props) => <AereoDetails aerei={aerei} {...props} />} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}
 


function main() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Replace with your user state variable
  const [data, setData] = useState(null); // Replace with your data state variable
  const [errors, setErrors] = useState([]); // Replace with your errors state variable
  const [waiting, setWaiting] = useState(false); // Replace with your waiting state variable

  useEffect(() => {
    // Fetch the current user data
    API.fetchCurrentUserData()
      .then(user => {
        setUser(user);
        setLoading(false);
      })
      .catch(err => {
        setErrors([...errors, err]);
        setLoading(false);
      });
  }, []);

  const createReservation = () => {
    // Implementa qui la logica per creare una prenotazione
  };
  
  const deleteReservation = () => {
    // Implementa qui la logica per eliminare una prenotazione
  };
  
  const updateReservation = () => {
    // Implementa qui la logica per aggiornare una prenotazione
  };
  
  const discardChanges = () => {
    // Implementa qui la logica per annullare le modifiche
  };
  
  const seatActivities = {
    createReservation,
    deleteReservation,
    updateReservation,
    discardChanges
  };
  
  return (
    <Routes>
      <Route
        path="/"
        element={<Header user={user} logoutCbk={logout} errors={errors} clearErrors={() => setErrors([])} />}
      >
        <Route
          path=""
          element={
            loading ? (
              <LoadingSpinner />
            ) : (
              <HomePage user={user} seatActivities={seatActivities} errorAlertActive={errors.length > 0} waiting={waiting} />
            )
          }
        />
        <Route path="login" element={loading ? <LoadingSpinner /> : <LoginForm loginCbk={login} errorAlertActive={errors.length > 0} />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
  


// Perform the login
const login = (email, password, onFinish) => {
  API.login(email, password)
    .then(student => {
      setErrors([]);
      refetchDynamicContent()
        .then(() => navigate("/"));
    })
    .catch(err => setErrors(err))
    .finally(() => onFinish?.());
};


 // Perform the logout

const logout = () => {
  API.logout()
    .then(() => {
      setStudent(undefined);
      setSavedStudyPlan(undefined);
    })
    .catch(err => {
      // Remove eventual 401 Unauthorized errors from the list
      setErrors(err.filter(e => e !== "Not authenticated"));
    });
};
//le modifiche apportate alla prenotazione , ovvero inviale al server
//restituisce una promessa che si risolve in nulla in caso di successo















//traccia della selezione dei posti effettuata dall'utente
//rappresentare la versione salvata della selezione dei posti prima di eventuali modifiche.
//ipristinerà la selezione dei posti all'ultima versione salvata, reimpostando la variabile di stato 
//(seatSelection )con i valori della versione salvata.

const discardChanges = () => {
  // Rollback to the saved version of the data
  setSeatSelection(savedSeatSelection);
};

// Raggruppa tutte le funzioni correlate
const activities = {
  createData,
  deleteData,
  updateData,
  discardChanges
};

return (
  <Routes>
    <Route path="/" element={<Header user={user} logoutCbk={logout} errors={errors} clearErrors={() => setErrors([])} />}>
      <Route path="" element={loading ? <LoadingSpinner /> : <HomePage user={user} data={data} activities={activities} errorAlertActive={errors.length > 0} waiting={waiting} />} />
      <Route path="login" element={loading ? <LoadingSpinner /> : <LoginForm loginCbk={login} errorAlertActive={errors.length > 0} />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);



// Componente corretto della home page dell'app
function HomePage(props) {
  return (
    <Container fluid style={{ "paddingLeft": "2rem", "paddingRight": "2rem", "paddingBottom": "1rem", "marginTop": props.errorAlertActive ? "2rem" : "6rem" }}>
      <Row className="justify-content-center">
        <Col lg style={{ "borderRight": props.user && "1px solid #dfdfdf", "maxWidth": "70%" }}>
          <AereoContext.Provider value={props.aerei}>
            {/* Renderizza il componente per la visualizzazione dei posti dell'aereo */}
          </AereoContext.Provider>
        </Col>
        {
          // Se un utente è loggato, mostra prenotazione aereo
          props.user && (
            <Col lg>
              {/* Renderizza il componente per la gestione prenotazione aereo dell'utente */}
            </Col>
          )
        }
      </Row>
    </Container>
  );
}

// Intestazione della pagina, contenente la barra di navigazione e, potenzialmente, l'avviso di errore

function Header(props) {
  return (
    <>
      <MyNavbar user={props.user} logoutCbk={props.logoutCbk} />
      {props.errors.length > 0 && (
        <ErrorsAlert errors={props.errors} clear={props.clearErrors} />
      )}
      <Outlet />
    </>
  );
}
//Uno spinner di caricamento mostrato al primo caricamento dell'app

function LoadingSpinner() {
  return (
    <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}


export default App;
