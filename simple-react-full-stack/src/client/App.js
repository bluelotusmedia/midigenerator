import React, { Component } from 'react';
import './app.css';
import Button from '@material-ui/core/Button';
import NavBar from './components/NavBar';

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
//const stepNum = 16;


export default class App extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 16,
      success: 'false',
      fileName: null,
      keys: ['Random','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'],
      currentKey: 'Random',
      modes: ['Random','Major','Minor'],
      currentMode: 'Random',
      progs: ["Random",
              "I,IV,V", 
              "I,vi,IV,V", 
              "ii,V,I", 
              "I,vi,ii,V", 
              "I,V,vi,IV", 
              "I,IV,vi,V",
              "I,IV,V,ii",
              "IV,ii,V,I",
              "IV,I7,ii7"],
      currentProg: 'Random',
      divs:["Random","1n","2n","3n","4n","8n","16n"],
      currentDiv: 'Random',
      steps: Array(16).fill('-')
    };
      
    this.patternLength = this.patternLength.bind(this);
  }
    
  midiGen(settings) {
      
    let notes = this.state.keys;
    let pattern = settings[0].join("");  
    let key = this.state.keys.indexOf(settings[1]);
    let mode = settings[2];
    let prog = settings[3];
    let div = settings[4];
      
    fetch('/api/midiGen?pattern='+pattern+'&key='+key+'&mode='+mode+'&prog='+prog+'&div='+div)
    .then((success, req) => success.json())
    .then((success, req) => {
        
        if(success){

           this.setState({
               fileName: success.success[0].response.fileName,
               message: success.success[0].response.message
           })

        }
    })
    .catch((error) => {
      this.setState({message: error.message+' Please try again.'});
    }); 
     
  }
    
   
handleStepClick(i) {
     
    let steps = this.state.steps.slice(0);
    if (steps[i] == '-') {
        steps[i] = 'x'
    } else if (steps[i] == 'x') {
        steps[i] = '_'
    } else {
        steps[i] = '-'
    };
    
    this.setState({steps: steps})
}
    
patternLength(e) { 
    this.setState({stepNumber: e.target.value});
    this.setState({steps: Array(Number(e.target.value)).fill('-')});

}
    
changeKey(e) { 
    let newKey = e.target.value;
    this.setState({currentKey: newKey});
}

changeMode(e) { 
    let newMode = e.target.value;
    this.setState({currentMode: newMode});
}

changeProg(e) { 
    let newProg = e.target.value;
    this.setState({currentProg: newProg});
}

changeDiv(e) { 
    let newDiv = e.target.value;
    this.setState({currentDiv: newDiv});
}

  render() {
   
    return (
      <MuiThemeProvider theme={theme}>
        <NavBar />
    
        <p>{this.state.message}</p>
        
       Steps (clears pattern): <input onKeyUp={this.patternLength.bind(this)} defaultValue={this.state.stepNumber} size={4} />
    
        Key: <select onChange={this.changeKey.bind(this)}>
           {this.state.keys.map((key, i) => {
            return <option key={ i }>{key}</option>;
           })}
        </select>
        
        Mode: <select onChange={this.changeMode.bind(this)}>
           {this.state.modes.map((mode, i) => {
            return <option key={ i }>{mode}</option>;
           })}
        </select>
        
        Progression: <select onChange={this.changeProg.bind(this)}>
           {this.state.progs.map((prog, i) => {
            return <option key={ i }>{prog}</option>;
           })}
        </select>
        
        Divisions: <select onChange={this.changeDiv.bind(this)}>
           {this.state.divs.map((div, i) => {
            return <option key={ i }>{div}</option>;
           })}
        </select>
        
        <div style={{ margin: "0 0 20px 5px",
            textDecoration: "none",
            cursor: "pointer"}}>
           {this.state.steps.map((step, i) => {
            return <Button key={ i } onClick={this.handleStepClick.bind(this, i)} variant="contained" color="secondary">{step}</Button>;
           })}
        </div>
        
        <Button variant="contained" color="secondary" onClick={this.midiGen.bind(this, [this.state.steps, 
         this.state.currentKey,
         this.state.currentMode,
         this.state.currentProg,
         this.state.currentDiv
        ])}>
            Generate Midi
        </Button>
        
        <Button href={this.state.fileName} 
        download={this.state.fileName}
        variant="contained" color="secondary">Download</Button>    
        
      </MuiThemeProvider>
    );
  }
}
