import React, { useState, useEffect, useContext } from 'react';
import SignOutButton from "./SignOut"
import './App.css';
import ChangePassword from "./ChangePassword"
import { useQuery, useMutation } from '@apollo/client';
import queries from './queries';
import { Link } from 'react-router-dom'
import { AuthContext } from './firebase/Auth';
import AddQuestion from './modals/AddQuestion';
import DeleteQuestion from './modals/DeleteQuestion';
//import EditQuestion from './modals/EditQuestion';

function Admin(props) {
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  //const [showEdit, setShowEdit] = useState(false);
  //const [questionToEdit, setQuestionToEdit] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser.uid);
  //const currentPage = Number(props.match.params.page);
  const currentPage = 1;
  const {loading, error, data} = useQuery(queries.GET_QUESTIONS_FOR_USER, {
    variables: {
      uid: currentUser.uid
    },
    fetchPolicy: 'cache-and-network'
  });
/*
  const [removeOneQuestion] = useMutation(queries.DELETE_QUESTION, {
    refetchQueries: [
      { query: queries.GET_QUESTIONS_FOR_USER, variables: { uid: currentUser.uid} }
    ]
  });
*/
  const handleOpenAdd = () => {
    setShowAdd(true);
  }

  const handleCloseModal = () => {
    setShowAdd(false);
    setShowDelete(false);
  }
/*
  const handleDelete = (question) => {
    console.log(question);
    removeOneQuestion({
      variables: {
        _id: question._id
      }
    });
  };
*/

  const handleDelete = (question) => {
    setShowDelete(true);
    setQuestionToDelete(question);
  }

  /*
  const handleEdit = (question) => {
    setShowEdit(true);
    setQuestionToEdit(question);
  };
*/
  if (data) {
    console.log(data);
    const {getQuestionsForUser} = data;
    console.log(getQuestionsForUser);
    return (
      <div>
        <ChangePassword/>
        <SignOutButton/>

        <div className="container text-center">
          <button className="btn btn-primary" id="add-question-button" onClick={handleOpenAdd}>Add a Question</button>
        </div>
          
              {getQuestionsForUser.map((question) => {
                return (
                  
                    <div className="container text-center">
                      <div className="card text-center question-card" key={question._id}>
                        <div className="question-card-body">
                          <dl>
                            <div className="container">
                              <dt>Topic:</dt>
                              <dd>{question.t}</dd>
                            </div>
                            
                            <div className="container">
                              <dt>Question:</dt>
                              <dd>{question.q}</dd>
                            </div>
                              
                            <div className="container">                    
                              <dt>Answer(s):</dt>
                              
                                {question.a.map((answer, index) => {
                                  if (question.a.length > 1 && index < question.a.length-1) return <dd key={answer}>{answer},</dd>;
                                  return <dd key={answer}>{answer}</dd>;
                                })}
                              
                            </div>
                          </dl>
                
                          <button className="btn btn-danger" name="deleteQuestion" type="button" onClick={()=>{handleDelete(question)}}>Delete</button>
                          {/*<button className="btn btn-link" name="editQuestion" type="button" onClick={()=>{handleEdit(question)}}>Edit</button>*/}
                        </div>
                      </div>
                    </div>
                  
                );
              })}
          

          {showAdd && showAdd && (
            <AddQuestion
              isOpen={showAdd}
              handleClose={handleCloseModal}
              modal="addQuestion"
            />
          )}

          {showDelete && showDelete && (
            <DeleteQuestion
              isOpen={showDelete}
              handleClose={handleCloseModal}
              questionToDelete={questionToDelete}
              modal="deleteQuestion"
            />
          )}
{/*
          {showEdit && showEdit && (
            <EditQuestion
              isOpen={showEdit}
              handleClose={handleCloseModal}
              questionToEdit={questionToEdit}
              modal="editQuestion"
            />
          )}
          */}
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