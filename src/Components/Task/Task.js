import React, { Component } from 'react';
import './Task.css';

import deleteI from './img/delete.png';
import checkboxI from './img/checkbox.png';

class Task extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            nameEditing: false,
            quantityEditing: false
        };
    }

    expand() {
        this.setState({ expanded: true });
    }
    reduce() {
        this.setState({ expanded: false });
    }
    handleClick(e) {
        // exeptions for click target
        let uiElems = this.refs.root
            .querySelectorAll('img, .link-icon, input');

        // convert to array
        uiElems = [].slice.call(uiElems);

        if (uiElems.some(item => item === e.target))
            return;
        
        if (this.state.expanded)
            this.reduce()
        else
            this.expand()
    }

    saveDescr() {
        let newDescription = this.refs.description.value;
        this.props.changeDescription(newDescription);
    }

    saveLink() {
        let newLink = this.refs.linkInput.value;
        this.props.changeLink(newLink);
    }

    editTitle() {
        this.setState({
            nameEditing: true,
            expanded: true
        });
    }

    saveTitle() {
        let newTitle = this.refs.titleInput.value;
        this.setState({ nameEditing: false });

        this.props.changeTitle(newTitle);
    }
    
    editQuantity() {
        this.setState({
            quantityEditing: true,
            expanded: true
        });
    }

    saveQuantity() {
        let newQuantity = this.refs.quantityInput.value;
        this.setState({ quantityEditing: false });

        this.props.changeQuantity(newQuantity);
    }

    editPrice() {
        this.setState({
            priceEditing: true,
            expanded: true
        });
    }

    savePrice() {
        let newPrice = this.refs.priceInput.value;
        this.setState({ priceEditing: false });

        this.props.changePrice(newPrice);
    }

    render() {
        let mainClasses = `task${this.state.expanded ? ' expanded' : ''}${this.props.task.isCompleted ? ' completed' : ''}`;
        return (
            <div ref="root" className={mainClasses}>
                <div className="task-header" onClick={ this.handleClick.bind(this) }>
                    <div className="task-header-main">
                        {
                            this.state.nameEditing ?
                                <input className="name"
                                    ref="titleInput"
                                    type="text"
                                    autoFocus="true"
                                    defaultValue={this.props.task.title}
                                    onBlur={this.saveTitle.bind(this)}
                                    spellCheck="false"
                                />
                            :
                                <span className="name"
                                    onDoubleClick={this.editTitle.bind(this)}
                                >{this.props.task.title}</span>

                        }<strong>&nbsp;х
                        {
                            this.state.quantityEditing ?
                                <input className="quantity"
                                    ref="quantityInput"
                                    type="number"
                                    min="0"
                                    defaultValue={this.props.task.quantity}
                                    autoFocus="true"
                                    onBlur={this.saveQuantity.bind(this)}
                                />
                            :
                                <span className="quantity"
                                    onDoubleClick={this.editQuantity.bind(this)}
                                >{this.props.task.quantity}</span>
                            
                        }</strong>
                        {
                            this.props.task.link ?
                                <a href={/^http.*:\/\//.test(this.props.task.link) ? this.props.task.link : 'http://' + this.props.task.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-icon"> </a>
                        :''}
                    </div>
                    <div className="task-header-right">
                        {
                            this.state.priceEditing ?
                                    <input className="price"
                                        ref="priceInput"
                                        type="number"
                                        min="0"
                                        defaultValue={(Math.ceil(this.props.task.price * 100) / 100).toFixed(2)}
                                        autoFocus="true"
                                        onBlur={this.savePrice.bind(this)}
                                    />
                                :
                                    <div className="price"
                                        onDoubleClick={this.editPrice.bind(this)}
                                    >{(Math.ceil(this.props.task.price * 100) / 100).toFixed(2)}&thinsp;₽</div>
                        }
                        <img className="delete"
                            src={deleteI}
                            alt="Delete"
                            onClick={this.props.removeTask}
                        />
                        <img className="button"
                            src={checkboxI}
                            alt="Complete"
                            onClick={this.props.changeCompleted}
                        />
                    </div>
                </div>
                <div className="task-full">
                    <textarea className="description"
                        ref="description"
                        rows="3"
                        spellCheck="false"
                        placeholder="Description, hashtags, whatever"
                        defaultValue={this.props.task.description}
                        onBlur={this.saveDescr.bind(this)}></textarea>

                    <textarea className="link"
                        ref="linkInput"
                        rows="1"
                        spellCheck="false"
                        placeholder="Link"
                        defaultValue={this.props.task.link}
                        onBlur={this.saveLink.bind(this)}></textarea>
                </div>
            </div>
        );
    }
}

export default Task;