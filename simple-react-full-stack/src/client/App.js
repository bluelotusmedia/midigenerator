import React, { Component } from 'react';
import './app.css';
import * as mm from '@magenta/music';
import Button from '@material-ui/core/Button';
import NavBar from './components/NavBar';
import SimpleMenu from './components/SimpleMenu';
import DownloadLink from "react-download-link";

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
      success: 'false',
      fileName: null
    };

    
  }

    
  componentDidMount() {
    fetch('/api/getUsername')
    .then(res => res.json())
    .then(user => this.setState({ username: user.username }));
  }
    
  midiGen(test) {
      
    fetch('/api/midiGen')
    .then(success => success.json())
    .then(success => {
        if(success){
           this.setState({
               fileName: success.success[0].response.fileName,
               message: success.success[0].response.message
           })
           
        }
    }); 
     
  }
    

  render() {
    const { username } = this.state;
    return (
      <div>
        <NavBar />
        <p>{this.state.message}</p>
        
        <DownloadLink filename={this.state.fileName}
        exportFile={() => "My cached data"}>
                Download Midi
        </DownloadLink>
        <Button variant="contained" color="primary" onClick={this.midiGen.bind(this)}>
            Generate Midi
        </Button>
      </div>
    );
  }
}
