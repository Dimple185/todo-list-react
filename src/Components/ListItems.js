import React from 'react';
import './ListItem.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ListItems({ items, deleteItem, setUpdate, checkItems }) {
  return (
    <h1>
      {items !== 'objects'
        ? items.map((item, index) => {
            return (
              <div className='list' key={item.key}>
                <p>
                  <input
                    type='text'
                    id={item.key}
                    className='input'
                    value={item.text}
                    onChange={
                      (e) =>
                          setUpdate(e.target.text, item.key)
                    }
                  ></input>
                  <span style={{padding:'0 20px',margin:"0"}}>
                  <FontAwesomeIcon
                  className='faCheck'
                  icon='check'
                  onClick={() => checkItems(item.key,item.text)}
                  />
                  </span>
                    <span>
                    <FontAwesomeIcon
                      className='faicons'
                      icon='trash'
                      onClick={() => deleteItem(item.key, item._id)}
                    />
                  </span>
                </p>
              </div>
            );
          })
        : null}
    </h1>
  );
}

export default ListItems;
