import React, { useState, useEffect } from 'react';
import SignOutButton from "./SignOut"
import './App.css';
import ChangePassword from "./ChangePassword"
import { useQuery } from '@apollo/client';
import queries from './queries';
import { Link } from 'react-router-dom'

function Admin(props) {
  //const currentPage = Number(props.match.params.page);
  const currentPage = 1;
  const {loading, error, data} = useQuery(queries.GET_QUESTIONS, {
    variables: {
      page: 1
    },
    fetchPolicy: 'cache-and-network'
  });

  if (data) {
    console.log(data);
    const {getQuestions} = data;
    console.log(getQuestions);
    return (
      <div>
        <ChangePassword/>
        <SignOutButton/>

        <div className="container">
          <Link to="/add-question" className="btn btn-primary">Add a Question</Link>
        </div>
          <ul>
            <div className="container">
              {getQuestions.map((question) => {
                return (
                  <li>
                    <div className="card text-center" key={question._id} style={{width: 33 + 'rem'}}>
                      <div className="card-body">
                        <p>Topic: {question.t}</p>
                        <p>{question.q}</p>
                        <p>Aceptable Answers:</p>
                        <ul>
                          {question.a.map((answer) => {
                            return (
                              <li>
                                {answer}
                              </li>
                            )
                          })}
                        </ul>
                        {/*<button className="btn btn-primary" type="button" onClick={()=>{handleToggleBin(post)}}>{post.binned ? "Remove From Bin" : "Add to Bin"}</button>
                        <button className="btn btn-link" type="button" onClick={()=>{handleDelete(post)}}>Delete Post</button>*/}
                      </div>
                    </div>
                  </li>
                );
              })}
            </div>
          </ul>
      </div>
    )
  }
    
    else if (loading) {
        return <div>Loading...</div>;
    }

    else if (error) {
      console.log(error);
      //console.log(data);
        return <div>Error: {error.message}</div>;
    }
  
}

export default Admin;