import React from 'react';

const Result = props => {
    if (!props.error && !props.result) return null;

    return (
        <div className="repl-container__result">
            <h4 className="result__title">Result:</h4>

            {props.result && (
                <div className="result__words">
                    {props.result.map((word, i) => (
                        <div key={i} className="result__word">
                            {word}
                        </div>
                    ))}
                </div>
            )}

            {props.error && (
                <div className="result__error">{props.error.message}</div>
            )}
        </div>
    );
};

export default Result;
