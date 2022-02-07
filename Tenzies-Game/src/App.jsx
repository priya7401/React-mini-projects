import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [rollCount, setRollCount] = React.useState(0)
    
    //state to check if the user has won the game or not
    const [tenzies, setTenzies] = React.useState(false)
    
    //useEffect is used to check for winning condition 
    //(i.e., all dice have same value and they are held (isHeld = true))
    
    // Normally useEffect is talked about as a side-effect as if it
    // only concerns something or some operation outside of this file, 
    // but keeping 2 pieces of internal states in sync is another reason 
    // to use this hook
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
        // let val = dice[0].value;
        // let i = 1;
        
        // for(i=1; i<dice.length; i++) {
        //     if(dice[i].value != val)
        //         break;
        //     else if(!dice[i].isHeld)
        //         break;
        // }
        // if(i == dice.length)
        //     setTenzies(true)
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    //generate a new set of dice and reset the state of the dice
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function rollDice() {
        if(!tenzies) {
            // if the game is not over, iterate over the dice arr
            // and check if it's held. If the die is not held, then
            // generate a new random number for the die, otherwise
            // let the die be held, as it was choosen by the user
            // since the state of the dice arr is changing, call the
            // setDice function to update the state
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            
            // increment the rollCount everytime a die is clicked
            setRollCount(prevCount => prevCount + 1);
            console.log(rollCount);
        }
        // if the game is over, set tenzies back to false for a new game
        // and also, assign new values to all the dice for a new game 
        else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0);
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <div className="titleAndCount">
                <div className="roll-count" > {rollCount}</div>
                <h1 className="title">Tenzies</h1>
            </div>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}