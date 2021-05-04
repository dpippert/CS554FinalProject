import React, {useState} from 'react';
import '../App.css';
import {} from '@apollo/client';
import '../engine/engine'

function Play(props) {
  const [username, setUsername] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [ready, setReady] = useState(false);

  const submitUsername = (e) => {
    e.preventDefault();
    console.log(username);
    setReady(true);
    //setWaiting(true);
  }

  const createRow = (i) => {
    return (
      <tr>
        <td>${i*200}</td>
        <td>${i*200}</td>
        <td>${i*200}</td>
        <td>${i*200}</td>
        <td>${i*200}</td>
      </tr>
    );
  }

  if (!ready) {
    return (
      <div>
        <form onSubmit={submitUsername}>
          <label for="username">Username:</label>
          <input type="text" name="username" value={username} onChange={(e)=>setUsername(e.target.value)} id="username" placeholder="Username"/>

          <button type="submit">Play!</button>
        </form>
      </div>
    );
  }
  if (ready && waiting) {
    return (
      <div>
        <h2>{username}</h2>
        <p>Waiting for more players...</p>
      </div>
    );
  }
  if (ready && !waiting) {
    return (
      <div>
        <table className="table table-bordered">
          <thead>
            <th scope="col">Topic 1</th>
            <th scope="col">Topic 2</th>
            <th scope="col">Topic 3</th>
            <th scope="col">Topic 4</th>
            <th scope="col">Topic 5</th>
          </thead>
          
          <tbody>
            {createRow(1)}
            {createRow(2)}
            {createRow(3)}
            {createRow(4)}
            {createRow(5)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Play;
