import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4  //the index the "B" is at


const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = {
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex,
  }

  getXY = (idx) => {
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
  

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    return `Coordinates ${this.getXY(this.state.index)} You have moved 0 times`
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      ...this.state,
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
    })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    const { index } = this.state
      if(direction === "left" && this.getXY(index).x !== 1) {
        this.setState({
          ...this.state,
          index: index -1,
          message: initialMessage,
          steps: this.state.steps +1
        })
      } else if (direction==="left" && this.getXY(index).x ===1){
        this.setState({
          ...this.state,
          message: "You can't go left"
        })
      } else if (direction==="right" && this.getXY(index).x !==3){
        this.setState({
          ...this.state,
          index: index + 1,
          message: initialMessage,
          steps: this.state.steps +1
        })
      } else if (direction==="right" && this.getXY(index).x ===3){
        this.setState({
          ...this.state,
          message: "You can't go right"
        })
      } else if (direction==="up" && this.getXY(index).y !==1){
        this.setState({
          ...this.state,
          index: index - 3,
          message: initialMessage,
          steps: this.state.steps +1
        })
      } else if (direction==="up" && this.getXY(index).y ===1){
        this.setState({
          ...this.state,
          message: "You can't go up"
        })
      } else if (direction==="down" && this.getXY(index).y !==3){
        this.setState({
          ...this.state,
          index: index + 3,
          message: initialMessage,
          steps: this.state.steps +1
        })
      } else if (direction==="down" && this.getXY(index).y ===3){
        this.setState({
          ...this.state,
          message: "You can't go down"
        })
      }
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const { id } = evt.target
    this.getNextIndex(id)
    console.log(this.state)
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    const { value } = evt.target
    this.setState({
      ...this.state,
      email: value
    })
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios.post(`http://localhost:9000/api/result`, { x: this.getXY(this.state.index).x, y: this.getXY(this.state.index).y, steps: this.state.steps, email: this.state.email })
      .then(res => {
        console.log(res)
        this.setState({
          ...this.state,
          message: res.data.message
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          ...this.state,
          message: err.response.data.message
        })
      })
    this.setState({
      ...this.state,
      email: initialEmail
    })
  }

  render() {
    const { className } = this.props
    const { index } = this.state
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({this.getXY(index).x}, {this.getXY(index).y})</h3>
          <h3 id="steps">You moved {this.state.steps} time{this.state.steps===1 ? null : 's'}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
                {idx === index ? 'B' : null} 
              </div> //index was 4
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button onClick={this.move} id="left">LEFT</button>
          <button onClick={this.move} id="up">UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={this.move} id="down">DOWN</button>
          <button onClick={this.reset} id="reset">reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onChange} value={this.state.email} id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}



