import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

const Card = ({ title }) => {
  const [count, setCount] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  useEffect(() => {
    console.log(`The movie ${title} has been ${hasLiked ? 'liked' : 'unliked'}`)
  }, [hasLiked]) // this use effect will only run when hasLiked changes

  useEffect(() => {
    console.log(`The component for ${title} has mounted`)
  }, []) // this use effect will only run once when the component mounts

  return (
    <div
      className='card'
      onClick={() => setCount(count + 1)}
      //style={{
      //  border: '1px solid white'
      //  padding: '20px',
      // margin: '10px',
      // backgroundColor: '#31363f',
      // borderRadius: '10px',
      // minHeight: '100px',
      //}}
    >
      <h2>
        {title} <br />
        {count || null}
      </h2>

      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? '❤️' : '🤍'}
      </button>
    </div>
  )
}

const App = () => {
  //this is a common practice - first you give a varaible name (in this case 'hasLiked' then 'setHasLiked' is the return function that allows us to update the 'hasLiked' state)

  return (
    <div className='card-container'>
      <h2>Functional Arrow Component - Ok this is pretty cool</h2>
      <Card
        title='Star Wars'
        rating={5}
        idCool={true}
        actors={[{ name: 'Actors' }]}
      />
      <Card title='Back to the Future' />
      <Card title='Aliens' />
    </div>
  )
}

export default App
