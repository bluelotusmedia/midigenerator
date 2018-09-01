import React, { Component } from 'react';
import './app.css';
import * as mm from '@magenta/music';

// Instantiate model by loading desired config.
  const model = new mm.MusicVAE( 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
  const player = new mm.Player();

  function playTune() {
    mm.Player.tone.context.resume();  // enable audio
    model.sample(1)
      .then((samples) => player.start(samples[0], 100));
  }

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
        <button onClick={playTune}><h1>Play Trio</h1></button>
        
        <div>test {this.state.success}</div>
      </div>
    );
  }
}
