import { useContext, useState } from 'react';
import {Accordion, Badge, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { checkAereoConstraints, aereoContext, SmallRoundButton, prenotazioneContext, userContext, waitingContext } from './Connezione';

//lista dei aerei
function AereoList() {
  const [aereoSelezionato, setAereoSelezionato] = useState(null);
  const [postiPrenotati, setPostiPrenotati] = useState([]);
  const [accentList, setAccentList] = useState([]);
  const aerei = useContext(AereoContext);

  const toggleAccent = id => {
    setAccentList(cur => {
      if (cur.includes(id)) return cur.filter(c => c !== id);
      else return [...cur, id];
    });
  };

  return (
    <Accordion alwaysOpen>
      {
        aerei.map((a, i, arr) => <AereoItem
            aereo={a}
            toggleAccent={toggleAccent}
            accent={accentList.includes(a.id)}
            key={a.id}
            first={i === 0}
            last={i === arr.length - 1}
          />)
      }
    </Accordion>
  );
}


  const [accentList, setAccentList] = useState([]);
  const seats = useContext(seatsContext);

  const toggleAccent = code => {
    setAccentList(cur => {
      if (cur.includes(code)) return cur.filter(c => c !== code);
      else                    return [...cur, code];
    });
  };
  
  return (
    <Accordion alwaysOpen>
      {
        seats.map((s, i, a) => <SeatItem
            seat={s}
            toggleAccent={toggleAccent}
            accent={accentList.includes(s.code)}
            key={s.code}
            first={i === 0}
            last={i === a.length - 1}
          />)
      }
    </Accordion>
  );
}

// Continue adapting the rest of the code...
