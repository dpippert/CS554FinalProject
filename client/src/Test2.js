import React, {useEffect, useState} from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import engine from './engine/engine';

const w = console.debug;

function Test2(props) {
  const [username, setUsername] = useState('');
  const [mainstate, setMainstate] = useState('waiting-for-enroll-request');
  const [topicamt, setTopicamt] = useState('');
  const [whosturn, setWhosturn] = useState(null);
	const [topics, setTopics] = useState(['', '', '', '', '']);
  const [usedSquares, setUsedSquares] = useState([]);
  const [eng, setEng] = useState(null);

  useEffect(() => {

     // active_square event data is {t: a: q:} where t: is topic,
     // a: is amount, and q: is the question.

     async function doActiveSquareEv(data) {
       setMainstate('active_square');
       document.getElementById("answer").value = '';
       usedSquares.push(data);
       setUsedSquares(usedSquares);
     }

     async function engineer(evname, evdata) {
			switch (evname) {
			  case 'reveal':
				  const [n, topic] = evdata;
					topics[n] = topic;
					setTopics(topics);
					break;
        case 'question_time_out':
          setMainstate('playing');
          break;
        case 'active_square':
          doActiveSquareEv(evdata);
          break;
				case 'whosturn':
          setWhosturn(evdata);
          setTopicamt(null);
					break;
				default:
					w(`engineer ignoring event ${evname}`);
					break;
			}
    }

    async function startEngine() {
      try {
			  console.error("aaa startEngine calling");
        setEng(await engine.start(engineer));
      } catch (e) {
        console.error(e);
        alert(e);
      }
    }
    startEngine();
  }, [topics, usedSquares]);

  useEffect(() => {
    async function action() {
      switch (mainstate) {
        case 'buzzin-clicked':
          setMainstate('buzzed-in');
          await engine.buzzin(document.getElementById("answer").value);
          break;
        case 'square-clicked':
          setMainstate('waiting-for-active-square');
          await engine.question(topicamt[0], topicamt[1]);
          break;
        case 'playing':
				case 'waiting-for-active-square':
          break;
        case 'rtp-clicked':
          setMainstate('playing');
          await engine.readyToPlay(username);
          break;
        default:
          w(`no action dispatched for mainstate ${mainstate}`);
          break;
      }
    }
    action();
  });

  function onUsernameChange(ev) {
    setUsername(ev.target.value);
  }

  function getUsernameEnabled() {
    return mainstate === 'waiting-for-enroll-request';
  }

  function getRtpEnabled() {
    return username.length &&
           mainstate === 'waiting-for-enroll-request';
  }

  function getAnswerEnabled() {
    return mainstate === 'active_square';
  }

  function getBuzzinEnabled() {
    return mainstate === 'active_square';
  }

  function isMyTurn() {
    return whosturn === username;
  }

  function rtpClicked(ev) {
    setMainstate('rtp-clicked');
  }

  function isSquareUsed(ncol, nrow) {
    const topic = topics[ncol];
    function f(square) {
      return (square.t === topic) && (square.a === ((nrow + 1) * 200));
    }
    return usedSquares.some(f);
  }

  // Format of the id attr is "square-${ntopic}-${nrow}".
	// Hack alert the event is coming in for the child Card element
	// for some reason. Need to get the button as that's where the id lives.

	function squareClicked(ev) {
	  if (!isMyTurn()) {
		  alert(`It's not your turn. It's ${whosturn}'s turn.`);
			return;
    }
		else if (mainstate !== 'playing') {
		  w(`ignoring pick in mainstate ${mainstate}`);
			return;
    }
    const btn = ev.target.parentElement.parentElement;
	  const id = btn.id;
		const [_, ncol, nrow] = id.split("-");
		const topic = topics[ncol];
		const amt = (parseInt(nrow) + 1) * 200;
		setTopicamt([topic, amt]);
		setMainstate('square-clicked');
  }

  function buzzinClicked(ev) {
    setMainstate('buzzin-clicked');
  }

  function renderTopicCols() {
    const cols = [0, 1, 2, 3, 4];
    return cols.map(renderTopicCol);
  }

  function renderTopicCol(ncol) {
    const rows = [0, 1, 2, 3, 4];

		function renderSquare(nrow) {
	    const k = `square-${ncol}-${nrow}`;
      const squareUsed = isSquareUsed(ncol, nrow);
      if (squareUsed)
        return (
				  <Row key={k}>
            <button disabled className="square-used">${200 * (nrow + 1)}</button>
				  </Row>
        );
      else
			  return (
				  <Row key={k}>
            <Button id={k} onClick={squareClicked}>
              <Card body className={squareUsed ? "square-used" : ""}>${200 * (nrow + 1)}</Card>
            </Button>
				  </Row>
			  );
		}

    return (
      <Col key={`topic-col-${ncol}`} data-name='foo' className="topic-col">
        <Row>
          <Card body>{topics[ncol]}</Card>
        </Row>
        {rows.map(renderSquare)}
      </Col>
    );
  }

  return (
    <>
    <Row>
      <Col className="board-col">
        <Row>
          {renderTopicCols()}
        </Row>
      </Col>
    </Row>
    <Row className="only-row-below-board">
      <Col className="lhs-col-of-only-row-below-board">
        <Row>
          <Col className="host-guidance">
            <textarea id="guidance" rows="6"></textarea> 
          </Col>
        </Row>
        <Row className="your-answer-row">
          <Col className="your-answer-col" xs={12} sm={6}>
            <InputGroup className="test-1">
              <FormControl id="answer"
                placeholder="Your answer"
                disabled={!getAnswerEnabled()}
                aria-label="Your answer"
                aria-describedby="basic-addon2"/>
            </InputGroup>
           </Col>
           <Col xs={12} sm={6}>
             <Button id="buzzin" disabled={!getBuzzinEnabled()} onClick={buzzinClicked}>Buzz in</Button>
           </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="test-1">
              <FormControl id="whosturn"
                disabled={true}
                aria-label="Whos turn"
                aria-describedby="basic-addon2"/>
            </InputGroup>
          </Col>
          <Col className="whosturn">Who's Turn</Col>
        </Row>
      </Col>
      <Col className="rhs-col-of-only-row-below-board">
        <Row>
          <Col>
            <InputGroup className="test-1">
              <FormControl id="username"
                onChange={onUsernameChange}
                placeholder="Username"
                disabled={!getUsernameEnabled()}
                aria-label="Username"
                aria-describedby="basic-addon2"/>
            </InputGroup>
          </Col>
          <Col>
            <Button onClick={rtpClicked} id="readyToPlayId" disabled={!getRtpEnabled()}>Ready to Play</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="test-1">
              <FormControl id="timeleft"
                disabled={true}
                aria-label="Time Left"
                aria-describedby="basic-addon2"/>
            </InputGroup>
          </Col>
            <Col className="timeleft">Time Left</Col>
        </Row>
        <Row>
          <Col>
            scoreboard goes here
          </Col>
        </Row>
      </Col>
    </Row>
    </>
  );
}

// ----------------------------------------------------------------------------
// Understanding mainstate.
//
// square-clicked
// --------------
// Set from onClick eh for a square. A notation to useEffect that it needs
// to call engine.question().
//
// waiting-for-active-square
// -------------------------
// Set from useEffect right prior to calling engine.question(). It's sole
// purpose in life is to indicate to squareClicked() eh that, 'we are just
// getting started on asking a question, I cannot honor a new square click
// at this time.' Without this state, you would be able to start running a
// question before the last one has completed.
// ----------------------------------------------------------------------------
export default Test2;
