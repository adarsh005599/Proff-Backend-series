import { useEffect, useState } from 'react'
import axios from 'axios';



function App() {
    const [jokes, setJokes] = useState([]);

    useEffect(() => {
      axios.get('/api/jokes')   
        .then((response) => {
            setJokes(response.data)
        })
        .catch((error) => {
            console.log("Opps! Error Aa Gaya🥲🥲")
        })
    }, [])
  return (
    <>
      <h2>Hello Full-Stack</h2>
      <p>JOKES: {jokes.length}</p>

      {
        jokes.map((joke, index) => (
          <div key={joke.id}>
            <p>{joke.joke}</p>
          </div>
        ))
      }
  
    </>
  )
}

export default App;


