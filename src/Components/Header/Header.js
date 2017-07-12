import React, { Component } from 'react';
import logo from './img/logo.png';
import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            focusOnInput: false
        }
    }

    setSearchTag(q) {
        this.refs.search.value += ' ' + q;
        this.setState({ query: this.refs.search.value})
        this.props.search(this.refs.search.value);
        
    }

    setSearchInput() {
        this.setState({ query: this.refs.search.value });
        this.props.search(this.refs.search.value );
    }

    setFocus(val) {
        this.setState({ focusOnInput: val })
    }

    render() {
        let Tags = this.props.tagRating.map((tag, i) =>
            <div className="header-tag"
                key={i}
                onClick={this.setSearchTag.bind(this, '#' + tag.name)}
            >{'#' + tag.name}</div>
        );

        return (
            <header>
                <img className="header-logo" src={logo} alt="Logo" />
                
                <input className="header-search"
                    ref="search"
                    type="text"
                    placeholder="Search"
                    spellCheck="false"
                    defaultValue={this.state.query}
                    onChange={this.setSearchInput.bind(this)}
                />

                <div className="header-tag-container">
                    <div className="header-tag-label">tags:</div>
                    { Tags }
                </div>
            </header>
        );
    }
}

export default Header;