"use client"

import { useState, useEffect } from "react"
import { Scissors, Hand, Cloud } from "lucide-react"
import axios from "axios";

type Choice = "rock" | "paper" | "scissors" | null

const API_IP = "172.27.73.85:5000";

const shockPlayer = async (player: 1 | 2) => {
  await axios.post(`http://${API_IP}/error${player === 1 ? "" : "2"}`);
}

export default function RockPaperScissorsGame() {
  const [leftChoice, setLeftChoice] = useState<Choice>(null)
  const [rightChoice, setRightChoice] = useState<Choice>(null)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<string>("")

  // Reset game
  const resetGame = () => {
    setLeftChoice(null)
    setRightChoice(null)
    setShowResult(false)
    setResult("")
  }

  // Determine winner when both players have chosen
  useEffect(() => {
    if (leftChoice && rightChoice) {
      setTimeout(() => {
        if (leftChoice === rightChoice) {
          setResult("TIE")
        } else if (
          (leftChoice === "rock" && rightChoice === "scissors") ||
          (leftChoice === "paper" && rightChoice === "rock") ||
          (leftChoice === "scissors" && rightChoice === "paper")
        ) {
          try{
            shockPlayer(2);
          }catch(e){
            console.log("Error while shocking player 2", e);
          }
          setResult("LEFT WINS")

        } else {
          try{
            shockPlayer(1);
          }catch(e){
            console.log("Error while shocking player 1", e);
          }
          setResult("RIGHT WINS")
        }
        setShowResult(true)

        // Auto reset after 3 seconds
        setTimeout(resetGame, 3000)
      }, 1000)
    }
  }, [leftChoice, rightChoice])

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showResult) return

      if (!leftChoice) {
        if (e.key === "a") setLeftChoice("rock")
        if (e.key === "s") setLeftChoice("paper")
        if (e.key === "d") setLeftChoice("scissors")
      }

      if (!rightChoice) {
        if (e.key === "l") setRightChoice("rock")
        if (e.key === "ö") setRightChoice("paper")
        if (e.key === "ä") setRightChoice("scissors")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [leftChoice, rightChoice, showResult])

  const renderChoice = (choice: Choice, isRevealed = false) => {
    if (!choice) return null
    if (!isRevealed) return <div className="w-40 h-40 bg-white rounded-full" />

    switch (choice) {
      case "rock":
        return <Cloud className="w-40 h-40 text-white" />
      case "paper":
        return <Hand className="w-40 h-40 text-white" />
      case "scissors":
        return <Scissors className="w-40 h-40 text-white" />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center">
      {/* Left Player */}
      <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-800">
        <div>
          {/* Choice indicators */}
          <div className="flex justify-center mb-16">
            {leftChoice ? (
              renderChoice(leftChoice, showResult)
            ) : (
              <div className="w-40 h-40 border-2 border-gray-600 rounded-full" />
            )}
          </div>

          {/* Key options */}
          <div className="flex space-x-16 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Cloud className="w-20 h-20 text-gray-400" />
              <kbd className="px-3 py-1 text-xl border border-gray-700 rounded">A</kbd>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Hand className="w-20 h-20 text-gray-400" />
              <kbd className="px-3 py-1 text-xl border border-gray-700 rounded">S</kbd>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Scissors className="w-20 h-20 text-gray-400" />
              <kbd className="px-3 py-1 text-xl border border-gray-700 rounded">D</kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Center Result */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {showResult && <div className="text-6xl font-bold text-center">{result}</div>}
      </div>

      {/* Right Player */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div>
          {/* Choice indicators */}
          <div className="flex justify-center mb-16">
            {rightChoice ? (
              renderChoice(rightChoice, showResult)
            ) : (
              <div className="w-40 h-40 border-2 border-gray-600 rounded-full" />
            )}
          </div>

          {/* Key options */}
          <div className="flex space-x-16 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Cloud className="w-20 h-20 text-gray-400" />
              <kbd className="px-3 py-1 text-xl border border-gray-700 rounded">L</kbd>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Hand className="w-20 h-20 text-gray-400" />
              <kbd className="px-3 py-1 text-xl border border-gray-700 rounded">Ö</kbd>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Scissors className="w-20 h-20 text-gray-400" />
              <kbd className="px-3 py-1 text-xl border border-gray-700 rounded">Ä</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
