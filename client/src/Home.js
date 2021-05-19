import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
const w = console.warn;

function Home(){
    return(
        <div>
          <h1></h1> <h2></h2> <h3></h3> <h4></h4>
          <br/>
          <br/>
        <div className="card">
        
        <div className="card-body">
          <h5 className="card-title"> How to Play?</h5>
          <p className="card-text">
<br />1.	Game play begins by directing players to the game screen, where a game board appears.
<br />2.	The game board appears as a matrix with a top row of 5 hidden topic names. Each topic consists of a column of 5 hidden questions (for a total of 25 questions for the game).
<br />3.	Game board is on the upper portion of a player's screen.
<br />4.	Lower portion of the game player screen consists of various status, monitoring, and control resources.
<br />5.	All game play occurs on game screen.
<br />6.	Game board is a matrix of 30 squares or rectangles.
<br />7.	Game board is divided vertically into five topics. Each topic is a column in the matrix.
<br />8.	There are five hidden questions for each topic.
<br />9.	Each question on the game board is hidden behind a square with either $200, $400, $600, $800, or $1000 printed on the square.
<br />10.	Dollar value printed on each square represents that question's worth to win (+) or lose (-).
<br />11.	A player wins dollar amount of a question by being the first to answer that question correctly.
<br />12.	Whoever's turn it is, must start the round by clicking an available question square in the game board matrix.
<br />13.	Question appears in a pop up dialog box, as well as in host guidance region.
<br />14.	Once question appears, a 15 second timer starts in which players may attempt to answer the question.
<br />15.	Players are not required to attempt an answer.
<br />16.	The first player to answer a current question correctly, wins the $ amount for that square on the board.
<br />17.	Squares are rated as $200, $400, $600, $800, and $1000 from top to bottom
<br />18.	Each player has a Balance text box that updates whenever a player wins or loses in a round with the $ amount of the square (plus (win) or minus (lose)).
<br />19.	Players can see all other players names and balances at all times.
<br />20.	Players cannot see other players answers or if they have answered at all. 
<br />21.	Topics, and the questions making up a topic, are hidden to start the game.
<br />22.	System reveals the topics one by one to start the game. As each topic is revealed it is also written to the host guidance region.
<br />23.	Only topic names are revealed during topic reveal -- questions remain hidden.
<br />24.	Topics are revealed left-to-right with approximately three seconds pause between announcing of each topic.
<br />25.	Players are not directed to game screen until a quorum of players have been assembled by the system.
<br />26.	Guidance text area box informs waiting players whenever there is a new arrival (enrollee) to the game.
<br />27.	System will decide what player will start the game.
<br />28.	Each question/answer pair is considered a round.
<br />29.	Player's turn is communicated via host guidance.
<br />30.	All player's have approximately 15 seconds on clock to answer the current question.
<br />31.	Host guidance will inform players when 10 seconds remain to answer the question.
<br />32.	When time has expired for a question, players' Buzz in button disables, thus preventing an answer attempt.
<br />33.	A player answers a question by typing their answer into an Answer text box and clicking the Buzz in button.
<br />34.	Question pops up in non-modal box (so that player can type while question is active).
</p>
          <a href="/play" className="btn btn-primary">Ready To  Play!</a>
        </div>
      </div> 
      <br/>
      <br/>
        <div className="card">
       
        <div className="card-body">
          <h5 className="card-title">Adding question and answer</h5>
          <p className="card-text">To add question and answers to the database one has to sign up.<br/>
          There are options on how one can Sign In.
          <br></br>
          Signing in using your email Id and Password<br/>
          Signing in using your Facebook social media account<br/>
          Signing in using your gmail account<br/>
          One can add question and answers to the database with the topics.<br/>
          The question can have multiple answers<br/>
          </p>
          <a href="/admin" className="btn btn-primary">Add question !</a>
        </div>
      </div> 
      <br/>
      <br/>
      <div className="card">
      
        <div className="card-body">
          <h5 className="card-title">Team  Tempest</h5>
          <p className="card-text"><br/><a  href="mailto:kyle.bernardes@gmail.com">Kyle Bernardes</a> CWID 10412644
          <br/><a href="mailto:mchandan@stevens.edu">Mahima Chandan </a>CWID 10467889 
          <br/><a href="mailto:dale.pippert@gmail.com">Dale Pippert</a> CWID 10469880</p>
          <a href="https://github.com/dpippert/CS554FinalProject" className="btn btn-success">GitHub URL</a>
          <a href="https://github.com/dpippert/CS554FinalProject/blob/master/doc/Arch.png" className="btn btn-primary">Flow of the project</a>
        </div>
      </div> 
      </div>
    )
}
export default Home;