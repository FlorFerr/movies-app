import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {

  const [movies, setMovies] = useState([])//aca guardo la información que traemos de la API.

  /*function fetchMoviesHandler () {
    fetch('https://swapi.dev/api/films')//Primer argumento la URL de la API, el segundo un obj para config la info o el method
    .then(response => {
      return response.json()
    })//Como fetch retorna una promise, la manejamos con then.
    .then(data => {
      const transformedMovies = data.results.map(movieData => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date
        }//Creo un nuevo obj con la info recibida para tener lo que me interesa mostrar o usar.
      })
      setMovies(transformedMovies)
    })//el json() es otra promise por lo que uso un segundo then. 
    
  }*/
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  


  const fetchMoviesHandler = useCallback(async() => {
    setIsLoading(true)//Pasamos a true pq cuando se ejecuta el fetch estamos esperando la información. 
    setError(null)
    

    try{
      const response = await fetch('https://moviesapp-10288-default-rtdb.firebaseio.com/movies.json')
     

      if(!response.ok){
        throw new Error ('Something went wrong')
      }//response.ok muestra el estado de la petición, en el caso que sea false tenemos un error. Acá creamos el mensaje que queremos ver, y en caso de haber error no se sigue ejecutando el código y pasa al catch. 
      //Validmos primero si hay error antes de parsear
    

      const data = await response.json()  

      const loadedMovies = [] //Ahora tengo un obj con una key que es el ID y adentro de esa key está la información.

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        })
      }
       

      const transformedMovies = loadedMovies.map((movieData) => {
        return {
          id: movieData.id,
          title: movieData.title,
          openingText: movieData.openingText,
          releaseDate: movieData.releaseDate
        }
      })
      setMovies(transformedMovies)
      

    }
    
    catch(error){
      setError(error.message)//Para ver cual es el error, es el mensaje que puse en el throw
      
    }
    setIsLoading(false)//Para que deje de cargar pq hay error o pq ya está la info
  }, [])

  useEffect(()=>{
    fetchMoviesHandler()
  },[fetchMoviesHandler])//The 'fetchMoviesHandler' function makes the dependencies of useEffect Hook (at line 34) change on every render. To fix this, wrap the 'fetchMoviesHandler' definition into its own useCallback() 

    async function addMovieHandler (movie)  {
      await fetch('https://moviesapp-10288-default-rtdb.firebaseio.com/movies.json',{
        method :'POST',
        body: JSON.stringify(movie),
        headers:{
          'Content-Type': 'application/json'
        }
        
      })
      fetchMoviesHandler()//En este caso usamos fetch para obtener los datos. Usamoe el segundo argumento para indicar como quiero guardar la info en firebase. Llamo de nuevo a fetch handler para que se actualice la info que se ve una vez que agrego un nuevo item. 
    }


  return (
    <React.Fragment>
      
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
    </section>
    <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movies.length > 0 && <MoviesList movies={movies} />} 
        {!isLoading && movies.length === 0 && !error && <p>Found no movies</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
