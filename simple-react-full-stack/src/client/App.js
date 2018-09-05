import React, { Component } from 'react';
import './app.css';
import * as mm from '@magenta/music';
import Button from '@material-ui/core/Button';
import NavBar from './components/NavBar';
import DownloadLink from "react-download-link";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#43a047',
    },
    secondary: {
      main: '#9575cd',
    },
  },
});

// sequencer settings
const stepNum = 16;


export default class App extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      success: 'false',
      fileName: null,
      steps: Array(stepNum).fill('-')
    };
    
  }
    
  midiGen(settings) {
    
    const patternString = settings.join("");
      
    fetch('/api/midiGen?settings='+patternString)
    .then((success, req) => success.json())
    .then((success, req) => {
        
        if(success){

           this.setState({
               fileName: success.success[0].response.fileName,
               message: success.success[0].response.message
           })

        }
    })
    .catch(function(error) {
      console.log(error)
    }); 
     
  }
    
   
handleStepClick(i) {
     
    let steps = this.state.steps.slice(0);
    if (steps[i] == '-') {
        steps[i] = 'x'
    } else {
        steps[i] = '-'
    };
    this.setState({steps: steps})
}

  render() {
    const { username } = this.state;
   
    return (
      <MuiThemeProvider theme={theme}>
        <NavBar />
    
        <p>{this.state.message}</p>
        
        <div style={{ margin: "0 0 20px 5px",
            textDecoration: "none",
            cursor: "pointer"}}>
           {this.state.steps.map((step, i) => {
            return <button key={ i } onClick={this.handleStepClick.bind(this, i)}>{step}</button>;
           })}
        </div>
        
        <Button variant="contained" color="secondary" onClick={this.midiGen.bind(this, this.state.steps)}>
            Generate Midi
        </Button>
        
        <Button href={this.state.fileName} 
        download={this.state.fileName}
        variant="contained" color="secondary">Download</Button>    
        
      </MuiThemeProvider>
    );
  }
}
