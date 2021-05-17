import React, {useEffect, useState} from 'react';
import './GameBoard.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import {NavLink} from 'react-router-dom';
import engine from './engine/engine';

const w = console.warn;

function Play(props) {
  w("props");
  w(props);
  const [username, setUsername] = useState('');
  const [mainstate, setMainstate] = useState('waiting-for-enroll-request');
  const [topicamt, setTopicamt] = useState('');
  const [whosturn, setWhosturn] = useState(null);
	const [topics, setTopics] = useState(['', '', '', '', '']);
  const [usedSquares, setUsedSquares] = useState([]);
  const [eng, setEng] = useState(null);
	const [players, setPlayers] = useState({});
	const [activeSquare, setActiveSquare] = useState(null);
  const [speaker, setSpeaker] = useState(true);

  useEffect(() => {

    // active_square event data is {t: a: q:} where t: is topic,
    // a: is amount, and q: is the question. When a round finishes the engine
    // will send in 'null' for the active square so take care to filter
    // that out.

    async function doActiveSquareEv(data) {
      clearGuidance();
      document.getElementById("answer").value = '';
      if (!data)
        return;
      setMainstate('active_square');
			setActiveSquare(data);
    }

    async function engineer(evname, evdata) {
      switch (evname) {
        case 'game_over':
          setMainstate('game_over');
          break;
			  case 'players':
				  setPlayers(evdata);
					break;
			  case 'question_timer':
				  document.getElementById('timeleft').value = evdata;
					break;
			  case 'reveal':
				  const [n, topic] = evdata;
					topics[n] = topic;
					setTopics(topics);
					break;
        case 'question_time_out':
          setMainstate('need_active_square_closed');
          break;
        case 'active_square':
          doActiveSquareEv(evdata);
          break;
				case 'whosturn':
          setWhosturn(evdata);
				  document.getElementById('whosturn').value = evdata;
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
        await engine.start(engineer, props.client);
      } catch (e) {
        console.error(e);
        alert(e);
      }
    }
    startEngine();
  }, [topics, usedSquares, props.client]);

  // --------------------------------------------------------------------------
  // Added hack of changing active_square to active_square_2 as it was the only
  // way I could get non-current-turn browsers to render, otherwise when the
  // question would come up on the square, the non-current-turn browsers did
  // not display it for reasons unknown.
  //
  // On close down of a game the engine seems to want to send in null for the
  // active_square event so those are filtered out below under
  // state 'need_active_square_closed', for now.
  // --------------------------------------------------------------------------

  useEffect(() => {
    async function action() {
      switch (mainstate) {
        case 'game_over':
          alert("Game over. Thank you for playing Topic Tempest!");
          setUsername('');
          setMainstate('waiting-for-enroll-request');
          break;
        case 'need_active_square_closed':
          usedSquares.push(activeSquare);
  			  setActiveSquare(null);
          setUsedSquares(usedSquares);
          setMainstate('playing');
				  break;
        case 'active_square':
          setMainstate('active_square_2');
          document.getElementById("answer").focus();
          w("aaa mainstate is active_square");
          break;
        case 'buzzin-clicked':
          setMainstate('buzzed-in');
          await engine.buzzin(document.getElementById("answer").value);
          break;
        case 'square-clicked':
          setMainstate('waiting-for-active-square');
          try { await engine.question(topicamt[0], topicamt[1]); }
          catch { 
            w('square-clicked rejected as being used');
            setMainstate('playing');
          }
          break;
        case 'playing':
          break;
				case 'waiting-for-active-square':
          break;
        case 'rtp-clicked':
          setMainstate('playing');
          try { await engine.readyToPlay(username); }
          catch (e) {
            alert(e.message);
            setMainstate('waiting-for-enroll-request');
          }
          break;
        case 'waiting-for-enroll-request':
				  document.getElementById('username').focus();
          break;
        default:
          w(`no action dispatched for mainstate ${mainstate}`);
          break;
      }
    }
    try { action(); }
    catch (e) { w(e); }
  });

  function clearGuidance() {
    document.getElementById('guidance').value = '';
  }

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
    return mainstate === 'active_square' || mainstate === 'active_square_2';
  }

  function getBuzzinEnabled() {
    const elem = document.getElementById("answer");
    const y = elem && !elem.value.length;
    return mainstate === 'active_square' || mainstate === 'active_square_2';
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
		  return ((square.t === topic) && (square.a === ((nrow + 1) * 200))) ?
			  square : false;
    }
    return usedSquares.some(f);
  }

	function isSquareActive(ncol, nrow) {
    const [topic, amt] = asTopicAmt(ncol, nrow);
		return activeSquare && activeSquare.t === topic && activeSquare.a === amt;
  }

  // Format of the id attr is "square-${ntopic}-${nrow}".
	// Hack alert the event is coming in for the child Card element
	// for some reason. Need to get the button as that's where the id lives.

	function checkTurn() {
	  if (!isMyTurn()) {
		  if (whosturn)
  		  alert(`It's not your turn. It's ${whosturn}'s turn.`);
      else
			  alert(`It's not your turn. In fact, it's no one's turn.`);
      return false;
    }
		else if (mainstate !== 'playing') {
		  w(`ignoring pick in checkTurn() for mainstate = ${mainstate}`);
			return false;
    }
		return true;
	}

	// Returns a 2 vector [topic, amt] eg ["HTML", 200] corresponding to the
  // passed in row and column numbers.

	function asTopicAmt(nrow, ncol) {
		const topic = topics[ncol];
		const amt = (parseInt(nrow) + 1) * 200;
    return [topic, amt]
  }

  function speakerClicked(bool) {
    setSpeaker(bool);
    engine.setSpeechEnabled(bool);
  }

	function squareClicked(ev) {
	  if (!checkTurn())
		  return;
    const btn = ev.target.parentElement.parentElement;
	  const id = btn.id;
		const [_, ncol, nrow] = id.split("-");
    setTopicamt(asTopicAmt(nrow, ncol));
		setMainstate('square-clicked');
  }

  function buzzinClicked(ev) {
    setMainstate('buzzin-clicked');
  }

  /*
  function onUsernameKeyUp(ev) {
    return false;
  }
  */

  function onUsernameKeyPress(ev) {
    const s = ev.target.value + ev.key;
    if (!s.match(/^[a-zA-Z_][0-9a-zA-Z_]*$/))
      ev.preventDefault();
  }

  // DPTEST is this breaking buzzin clicked somehow?
  // I don't think you should set DOM elements in events like this as
  // the DOM element will be recreated on render, probably why this
  // gives trougle

  /*
  function onAnswerChanged(ev) {
    const elem = document.getElementById("buzzin");
    elem.disabled = !ev.target.value.length;
  }
  */

  function renderTopicCols() {
    const cols = [0, 1, 2, 3, 4];
    return cols.map(renderTopicCol);
  }

  function renderTopicCol(ncol) {
    const rows = [0, 1, 2, 3, 4];

		function renderSquare(nrow) {
	    const k = `square-${ncol}-${nrow}`;
      const squareUsed = isSquareUsed(ncol, nrow);
      if (isSquareActive(nrow, ncol))
        return (
			    <Row key={k}>
            <button disabled className="square-active">{activeSquare.q}</button>
				  </Row>
        );
      else if (squareUsed)
        return (
          <Row key={k}>
            <button disabled className="square-used">${200 * (nrow + 1)}</button>
          </Row>
        );
      else
			  return (
				  <Row key={k}>
            <Button id={k} className="dollar-btn" onClick={squareClicked}>
              <Card body className={squareUsed ? "square-used" : "square-open"}>${200 * (nrow + 1)}</Card>
            </Button>
				  </Row>
			  );
		}

		// Why did I use an extra Row for each square on this and above renderSquare
		// function. Doesn't seem needed to me.

    return (
      <Col key={`topic-col-${ncol}`} data-name='foo' className="topic-col">
        <Card className="topic">{topics[ncol]}</Card>
        {rows.map(renderSquare)}
      </Col>
    );
  }

  return (
    <>
    {/* <Row className="top-row">
      <Col className="top-cols" xs={4}>
        <br/>
        <NavLink className="navlink" to="/admin">Our Question and Answer Repository</NavLink>
      </Col>
      <Col xs={4}>
        <br/>
        <NavLink className="navlink" to="/play">Ready to Play!</NavLink>
      </Col>
      <Col xs={4}>
        <NavLink className="navlink2" to="/test2">
          <img className="logo" src='./topictempest_small.png' alt="Topic Tempest logo"/>
        </NavLink>
      </Col>
    </Row> */}
    <Row xs={2} md={5}>
      {renderTopicCols()}
    </Row>
    <Row className="only-row-below-board">
      <Col className="lhs-col-of-only-row-below-board">
        <Row>
          <Col className="host-guidance">
            <textarea id="guidance" readOnly={true} rows="6"></textarea> 
          </Col>
        </Row>
        <Row className="your-answer-row">
          <Col className="your-answer-col" xs={12} sm={6}>
            <InputGroup className="test-1">
              <FormControl id="answer"
                placeholder="Your answer"
                maxLength="24"
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
        <Row>
          <Col>
            <ToggleButtonGroup type="radio" name="speaker" onChange={speakerClicked}>
              <ToggleButton className="speaker" variant="success" value={true}>Speaker on</ToggleButton>
              <ToggleButton  className="speaker" variant="warning" value={false}>Speaker off</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Col>
      <Col className="rhs-col-of-only-row-below-board">
        <Row>
          <Col>
            <InputGroup className="test-1">
              <FormControl id="username"
                title='Keep it on the up and up please. 16 chars or less. Alphanumerics and _.'
                maxLength="16"
                placeholder="Username"
                onChange={onUsernameChange}
                onKeyPress={onUsernameKeyPress}
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
					  <Scoreboard players={players}/>
          </Col>
        </Row>
      </Col>
    </Row>
    </>
  );
}

function Scoreboard(props) {

	function trows() {
		return Object.entries(props.players).map(entry => trow(entry[0], entry[1]));
  }

  function trow(name, value) {
	  return (
		  <tr key={name}>
			  <td>{name}</td>
				<td>{value.balance}</td>
			</tr>
    );
  }

  return (
    <Table bordered hover size="sm">
      <thead>
        <tr>
          <th>Player</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
			  {trows()}
      </tbody>
    </Table>
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

export default Play;
