//Juho Ahonen

import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

const URL = "http://localhost:80/kouluhommat/ostoslistabackend/"

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [count, setCount] = useState('')

  useEffect(() => {
    axios.get(URL)
    .then((response) => {
      setItems(response.data)
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }, [])

  function save(e) {
    e.preventDefault();
    
    const json = JSON.stringify({description:item,amount:count})
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      setItems(items => [...items,response.data]);
      setItem("");
      setCount("");
    }).catch (error => {
      alert(error.response.data.error)
    });
  }
  
  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php', json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id);
      setItems(newListWithoutRemoved);
    }).catch (error => {
      alert(error.response ? error.response.data.error : error)
    })
  }


  return (
    <div>
      <h1>Shoppinglist</h1>
      <form onSubmit={save}>
        <label>New item</label>
        <input value={item} onChange={e=> setItem(e.target.value)} placeholder="type description" />
        <label>Amount</label>
        <input value={count} onChange={e=> setCount(e.target.value)} placeholder="type amount" />
        <button>Add item</button>
      </form>

      <ul>
        {items?.map(item => (
          <li key={item.id}>{item.description}&nbsp;{item.amount}
            <a href="#" className='delete' onClick={() => remove(item.id)}>
              Delete
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
