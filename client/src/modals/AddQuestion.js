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
      width: '75%',
      boxShadow: '0 0 40px 2px #00000071',
      color: 'black'
    }
};

function AddQuestion(props) {
    const [showAdd, setShowAdd] = useState(props.isOpen);
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [createQuestion] = useMutation(queries.ADD_QUESTION, {
        refetchQueries: [
            { query: queries.GET_QUESTIONS_FOR_USER, variables: { uid: currentUser.uid} }
        ]
    });
    //const [extraAnswers, setExtraAnswers] = useState(0);
/*
    const createQuestion = async() => {

        await addQuestion ({
            variables: {
                t: topic,
                q: question,
                a: answers
            }
        });
    }
*/

    const handleSubmit = async(e) => {
        e.preventDefault();
        //createQuestion();
        console.log(topic);
        console.log(question);
        console.log(answers);
        if (!topic || !question || !answers) {
            setError('All fields are required')
        } else {
            const newQuestion = await createQuestion ({
                variables: {
                    uid: currentUser.uid,
                    topic: topic,
                    question: question,
                    answers: answers
                }
            });
            //setRedirect(true);
            setShowAdd(false);
            props.handleClose(false);
        }
    };

    const handleChange = (index, e) => {
        const values = [...answers];
        if (e.target.name === "topic") {
            setTopic(e.target.value);
        }
        if (e.target.name === "question") {
            setQuestion(e.target.value);
        }
        if (e.target.name === "answer") {
            values[index] = e.target.value;
            setAnswers(values);
        }
    };

    const handleAddAnswer = () => {
        //setExtraAnswers(extraAnswers+1)
        const newAnswers = [...answers];
        newAnswers.push('');
        setAnswers(newAnswers);

    }

    const handleRemoveAnswer = (index) => {
        //setExtraAnswers(extraAnswers-1);
        const newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);
    }

    const handleClose = () => {
        setShowAdd(true);
        props.handleClose(false);
    }

    // allow for multiple answers to be added to the form
    // figure out a way to then get those answers into an array to pass to apollo
    
    if (redirect) {
        window.location.href='/admin';
    }

    const body = (
        <form id="add-question" onSubmit={handleSubmit}>
            <div>
                <label className="form-label">
                    Topic:
                    <input
                    onChange={e => handleChange(0, e)}
                    className="form-control"
                    required
                    name="topic"
                    type="text"
                    placeholder="Topic"
                    value={topic}
                    autoFocus={true}
                    />
                </label>
            </div>
            <div>
                <label>
                    Question:
                    <input
                    onChange={e => handleChange(0, e)}
                    className="form-control"
                    required
                    name="question"
                    id="question-box"
                    type="text"
                    placeholder="Question"
                    value={question}
                    />
                </label>
            </div>
            {answers.map((answer, index) => (
                <div className="form-group">
                <label>
                    Answer:
                    <input
                    onChange={e => handleChange(index, e)}
                    className="form-control"
                    id={`answer${index}`}
                    name="answer"
                    type="text"
                    placeholder="Answer"
                    value={answer}
                    required
                    />
                </label>
                {answers.length > 1 && 
                    <button 
                        className="btn btn-danger" 
                        name="removeAnswer" 
                        type="button" 
                        onClick={() => handleRemoveAnswer(index)}>
                            Delete
                    </button>}
                </div>
            ))}
            <div className="container">
                <button className="btn btn-success" name="addAnotherAnswer" type="button" onClick={() => handleAddAnswer()}>
                    Add Answer
                </button>
            </div>
            <div className="container">
                <button className="btn btn-primary" id="submitButton" name="submitButton" type="submit">
                    Submit
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
                name="addModal"
                style={customStyles}
                isOpen={showAdd}
                contentLabel="Add Modal"
            >
                {body}
            </ReactModal>
        </div>
    )

/*
    return (
        <div>
            <div className="container">
                <ChangePassword/>
                
            </div>
            <p>{error}</p>
            <div className="card text-center" style={{width: 33 + 'rem'}}>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Topic:
                                <input
                                onChange={e => handleChange(0, e)}
                                className="form-control"
                                required
                                name="topic"
                                type="text"
                                placeholder="Topic"
                                value={topic}
                                />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Question:
                                <input
                                onChange={e => handleChange(0, e)}
                                className="form-control"
                                required
                                name="question"
                                type="text"
                                placeholder="Question"
                                value={question}
                                />
                            </label>
                        </div>
                        {answers.map((answer, index) => (
                            <div className="form-group">
                            <label>
                                Answer:
                                <input
                                onChange={e => handleChange(index, e)}
                                className="form-control"
                                id={`answer${index}`}
                                name="answer"
                                type="text"
                                placeholder="Answer"
                                value={answer}
                                required
                                />
                            </label>
                            {answers.length > 1 && 
                                <button 
                                    className="btn btn-danger" 
                                    name="removeAnswer" 
                                    type="button" 
                                    onClick={() => handleRemoveAnswer(index)}>
                                        Delete
                                </button>}
                            </div>
                        ))}
                        <button className="btn btn-success" name="addAnotherAnswer" type="button" onClick={() => handleAddAnswer()}>
                            Add Answer
                        </button>
                        <button className="btn btn-primary" id="submitButton" name="submitButton" type="submit">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
    */
}

export default AddQuestion;