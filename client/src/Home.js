import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
const w = console.warn;

function Home(){
    return(
        <div>
          <div class="card-group">
         
          <h1></h1> <h2></h2> <h3></h3> <h4></h4>
          <br/>
          <br/>
        <div className="card text-center">
        
        <div className="card-body">
          <h5 className="card-title">Our Demo Game</h5>
          <br/>
          <p className="card-text">Using our question and answer repository in conjunction with our real-time
          gaming engine, we offer to you a free game we call</p>
          <div>
          <img className="card-text" src="./topictempest_small.png" title="Topic Tempest" alt="Topic Tempest"/>
          </div>
          <br/>
          <p className="card-text">Currently configured for two players, Topic Tempest throws up a Jeopardy-like
          format, a setting that should be familiar to most. It showcases our backend questions repository
          and cloud-based real-time database, as key enabling technologies to get you thinking about how you can bring
          a fun and dynamic learning experience to your students, clients, members, and more.
          </p>
          <a href="/play" className="btn btn-primary">Ready To  Play!</a>
        </div>
      </div> 
      <br/>
      <br/>
        <div className="card">
       
        <div class="card-body">
          <h5 class="card-title">Our Question and Answer Portal</h5>
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
          <a href="/admin" className="btn btn-primary">Let's try it out!</a>
        </div>
      </div> 
      <br/>
      <br/>
      <div className="card">
      
        <div className="card-body">
          <h5 className="card-title">Team  Tempest</h5>
          <br/>
          <p className="card-text">Contact us to learn more about how you can leverage our question/answer repository and real-time gaming
          engine components for your corporate training or professional learning gamification ideas!
          </p>
          <p className="card-text"><a  href="mailto:kyle.bernardes@gmail.com">Kyle Bernardes</a> CWID 10412644
          <br/><a href="mailto:mchandan@stevens.edu">Mahima Chandan </a>CWID 10467889 
          <br/><a href="mailto:dale.pippert@gmail.com">Dale Pippert</a> CWID 10469880</p>
          <a href="https://github.com/dpippert/CS554FinalProject" className="btn btn-success">GitHub URL</a>
          <br/>
          <a href="https://github.com/dpippert/CS554FinalProject/blob/master/doc/Arch.png" className="btn btn-primary">Flow of the project</a>
          <br/>
        </div>
      </div> 
      </div>
      </div>
     
    )
}
export default Home;