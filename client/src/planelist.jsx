import { useContext, useState } from 'react';
import { Accordion, Badge, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { planesContext } from './Miscellaneous';

function PlaneList() {
  const [accentList, setAccentList] = useState([]);
  const planes = useContext(planesContext);

  const toggleAccent = id => {
    setAccentList(cur => {
      if (cur.includes(id)) return cur.filter(i => i !== id);
      else                  return [...cur, id];
    });
  };
  
  return (
    <Accordion alwaysOpen>
      {
        planes.map((p, i, a) => <PlaneItem
            plane={p}
            toggleAccent={toggleAccent}
            accent={accentList.includes(p.id)}
            key={p.id}
            first={i === 0}
            last={i === a.length - 1}
          />)
      }
    </Accordion>
  );
}

function PlaneItem(props) {
  const planes = useContext(planesContext);
  
  const itemStyle = {
    "borderTopRightRadius": "0px",
    "borderTopLeftRadius": "0px",
    "borderBottomRightRadius": "0px",
    "borderBottomLeftRadius": "0px",
    "borderBottomWidth": "0px"
  };

  if (props.first) {
    delete itemStyle.borderTopRightRadius;
    delete itemStyle.borderTopLeftRadius;
  } else if (props.last) {
    delete itemStyle.borderBottomWidth;
    delete itemStyle.borderBottomRightRadius;
    delete itemStyle.borderBottomLeftRadius;
  }

  return (
    <Row>
      <Col>
        <Accordion.Item eventKey={props.plane.id} className={props.accent ? "accent" : ""} style={itemStyle}>
          <Accordion.Header>
            <Container style={{"paddingLeft": "0.5rem"}}>
              <Row>
                <Col md="auto" className="align-self-center">
                  <Badge bg="secondary">
                    <tt>{props.plane.id}</tt>
                  </Badge>
                </Col>
                <Col md="auto" style={{"borderLeft": "1px solid grey"}}>
                  {props.plane.type}
                  {" "}
                  <Badge bg="light" pill style={{"color": "black"}}>
                    Seats: {props.plane.seats}
                  </Badge>
                </Col>
                <Col className="text-end align-self-center" style={{"marginRight": "1rem"}}>
                  <Badge>
                    Available: {props.plane.availableSeats}
                  </Badge>
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body><PlaneItemDetails plane={props.plane} toggleAccent={props.toggleAccent}/></Accordion.Body>
        </Accordion.Item>
      </Col>
    </Row>
  );
}

function PlaneItemDetails(props) {
  const planes = useContext(planesContext);

  return (
    <div>
      Model: {props.plane.model}<br/>
      Manufacturer: {props.plane.manufacturer}<br/>
      Range: {props.plane.range} km<br/>
      Speed: {props.plane.speed} km/h
    </div>
  );
}

export { PlaneList };






