import React, { useState, useEffect } from 'react';
import SignOutButton from "./SignOut"
import './App.css';
import ChangePassword from "./ChangePassword"
import { useMutation } from '@apollo/client';
import queries from './queries';
import { Link } from 'react-router-dom'

function AddQuestion(props) {
    const [addQuestion] = useMutation(queries.ADD_QUESTION);
    const [topic, setTopic] = useState('');
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['']);
    //const [extraAnswers, setExtraAnswers] = useState(0);

    const createQuestion = async() => {

        await addQuestion ({
            variables: {
                t: topic,
                q: question,
                a: answers
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //createQuestion();
        console.log(topic);
        console.log(question);
        console.log(answers);
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

    // allow for multiple answers to be added to the form
    // figure out a way to then get those answers into an array to pass to apollo
    return (
        <div>
            <div className="container">
                <ChangePassword/>
                <SignOutButton/>
            </div>
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
    )
}

export default AddQuestion;