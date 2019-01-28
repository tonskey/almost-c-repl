import React from 'react';

class Form extends React.Component {
    state = {
        defaultValue: 'main calls foo\n' + 'main calls foo'
    };

    handleKeyPress = e => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            this.props.updateCode(e.target.value);
            return false;
        }
    };

    render() {
        return (
            <div className="repl-container__form">
                <div className="form__title">
                    Write you code here
                    <span className="form__subtitle">
                        (press "shift + enter" to run code)
                    </span>
                </div>
                <textarea
                    defaultValue={this.state.defaultValue}
                    onKeyDown={this.handleKeyPress}
                    className="form__input"
                />
            </div>
        );
    }
}

export default Form;
