import { cardFront } from '../../config/icons'
import './style.css'

interface CardProps {
  uniqueId: string
  shapeId: string
  shape: string
  isFlipped: boolean
  handleCardClick: () => void
}

function Card({ shape, isFlipped, handleCardClick }: CardProps) {
  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <img src={cardFront} className="card-front" alt="Card Front" />
        </div>
        <div className="card-back">
          <img src={shape} className="number icon" alt="Number icon" />
        </div>
      </div>
    </div>
  )
}

export default Card
