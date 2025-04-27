import './App.css'
import { useState } from 'react'
import Card from './components/Card/Card'
import GameInfo from './components/GameInfo/GameInfo'
import GameModal from './components/GameModal/GameModal'
import Header from './components/Header/Header'
import shapes, {Shape} from './data'

function dupShuffCards (input: Shape[]) : Shape[] {
  let result : Shape[] = []
  
  // Create second set with modified uniqueIds
  const secondSet = input.map((card, index) => ({
    ...card,
    uniqueId: `${index + 3}${card.uniqueId}`
  }))
  
  // Combine both sets
  result = [...input, ...secondSet]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  console.log(result)
  return result
}

function App() {
  const [showResult, setShowResult] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  const [initCards, setInitCards] = useState<Shape[]>([])
  const [matchedCards, setMatchedCards] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  if(initCards.length === 0){
    setInitCards(dupShuffCards(shapes))
  }

  const determineFlipped = (uniqueId: string) => {
    return flippedCards.has(uniqueId) || matchedCards.has(uniqueId)
  }

  const handleCardClick = (uniqueId: string) => {
    if (isProcessing || matchedCards.has(uniqueId) || flippedCards.has(uniqueId)) return

    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(uniqueId)) {
        newSet.delete(uniqueId)
      } else {
        newSet.add(uniqueId)
      }
      return newSet
    })

    const currentFlipped = new Set(flippedCards)
    currentFlipped.add(uniqueId)
    if (currentFlipped.size === 2) {
      setIsProcessing(true)
      const [firstId, secondId] = Array.from(currentFlipped)
      const firstCard = initCards.find(card => card.uniqueId === firstId)
      const secondCard = initCards.find(card => card.uniqueId === secondId)

      if (firstCard && secondCard && firstCard.shapeId === secondCard.shapeId) {
        // Cards match
        // if(matchedCards.size === 8) showResult = true
        if(matchedCards.size === 8) setShowResult(true)
        console.log("matched")
        setMatchedCards(prev => new Set([...prev, firstId, secondId]))
        setFlippedCards(new Set())
        setIsProcessing(false)
      } else {
        // Cards don't match, flip them back after a delay
        setTimeout(() => {
          setFlippedCards(new Set())
          setIsProcessing(false)
        }, 1000)
      }
    }
  }

  const reset = () => {
    setShowResult(false)
    setFlippedCards(new Set())
    setInitCards([])
    setMatchedCards(new Set())
    setIsProcessing(false)
  }

  return (
    <div>
      <Header />
      <GameInfo moves={0} score={0} timer={'60'} />
      <div className="cards-container">
        {initCards.map(({ shapeId, uniqueId, shape }) => (
          <Card
            key={uniqueId}
            uniqueId={uniqueId}
            shapeId={shapeId}
            shape={shape}
            isFlipped={determineFlipped(uniqueId)}
            handleCardClick={() => handleCardClick(uniqueId)}
          />
        ))}
      </div>
      {showResult && (
        <GameModal moves={10} score={40} win={true} handleResetGame={reset} />
      )}
    </div>
  )
}

export default App
