import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import { useMutation } from '@apollo/client';
import queries from '../queries';
import ReactModal from 'react-modal';
import { AuthContext } from '../firebase/Auth';

ReactModal.setAppElement('#root');
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '65%',
      boxShadow: '0 0 40px 2px #00000071'
    }
};

function DeleteQuestion(props) {
    const [showDelete, setShowDelete] = useState(props.isOpen);
    const [questionToDelete, setQuestionToDelete] = useState(props.questionToDelete);
    const { currentUser } = useContext(AuthContext);
    const [removeQuestion] = useMutation(queries.DELETE_QUESTION, {
        refetchQueries: [
            { query: queries.GET_QUESTIONS_FOR_USER, variables: { uid: currentUser.uid} }
        ]
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        removeQuestion({
        variables: {
            _id: questionToDelete._id
        }
        });
        setShowDelete(false);
        props.handleClose(false);   
    };

    const handleClose = () => {
        setQuestionToDelete(null);
        setShowDelete(false);
        props.handleClose(false);
    };
    
    const body = (
        <form id="delete-question" onSubmit={handleSubmit}>
            <div className="container text-center">
                <p id="delete-message">Are you sure you want to delete this question?</p>
            </div>
            <div className="container text-center">
                <button className="btn btn-danger" id="submitButton" name="submitButton" type="submit">
                    Delete
                </button>
                <button className="btn btn-link" onClick={handleClose}>
                    Cancel
                </button>
            </div>
        </form>
    );

    return (
        <div>
            <ReactModal
                name="deleteModal"
                style={customStyles}
                isOpen={showDelete}
                contentLabel="Delete Modal"
            >
                {body}
            </ReactModal>
        </div>
    )
}

export default DeleteQuestion;