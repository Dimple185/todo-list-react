import logo from './logo.svg';
import './App.css';

import React, { Component } from 'react';
import ListItems from './Components/ListItems';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

library.add(faTrash);
library.add(faCheck);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      currentItem: {
        text: '',
        key: '',
      },
    };
    this.addItem = this.addItem.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.setUpdate = this.setUpdate.bind(this);
    this.checkItems=this.checkItems.bind(this);
  }

  componentDidMount() {
    axios
      .get('http://localhost:5001/todos/')
      .then((res) => {
        this.setState({
          items: res.data,
        });
      })
      .catch((err) => console.log(err));
  }

  handleInput(e) {
    console.log('e: ', e);
    const todo = {
      text: e.target.value,
      key: Date.now(),
    };

    this.setState({
      currentItem: [
        ...this.state.items,
        {
          text: e.target.value,
          key: Date.now(),
        },
      ],
    });
  }

  addItem(e) {
    e.preventDefault();
    const newItem = this.state.currentItem;
    if (newItem.text !== '') {
      axios
        .post(
          'http://localhost:5001/todos/add',
          this.state.currentItem[this.state.currentItem.length - 1]
        )
        .then((res) => {
          const items = [...this.state.items, newItem];
          this.setState({
            items: newItem,
            currentItem: {
              text: '',
              key: '',
            },
          });
          console.log(res.data);
        });
    }
  }

  deleteItem(key, _id) {
    console.log('_id', _id);
    const filteredItems = this.state.items.filter((item) => item.key !== key);
    axios
      .delete(`http://localhost:5001/todos/delete/${_id}`)
      .then((res) => console.log(res.data));
    this.setState({
      items: filteredItems,
    });
  }
  
  
  setUpdate(text, key) {
    console.log('text, key: ', text, key);
     axios
       .put(`http://localhost:5001/todos/update/`)
     .then((res) => console.log(res.data));
    const items = this.state.items;
    items.map((item) => {
      if (item.key === key) {
        item.text = text;
      }
    });
    this.setState({
      items: items,
    });
    // const items = this.state.items;

    // axios
    //   .put(`http://localhost:5001/todos/update/${todo._id}`, todo)
    //   .then((res) => console.log(res.data));
    // Object.keys(items).map((item) => {
    //   if (item['key'] === todo.key) {
    //     item['text'] = todo.text;
    //   }
    // });
    // this.setState(
    //   {
    //     items: items,
    //   },
    //   () => {
    //     console.log('state', this.state);
    //   }
    // );
  }

  checkItems(text,key) {
    const checkItem = this.state.checkItem;
    if (checkItem.text !== '') {
      axios
        .put(
          'http://localhost:5001/todos/checkUpdate/',
          this.state.checkItem[this.state.checkItem.length - 1]
        )
        .then((res) => {
          const items = [...this.state.items, checkItem];
          this.setState({
            items: checkItem,
            currentItem: {
              text: '',
              key: '',
            },
          });
          console.log(res.data);
        });
    }
  }

  render() {
    return (
      <div className='App'>
        <form id='to-do-list' onSubmit={this.addItem}>
          <header>
            <input
              type='text'
              placeholder='Enter Text'
              value={this.state.currentItem.text}
              onChange={this.handleInput}
            ></input>
            <button className>Add</button>
          </header>
          <ListItems
            items={this.state.items}
            deleteItem={this.deleteItem}
            setUpdate={this.setUpdate}
            checkItem={this.checkItems}
          ></ListItems>
        </form>
      </div>
    );
  }
}

export default App;
