import React, { Component } from 'react';
import './app.css';


export default class App extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      success: 'false'
    };
    console.log(this);
    
  }

  componentDidMount() {
    fetch('/api/getUsername')
    .then(res => res.json())
    .then(user => this.setState({ username: user.username }));
  }
    
  midiGen(test) {
      
    fetch('/api/midiGen', this)
    .then(res => res.json())
    .then(res => {
        console.log(this)
        if(res){
           this.setState({success: res.success})
        }
    }); 
     
  }
    

  render() {
    const { username } = this.state;
    return (
      <div>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        <button onClick={this.midiGen.bind(this)}>Generate Midi</button>
        
        <div>test {this.state.success}</div>
      </div>
    );
  }
}
