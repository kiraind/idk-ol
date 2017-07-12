import React, { Component } from 'react';

import Header from './../Header/Header';
import List from './../List/List';
import Confirm from './../Confirm/Confirm';

import './App.css';

function parseTags(description) {
    let splitted = description.split('#');
    splitted.splice(0, 1);

    return splitted.map(item => {
        // if empty line or space etc. after the hash char
        // eslint-disable-next-line
        if (!item.trim() || /[\s\\\/\.\,]/.test(item[0])) return;

        let words = item.match(/\S+/g).map(str => str.trim());
        return words[0];
    }).filter( item => !!item ); // get rid of undefined's
}

class App extends Component {
    constructor(props) {
        super(props);

        props.page.query = [];
        props.page.showConfirm = false;
        this.state = props.page;
    }

    //       app methods
    
    makeList() {
        const newLists = [...this.state.lists];

        var maxIndex = newLists.reduce((prev, curr) => Math.max(prev, curr.id), 0);
        maxIndex++;

        newLists.push({
            "id": maxIndex,
            "isPinned": false,
            "title": "New list #" + maxIndex,
            "sortByTitle": 0,
            "sortByPrice": 0,
            "sortByCompletion": 0,
            "tasks": [],
        })

        this.setState({ lists: newLists });
    }

    search(query) {
        this.setState({ query: query.split(' ') })
    }

