import searchImg from '../assets/images/search.svg'

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className='search'>
      <div>
        <img src={searchImg} />
        <input
          type='text'
          placeholder='Search through thousands of movies'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          name='search'
        />
      </div>
    </div>
  )
}

export default Search
