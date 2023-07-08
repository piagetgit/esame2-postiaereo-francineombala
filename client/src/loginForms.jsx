import { useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import validator from "validator";

/**
 * The login page displayed on "/login"
 * 
 * @param props.loginCbk callback to perform the actual login
 * @param props.errorAlertActive true when the error alert on the top is active and showing, false otherwise
 */
function LoginForm(props) {
  const [username, setUsername] = useState("username");
  const [password, setPassword] = useState("password");

  const [usernameError, setUsernameError] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);

  const [waiting, setWaiting] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();

    // Validate form
    const trimmedUsername = username.trim();
    const usernameError = validator.isEmpty(trimmedUsername) ? "Username must not be empty" : "";
    const passwordValid = !validator.isEmpty(password);

    if (!usernameError && passwordValid) {
      setWaiting(true);
      props.loginCbk(username, password, () => setWaiting(false));
    } else {
      setUsernameError(usernameError);
      setPasswordValid(passwordValid);
    }
  };

  return (
    <Container fluid style={{"marginTop": props.errorAlertActive ? "2rem" : "6rem"}}>
    <Row className="justify-content-evenly">
    <Col md="3" style={{"paddingLeft": "3rem"}}>
      <Link to="/"><i className="bi bi-arrow-left"/>back</Link>
    </Col>
    <Col style={{"maxWidth": "50rem", "minWidth": "30rem"}}>
    <Card>
      <Card.Header as="h2">Login</Card.Header>
      <Container style={{"marginTop": "0.5rem", "padding": "1rem"}}>
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Username</Form.Label>
              <Form.Control isInvalid={!!usernameError}
                            type="text"
                            placeholder="Username"
                            value={username}
                            autoFocus
                            onChange={event => {setUsername(event.target.value); setUsernameError("");}}/>
              <Form.Control.Feedback type="invalid">
                {usernameError}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Password</Form.Label>
              <Form.Control isInvalid={!passwordValid}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={event => {setPassword(event.target.value); setPasswordValid(true);}}/>
              <Form.Control.Feedback type="invalid">
                Password must not be empty
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button type="submit" disabled={waiting}>
            {
              waiting ? 
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                  {" "}
                </>
              : false
            }
            Login
          </Button>
        </Form>
      </Container>
    </Card>
    </Col>
    <Col md="3"/>
    </Row>
    </Container>
  );
}

export { LoginForm };







