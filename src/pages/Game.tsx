import GameBoard from '../GameBoard'
import { Link } from 'react-router-dom'
import { useGame } from '../store'

export default function Game() {
  const { currentDeckId } = useGame()
  return (
    <div className="container">
      <div style={{position:'fixed', top:16, left:16}}>
        <Link to="/" className="link">← Home</Link>
      </div>
      {!currentDeckId ? (
        <div className="card">
          <p>No deck selected.</p>
          <Link to="/play" className="link">Choose a deck</Link>
        </div>
      ) : (
        <GameBoard />
      )}
    </div>
  )
}