    componentDidUpdate(_, prevState) {

        // if not only search queries changed
        if ((prevState.showConfirm !== this.state.showConfirm && (this.state.showConfirm || this.state.wasCanceled)) ||
            prevState.query !== this.state.query ||
            this.state.lists.some((list, i) =>
                prevState.lists[i] ?
                    list.query !== prevState.lists[i].query
                    : false
            ))
            return;

        var state = JSON.parse(JSON.stringify(this.state));

        delete state.query;
        delete state.showConfirm;
        delete state.confirmText;
        delete state.noCancel;

        state.lists.forEach(list => {
            delete list.editingTitle;
            delete list.query;
        })

        console.log('*send stuff to server*');

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:9000/posthere");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // todo
        /*xhr.send(JSON.stringify(state));*/
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;

            if (xhr.status !== 200) {
                this.setState({
                    showConfirm: true,
                    noCancel: true,
                    confirmText: 'Some error occured :(',
                    onConfirm: () => {
                        this.setState({
                            showConfirm: false,
                            wasCanceled: true,
                            noCancel: undefined,
                            confirmText: undefined
                        });
                    },
                    onCancel: () => {}
                });
            }
        };
    }

    //      list methods
    removeList(id) {
        this.setState({
            showConfirm: true,
            confirmText: 'Are you sure you want to delete this list?',
            deleteListTarget: id,
            onConfirm: () => {
                let newLists = [...this.state.lists];
                const targetIndex = newLists.findIndex(item => item.id === this.state.deleteListTarget);
                newLists.splice(targetIndex, 1);
                this.setState({ lists: newLists });

                this.setState({
                    showConfirm: false,
                    wasCanceled: false,
                    confirmText: undefined,
                    deleteListTarget: undefined
                });
            },
            onConfirmCancel: () => {
                this.setState({
                    showConfirm: false,
                    wasCanceled: true,
                    confirmText: undefined,
                    deleteListTarget: undefined
                });
            }
        });
    }

    changePinOfList(id) {
        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === id);
        list.isPinned = !list.isPinned;

        this.setState({ lists: newLists });
    }

    renameList(id, newTitle) {
        newTitle = newTitle.trim();

        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === id);
        list.title = newTitle || 'Untitled list';

        this.setState({ lists: newLists });
    }

    addTask(listId, title, quantity, price) {
        title = title.trim();

        quantity = parseFloat(quantity);
        price = parseFloat(price);

        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === listId);

        let maxIndex = list.tasks.reduce((prev, curr) => Math.max(prev, curr.id), 0);
        maxIndex++;

        list.tasks.push({
            id: maxIndex,
            title: title || 'Untitled Space Craft',
            description: '',
            tags: [],
            link: '',
            quantity: isNaN(quantity) ? 1 : quantity,
            price: isNaN(price) ? 0 : price,
            isCompleted: false
        });

        this.setState({ lists: newLists });
    }
    //       price/completion/title
    changeSort(id, prop, val) {
        const newLists = [...this.state.lists];
        
        let list = newLists.find(item => item.id === id);
        list[prop] = val;

        this.setState({ lists: newLists });
    }

    //           task methods

    changeLink(listId, taskId, newLink) {
        newLink = newLink.trim();
        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === listId);
        let task = list.tasks.find(item => item.id === taskId);

        task.link = newLink;

        this.setState({ lists: newLists });
    }

    changeDescription(listId, taskId, newDescription) {
        newDescription = newDescription.trim();
        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === listId);
        let task = list.tasks.find(item => item.id === taskId);

        task.description = newDescription;
        
        task.tags = parseTags(newDescription);

        this.setState({ lists: newLists });
    }

    changeTitle(listId, taskId, newTitle) {
        newTitle = newTitle.trim();
        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === listId);
        let task = list.tasks.find(item => item.id === taskId);

        task.title = newTitle || 'Untitled Space Craft';

        this.setState({ lists: newLists });
    }

    changeQuantity(listId, taskId, newQuantity) {
        newQuantity = parseFloat(newQuantity);
        newQuantity = isNaN(newQuantity) ? 1 : newQuantity;

        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === listId);
        let task = list.tasks.find(item => item.id === taskId);

        let price4_1 = task.price / task.quantity;

        task.quantity = newQuantity;
        task.price = price4_1 * newQuantity;

        this.setState({ lists: newLists });
    }

    changePrice(listId, taskId, newPrice) {
        newPrice = parseFloat(newPrice);
        newPrice = isNaN(newPrice) ? 0 : newPrice;

        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === listId);
        let task = list.tasks.find(item => item.id === taskId);

        task.price = newPrice;

        this.setState({ lists: newLists });
    }

    removeTask(listId, taskId) {
        this.setState({
            showConfirm: true,
            confirmText: 'Are you sure you want to delete this item?',
            onConfirm: () => {
                let newLists = [...this.state.lists];

                const targetListIndex = newLists.findIndex(item => item.id === listId);

                const targetTaskIndex = newLists[targetListIndex].tasks
                    .findIndex(item => item.id === taskId);

                newLists[targetListIndex].tasks.splice(targetTaskIndex, 1);

                this.setState({ lists: newLists });

                this.setState({
                    showConfirm: false,
                    wasCanceled: false,
                    confirmText: undefined,
                    deleteListTarget: undefined,
                    deleteTaskTarget: undefined
                });
            },
            onConfirmCancel: () => {
                this.setState({
                    showConfirm: false,
                    wasCanceled: true,
                    confirmText: undefined,
                    deleteTaskTarget: undefined,
                    deleteListTarget: undefined
                });
            }
        });
    }

    changeCompleted(listId, taskId) {
        const newLists = [...this.state.lists];

        let list = newLists.find(item => item.id === listId);
        let task = list.tasks.find(item => item.id === taskId);

        task.isCompleted = !task.isCompleted;

        this.setState({ lists: newLists });
    }


    
    render() {
        let sortedLists = [...this.state.lists];

        // filtering
        let query = this.state.query;
        if (query.length > 0)
            sortedLists = sortedLists.filter(list =>
                // by title
                query.every(qword => list.title.toUpperCase()
                    .search(qword.toUpperCase()) !== -1)

                ||

                // by content
                list.tasks.some(task =>
                    query.every(qword =>
                        (task.title + task.description).toUpperCase()
                            .search(qword.toUpperCase()) !== -1
                    )
                )
            )

        sortedLists.forEach(item => item.query = query);
        
        sortedLists.sort((a, b) => (b.isPinned && !a.isPinned));
        const Lists = sortedLists.map(item => <List
                list={item}
                key={item.id}
                index={item.id}
                changePinOfList={this.changePinOfList.bind(this)}
                removeList={this.removeList.bind(this)}
                renameList={this.renameList.bind(this, item.id)}
                addTask={this.addTask.bind(this, item.id)}

                changeDescription={this.changeDescription.bind(this, item.id)}
                changeLink={this.changeLink.bind(this, item.id)}
                changeTitle={this.changeTitle.bind(this, item.id)}
                changeQuantity={this.changeQuantity.bind(this, item.id)}
                changePrice={this.changePrice.bind(this, item.id)}
                changeCompleted={this.changeCompleted.bind(this, item.id)}
                removeTask={this.removeTask.bind(this, item.id)}
                changeSort={this.changeSort.bind(this, item.id)}
            />
        )

        var tags = [];
        sortedLists.forEach(list =>
            list.tasks.forEach(task =>
                task.tags.forEach(tag => {
                    if (tags.some(oldTag => oldTag.name === tag))
                        tags.find(item => item.name === tag).count++
                    else
                        tags.push({ name: tag, count: 1 });
                }
                )));
        tags.sort((a, b) => a.count < b.count);

        return (
            <div>
                <Header tagRating={tags}
                    search={this.search.bind(this)} />
                <section className="header-gap"></section>
                <main>
                    {Lists}
                    <div onClick={this.makeList.bind(this)} className="newlist-button"></div>
                    <div className="right-gap"></div>
                </main>
                {this.state.showConfirm ?
                    <Confirm onConfirm={ this.state.onConfirm.bind(this) }
                        onCancel={this.state.onConfirmCancel.bind(this)}
                        noCancel={!!this.state.noCancel}>
                        {this.state.confirmText}
                    </Confirm>
                :''}
          </div>
        );
    }
}

export default App;
