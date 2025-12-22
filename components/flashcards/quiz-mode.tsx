'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Trophy } from 'lucide-react'

export function QuizMode({ flashcards }: { flashcards: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [finished, setFinished] = useState(false)

  const currentCard = flashcards[currentIndex]

  const handleSubmit = () => {
    setShowAnswer(true)
  }

  const handleCorrect = () => {
    setScore({ ...score, correct: score.correct + 1 })
    nextCard()
  }

  const handleIncorrect = () => {
    setScore({ ...score, incorrect: score.incorrect + 1 })
    nextCard()
  }

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setShowAnswer(false)
    } else {
      setFinished(true)
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore({ correct: 0, incorrect: 0 })
    setFinished(false)
  }

  if (finished) {
    const percentage = Math.round((score.correct / flashcards.length) * 100)
    return (
      <Card className="p-8 text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <div className="space-y-2 mb-6">
          <p className="text-lg">Score: {percentage}%</p>
          <p className="text-muted-foreground">
            {score.correct} correct, {score.incorrect} incorrect
          </p>
        </div>
        <Button onClick={restart}>Try Again</Button>
      </Card>
    )
  }

  if (!currentCard) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {flashcards.length}
        </span>
        <span className="text-sm text-muted-foreground">
          Score: {score.correct}/{currentIndex}
        </span>
      </div>

      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-4">Question:</h3>
        <p className="text-lg mb-6">{currentCard.front}</p>

        {!showAnswer ? (
          <div className="space-y-4">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full min-h-[100px] p-3 border rounded-md"
            />
            <Button onClick={handleSubmit} className="w-full">
              Submit Answer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-secondary p-4 rounded-md">
              <h4 className="font-semibold mb-2">Correct Answer:</h4>
              <p>{currentCard.back}</p>
            </div>
            {userAnswer && (
              <div className="bg-secondary/50 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Your Answer:</h4>
                <p>{userAnswer}</p>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={handleCorrect} className="flex-1" variant="outline">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                I got it right
              </Button>
              <Button onClick={handleIncorrect} className="flex-1" variant="outline">
                <XCircle className="w-4 h-4 mr-2 text-red-600" />
                I got it wrong
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
