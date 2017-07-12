import React, { Component } from 'react';
import './Confirm.css';


class Confirm extends Component {
    constructor(props) {
        super(props);

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleClick(e) {
        // exeptions for click target
        let uiElems = this.refs.root
            .querySelectorAll('.confirm-body, .confirm-ok, .confirm-text, .confirm-ui');

        // convert to array
        uiElems = [].slice.call(uiElems);

        if (uiElems.some(item => item === e.target))
            return;

        this.removeListener();
        this.props.onCancel();
    }

    confirm() {
        this.removeListener();
        this.props.onConfirm();
    }

    handleKeyPress(e) {
        e.stopPropagation();
        if (e.code === 'Escape' || e.code === 'Backspace') {
            this.removeListener();
            this.props.onCancel();
        }
        else if (e.code === 'Enter' || e.code === 'Space') {
            this.removeListener();
            this.props.onConfirm();
        }
    }

    removeListener() {
        document.getElementById('body').removeEventListener('keyup', this.handleKeyPress);
    }
    
    render() {
        return (
            <div className="confirm-main"
                ref="root"
                onClick={this.handleClick.bind(this)}
            >
                <div className="confirm-body">
                    <div className="confirm-text">{ this.props.children }</div>
                    <div className="confirm-ui">
                        <div className="confirm-ok" onClick={this.confirm.bind(this)}>Yes</div>
                        { this.props.noCancel ? '' :
                            <div className="confirm-cancel">Cancel</div>
                        }                        
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        document.getElementById('body').addEventListener('keyup', this.handleKeyPress);
    }
}

export default Confirm;