import React, { Component } from 'react';
import './List.css';

import Task from './../Task/Task';

function bubbleSort(a, compare) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (compare(a[i], a[i + 1])) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

class List extends Component {
    constructor(props) {
        super(props);
        props.list.editingTitle = false;
        //props.list.query = [];

        this.state = props.list;
    }

    changePin() {
        this.props.changePinOfList(this.props.index);
    }

    remove() {
        this.props.removeList(this.props.index);
    }

    editTitle() {
        this.setState({ editingTitle: true });
    }

    saveTitle() {
        let newTitle = this.refs.titleInput.value;
        this.props.renameList(newTitle);
        this.setState({ editingTitle: false });
    }

    addNewTask(form) {
        switch (form) {
            case 1:
                var title = this.refs.newTitle.value,
                    quantity = this.refs.newQuantity.value,
                    price = this.refs.newPrice.value;
                this.refs.newTitle.value = this.refs.newPrice.value = '';
                this.props.addTask(title, quantity, price);
                break;

            case 0:
                this.props.addTask(this.refs.search.value, 1, 0);
                break;
            default:
        }
        this.setState({ query: [] });
        this.refs.search.value = '';
    }

    nextTitleSort() {
        let newValue = this.state.sortByTitle + 1;
        newValue = newValue === 2 ? 0 : newValue;
        this.props.changeSort('sortByTitle', newValue);
    }

    nextPriceSort() {
        let newValue = this.state.sortByPrice + 1;
        newValue = newValue === 2 ? -1 : newValue;
        this.props.changeSort('sortByPrice', newValue);
    }

    nextCompletionSort() {
        let newValue = this.state.sortByCompletion + 1;
        newValue = newValue === 2 ? -1 : newValue;
        this.props.changeSort('sortByCompletion', newValue);
    }

    search() {
        this.setState({ query: this.refs.search.value.split(' ') });
    }

    render() {
        var sortedTasks = [...this.state.tasks];

        // filtering
        sortedTasks = sortedTasks.filter(item => {
            let stuff = item.title + item.description;
            stuff = stuff.toUpperCase();
            return this.state.query.every(qword => stuff.search(qword.toUpperCase()) !== -1);
        });

        // sorting
        if (this.state.sortByTitle === 1)
            bubbleSort(sortedTasks, (a, b) => a.title.localeCompare(b.title) === 1);

        if (this.state.sortByPrice === 1)
            bubbleSort(sortedTasks, (a, b) => a.price < b.price);
        if (this.state.sortByPrice === -1)
            bubbleSort(sortedTasks, (a, b) => a.price > b.price);

        if (this.state.sortByCompletion === 1)
            bubbleSort(sortedTasks, (a, b) => a.isCompleted > b.isCompleted);
        else if (this.state.sortByCompletion === -1)
            bubbleSort(sortedTasks, (a, b) => a.isCompleted < b.isCompleted);

        const Tasks = sortedTasks.map(item =>
            <Task task={item}
                key={item.id}
                index={item.id}
                changeLink={this.props.changeLink.bind(this, item.id)}
                changeDescription={this.props.changeDescription.bind(this, item.id)}
                changeTitle={this.props.changeTitle.bind(this, item.id)}
                changeQuantity={this.props.changeQuantity.bind(this, item.id)}
                changePrice={this.props.changePrice.bind(this, item.id)}
                changeCompleted={this.props.changeCompleted.bind(this, item.id)}
                removeTask={this.props.removeTask.bind(this, item.id)}
            />
        )

        let showSearchAdd = this.state.query.length > 0 && Tasks.length < 1;            

        let pinClasses = `pin-list-check${this.state.isPinned ? ' checked' : ''}`;

        return (
            <div className="list-body">
                <div className="list-header">
                    <div className={pinClasses} onClick={this.changePin.bind(this)}></div>

                    { !this.state.editingTitle ?
                        <div className="list-title"
                            onClick={this.editTitle.bind(this)}
                        >{this.props.list.title}</div>
                        :
                        <input className="list-title-input"
                            ref="titleInput"
                            defaultValue={this.props.list.title}
                            autoFocus="true"
                            onBlur={this.saveTitle.bind(this)}
                        />
                    }

                    <div className="remove-list-button"
                        onClick={this.remove.bind(this)}
                    ></div>

                </div>
                <div className="list-content">
                    <div className={ `list-ui${showSearchAdd ? ' add' : ''}` }>
                        <input className="list-text"
                            ref="search"
                            type="text"
                            placeholder="Find"
                            value={this.state.query.join(' ')}
                            onChange={this.search.bind(this)}
                            spellCheck="false"
                        />
                        <div className="list-ui-button"
                            onClick={this.addNewTask.bind(this, 0)}
                        >+</div>
                    </div>
                    <div className="list-filters">
                        <div className={`name-sort${this.state.sortByTitle === 1 ? ' bottom' : ''}`} onClick={this.nextTitleSort.bind(this)}></div>
                        <div className={`price-sort${this.state.sortByPrice === 1 ? ' bottom' : this.state.sortByPrice === -1 ? ' top' : ''}`} onClick={this.nextPriceSort.bind(this)}></div>
                        <div className="complete-sort off" onClick={this.nextCompletionSort.bind(this)}></div>
                    </div>

                    { Tasks }

                    <div className="newtask">
                        <div className="newtask-header">
                            <div className="newtask-header-main">
                                <input className="name"
                                    ref="newTitle"
                                    type="text"
                                    placeholder="Item name"
                                /><strong> х <input className="quantity"
                                    ref="newQuantity"
                                    type="number"
                                    defaultValue="1"
                                    min="0"
                                /></strong>
                            </div>
                            <div className="newtask-header-right">
                                <div><input className="price"
                                    ref="newPrice"
                                    type="number"
                                    placeholder="100"
                                    min="0"
                                /> ₽</div>
                                <div className="add"
                                    onClick={this.addNewTask.bind(this, 1)}
                                >
                                    <div>+</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default List;