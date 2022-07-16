import React from 'react'
import { useState } from'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
const [message, setMessage] = useState(initialMessage);
const [email, setEmail] = useState(initialEmail);
const [index, setIndex] = useState(initialIndex);
const [steps, setSteps] = useState(initialSteps);

  function getXY(idx) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let x = 0;
    let y = 0;
    if (idx <= 2) {
      y = 1;
      x = idx + 1
    } else if (idx >= 3 && idx <= 5) {
      y = 2;
      x = idx - 2;
    } else if (idx >= 6 && idx <= 8) {
      y = 3;
      x = idx - 5;
    } 
    return ({x, y})
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates ${this.getXY([index])} You have moved 0 times`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setEmail(initialEmail)
    setMessage(initialMessage)
    setSteps(initialSteps)
    setIndex(initialIndex)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
      if(direction === "left" && getXY(index).x !== 1) {

        setIndex(index -1)
        setMessage(initialMessage)
        setSteps(steps +1)

      } else if (direction==="left" && getXY(index).x ===1){

        setMessage("You can't go left")

      } else if (direction==="right" && getXY(index).x !==3){

        setIndex(index +1)
        setMessage(initialMessage)
        setSteps(steps +1)

      } else if (direction==="right" && getXY(index).x ===3){

        setMessage("You can't go right")

      } else if (direction==="up" && getXY(index).y !==1){

        setIndex(index -3)
        setMessage(initialMessage)
        setSteps(steps +1)

      } else if (direction==="up" && getXY(index).y ===1){

        setMessage("You can't go up")

      } else if (direction==="down" && getXY(index).y !==3){

        setIndex(index +3)
        setMessage(initialMessage)
        setSteps(steps +1)

      } else if (direction==="down" && getXY(index).y ===3){

        setMessage("You can't go down")

      }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const { id } = evt.target
    getNextIndex(id)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target
    setEmail(value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios.post(`http://localhost:9000/api/result`, { x: getXY(index).x, y: getXY(index).y, steps: steps, email: email })
      .then(res => {
        console.log(res)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
        setMessage(err.response.data.message)
      })
    setEmail(initialEmail)
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({getXY(index).x}, {getXY(index).y})</h3>
        <h3 id="steps">You moved {steps} time{steps===1 ? null : 's'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={email} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
