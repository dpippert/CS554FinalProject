import React, { useState, useEffect } from 'react';
import SignOutButton from "./SignOut"
import './App.css';
import ChangePassword from "./ChangePassword"
import { useQuery, useMutation } from '@apollo/client';
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

  const [removeOneQuestion] = useMutation(queries.DELETE_QUESTION, {
    refetchQueries: [
      { query: queries.GET_QUESTIONS }
    ]
  });

  const handleDelete = (question) => {
    console.log(question);
    removeOneQuestion({
      variables: {
        _id: question._id
      }
    });
  };

  const handleEdit = (question) => {
    console.log(question)
  };

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
                        <p>Question: {question.q}</p>
                        <p>Answers:</p>
                        <ul>
                          {question.a.map((answer) => {
                            return (
                              <li>
                                {answer}
                              </li>
                            )
                          })}
                        </ul>
                        <button className="btn btn-danger" name="deleteQuestion" type="button" onClick={()=>{handleDelete(question)}}>Delete</button>
                        <button className="btn btn-link" name="editQuestion" type="button" onClick={()=>{handleEdit(question)}}>Delete</button>
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