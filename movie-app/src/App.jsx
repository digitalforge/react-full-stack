import React, { use } from 'react'
import heroImg from './assets/images/hero-img.png'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
import { useState, useEffect } from 'react'
import { updateSearchCount } from '../appwrite'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY // Accessing the API key from environment variables
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('') // Clear any previous error messages
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` // encodeURIComponent is used to make the query URL safe by encoding special characters. Example: spaces become %20
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        //this works like a catch for fetch errors so why do we need a catch block? Well, fetch only throws an error for network issues, not for HTTP errors like 404 or 500. So we check response.ok to handle those cases.
        throw new Error(
          `Failed to fetch movies: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'An unknown error occurred.') // this is for API errors
        setMovieList([]) // this clears the movie list if there's an error
        return // this stops further execution
      }

      setMovieList(data.results)
      setIsLoading(false)

      if (query && data.results.length > 0) {
        // update search count in Appwrite only if there's a valid search term and results
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      setErrorMessage('Failed to fetch movies. Please try again later.')
    } finally {
      setIsLoading(false) // why? because we want to stop loading state regardless of success or failure
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm]) // What is useEffect? It runs side effects. Side effects are operations that affect something outside the component, like fetching data, setting up subscriptions, or manually changing the DOM.

  return (
    <div className='pattern'>
      <div className='wrapper'>
        <header>
          <img src={heroImg} className='logo' alt='Hero Banner' />
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy the
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className='all-movies'>
          <h2 className='mt-10'>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map(
                (
                  movie // when you don't use curly braces, you don't need a return statement because it's an implicit return
                ) => (
                  <MovieCard key={movie.id} movie={movie} />
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
