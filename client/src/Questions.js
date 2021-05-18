import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import queries from './queries';

function Questions() {
    const [ page, setPage ] = useState(1);
    const {loading, error, data} = useQuery(queries.GET_QUESTIONS, {variables: {page: page}, fetchPolicy: 'cache-and-network'});

    if (data) {
        const {getQuestions} = data;
        return (
            <div>
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
                                                <p>Topic: {question.topic}</p>
                                                <p>{question.question}</p>
                                                <p>Aceptable Answers:</p>
                                                <ul>
                                                    {question.answers.map((answer) => {
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
        return <div>{error.message}</div>;
    }
}

export default Questions;