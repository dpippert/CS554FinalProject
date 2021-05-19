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
      width: '70%',
      boxShadow: '0 0 40px 2px #00000071'
    }
};

function EditQuestion(props) {
    const [showEdit, setShowEdit] = useState(props.isOpen);
    const [questionToEdit, setQuestionToEdit] = useState(props.questionToEdit);
    const { currentUser } = useContext(AuthContext);
    const [removeQuestion] = useMutation(queries.EDIT_QUESTION, {
        refetchQueries: [
            { query: queries.GET_QUESTIONS_FOR_USER, variables: { uid: currentUser.uid} }
        ]
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        removeQuestion({
        variables: {
            _id: questionToEdit._id
        }
        });
        setShowEdit(false);
        props.handleClose(false);   
    };

    const handleClose = () => {
        setQuestionToEdit(null);
        setShowEdit(false);
        props.handleClose(false);
    };
    
    const body = (
        <form id="edit-question" onSubmit={handleSubmit}>
            edit
        </form>
    );

    return (
        <div>
            <ReactModal
                name="editModal"
                style={customStyles}
                isOpen={showEdit}
                contentLabel="Edit Modal"
            >
                {body}
            </ReactModal>
        </div>
    )
}

export default EditQuestion;