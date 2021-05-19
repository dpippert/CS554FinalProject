import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
const w = console.warn;

function Home(){
    return(
        <div>
          <div class="card-group">
            <br/>
            <br/>
        <div class="card">
        
        <div class="card-body">
          <h5 class="card-title"> How to Play?</h5>
          <p class="card-text">
<br />1.	Game play begins by directing players to the game screen, where a game board appears.
<br />2.	The game board appears as a matrix with a top row of 5 hidden topic names. Each topic consists of a column of 5 hidden questions (for a total of 25 questions for the game).
<br />3.	Game board is on the upper portion of a player's screen.
<br />4.	Lower portion of the game player screen consists of various status, monitoring, and control resources.
<br />5.	All game play occurs on game screen.

</p>
          <a href="/play" class="btn btn-primary">Ready To  Play!</a>
        </div>
      </div> 
      <br/>
      <br/>
        <div class="card">
       
        <div class="card-body">
          <h5 class="card-title">Adding question and answer</h5>
          <br/>
          <p class="card-text">To add question and answers to the database one has to sign up.<br/>
          There are options on how one can Sign In.
          <br></br>
          Signing in using your email Id and Password<br/>
          Signing in using your Facebook social media account<br/>
          Signing in using your gmail account<br/>
          One can add question and answers to the database with the topics.<br/>
          The question can have multiple answers<br/>
          </p>
          <a href="/admin" class="btn btn-primary">Add question !</a>
        </div>
      </div> 
      <br/>
      <br/>
      <div class="card">
      
        <div class="card-body">
          <h5 class="card-title">Team  Tempest</h5>
          <p class="card-text"><br/><a  href="mailto:kyle.bernardes@gmail.com">Kyle Bernardes</a> CWID 10412644
          <br/><a href="mailto:mchandan@stevens.edu">Mahima Chandan </a>CWID 10467889 
          <br/><a href="mailto:dale.pippert@gmail.com">Dale Pippert</a> CWID 10469880</p>
          <a href="https://github.com/dpippert/CS554FinalProject" class="btn btn-success">GitHub URL</a>
          <a href="https://github.com/dpippert/CS554FinalProject/blob/master/doc/Arch.png" class="btn btn-primary">Flow of the project</a>
        </div>
      </div> 
      </div>
      </div>
    )
}
export default Home;