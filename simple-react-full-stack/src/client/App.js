import React, { Component } from 'react';
import './app.css';
import NavBar from './components/NavBar';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CustomizedSwitches from './components/CustomizedSwitches';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import purple from '@material-ui/core/colors/purple';
const NUM_STEPS = 32; // DO NOT CHANGE.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#43a047',
    },
    secondary: {
      main: '#9575cd',
    },  
  },
   root: {
        flexGrow: 1,
      }
});

let resultVAE;

export default class App extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 16,
      success: 'false',
      fileName: null,
      chordsEnabled: true,
      inceptionizedSequence: null,
      keys: ['Random','C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'],
      currentKey: 'Random',
      modesChords: ['Random','Major','Minor'],
      modesMelodic: ['Random','Aeolian','Altered','Augmented','Augmented Heptatonic','Balinese','Bebop',
               'Bebop Dominant','Bebop Locrian','Bebop Major','Bebop Minor','Chromatic','Composite Blues','Diminished','Dorian','Dorian #4','Double Harmonic Lydian','Double Harmonic Major','Egyptian','Enigmatic','Flamenco','Flat Six Pentatonic','Flat Three Pentatonic','Harmonic Major','Harmonic Minor','Hirajoshi','Hungarian Major','Hungarian Minor','Ichikosucho','In-sen','Ionian Augmented','Ionian Pentatonic','Iwato','Kafi Raga','Kumoijoshi','Leading Whole Tone','Locrian','Locrian #2','Locrian Major','Locrian Pentatonic','Lydian','Lydian #5p Pentatonic','Lydian #9','Lydian Augmented','Lydian Diminished','Lydian Dominant','Lydian Dominant Pentatonic','Lydian Minor','Lydian Pentatonic','Major','Major Blues','Major Flat Two Pentatonic','Major Pentatonic','Malkos Raga','Melodic Minor','Melodic Minor Fifth Mode','Melodic Minor Second Mode','Minor #7m Pentatonic','Minor Bebop','Minor Blues','Minor Hexatonic','Minor Pentatonic','Minor Six Diminished','Minor Six Pentatonic','Mixolydian','Mixolydian Pentatonic','Mystery #1','Neopolitan','Neopolitan Major','Neopolitan Major Pentatonic','Neopolitan Minor','Oriental','Pelog','Persian','Phrygian','Piongio','Prometheus','Prometheus Neopolitan','Purvi Raga','Ritusen','Romanian Minor','Scriabin','Six Tone Symmetric','Spanish','Spanish Heptatonic','Super Locrian Pentatonic','Todi Raga','Vietnamese 1','Vietnamese 2','Whole Tone','Whole Tone Pentatonic'],
      currentModes: ['Random','Major','Minor'],
      currentMode: 'Random',
      chordProgs: ["Random",
              "I,IV,V", 
              "I,vi,IV,V", 
              "ii,V,I", 
              "I,vi,ii,V", 
              "I,V,vi,IV", 
              "I,IV,vi,V",
              "I,IV,V,ii",
              "IV,ii,V,I",
              "IV,I7,ii7"],
      currentProg: "Random",
      currentProgs: ["Random",
                     "I,IV,V", 
                     "I,vi,IV,V", 
                     "ii,V,I", 
                     "I,vi,ii,V", 
                     "I,V,vi,IV", 
                     "I,IV,vi,V",
                     "I,IV,V,ii",
                     "IV,ii,V,I",
                     "IV,I7,ii7"],
      divs:["Random","1n","2n","4n","8n","16n"],
      currentDiv: 'Random',
      noteSequences: 
          ["Random",
           "Numbers", 
           "Doubles", 
           "No Threes", 
           "All Threes", 
           "Fibonacci", 
           "Fibonacci 2",
           "Fibonacci 3",
           "Fibonacci 4",
           "Fibonacci 5",
           "Magic Square 9-1",
           "Magic Square 9-2",
           "Magic Squares 16-1",
           "Magic Squares 25-1",
           "Magic Squares 36-1",
           "Golden Ratio",
           "Golden Ratio 2"],
      steps: Array(16).fill('-')
    };
    this.patternLength = this.patternLength.bind(this);
    this.toggleChords = this.toggleChords.bind(this);
  }


    
  midiGen(settings) {
      
    let notes = this.state.keys;
    let pattern = settings[0].join("");  
    let key = this.state.keys.indexOf(settings[1]);
    let mode = settings[2];
    let prog = settings[3];
    let div = settings[4];
    let chords = settings[5];
    let inceptionize;
      
    if (settings[6]) {
        inceptionize = settings[6]; 
    }
      
    
    
   //fetch('/api/midiGen?pattern='+pattern+'&key='+key+'&mode='+mode+'&prog='+prog+'&div='+div+'&chords='+chords)
  fetch('/api/midiGen', {
    method: 'POST',
    body: JSON.stringify({
        pattern: pattern,
        key: key,
        mode: mode,
        prog: prog,
        div: div,
        chords: chords,
        inceptionize: inceptionize
      }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((success, req) => success.json())
    .then((success, req) => {
        
        if(success){

           this.setState({
               fileName: success.success[0].response.fileName,
               message: success.success[0].response.message
           })
           if(!settings[6]) {
               this.generateMusic(success.success[0].response.melody1);
           }
           
        }
    })
    .catch((error) => {
      this.setState({message: error.message+' Please try again.'});
    }); 
     
  }
    
generateMusic = (scale) => {
        
        // go to https://goo.gl/magenta/musicvae-checkpoints to see more checkpoint urls
        // let melodiesModelCheckPoint = 'https://storage.googleapis.com/download.magenta.tensorflow.org/models/music_vae/dljs/mel_big';
        let melodiesModelCheckPoint = 'https://storage.googleapis.com/download.magenta.tensorflow.org/models/music_vae/dljs/mel_small';
        let interpolatedNoteSequences;
        let numInterpolations = 5;
       
        var everyNote = 'c,c#,d,d#,e,f,f#,g,g#,a,a#,b,'.repeat(20).split(',').map( function(x,i) {
            return x + '' + Math.floor(i/12);
        });
        
        let melodies = [[],[]];
        scale.map((note, i) => {
          melodies[0].push({pitch: toMidi(note), quantizedStartStep: i, quantizedEndStep: i+1});
        });
        
        let MELODY1 = { notes: melodies[0] };
        
       
        scale.reverse().map((note, i) => {
          melodies[1].push({pitch: toMidi(note), quantizedStartStep: i, quantizedEndStep: i+1});
        });
        
        let MELODY2 = { notes: melodies[1] };
        
       
        
        
        console.log(MELODY1);
        console.log(MELODY2);
    
        
        new musicvae.MusicVAE(melodiesModelCheckPoint)
        .initialize()
        .then((musicVAE) => {
            return musicVAE.interpolate([MELODY1,MELODY2], numInterpolations);
        })
        .then((noteSequences) => { 
            
            let notesArray = [];
            
            noteSequences.map((seq, i) => {
                seq.notes.forEach(function(note) {
                  notesArray.push(toNote(note.pitch));
                }); 
            });
            
            this.setState({inceptionizedSequence: notesArray});
                console.log(notesArray, 'generator');
        });
       
        
        function valueLengthLoop(value,array) {
          var newValue = value;
          while (newValue > array.length-1) {
            newValue += - array.length;
          }
          return newValue
        }
       
        function toMidi(note) {
            
            console.log(note,'<==in');
           let newnote;
           let flatDetector = note.slice(0,2);
            
            
           switch(flatDetector) {
               case 'db': 
                newnote = note.replace(/db/gi, 'c#');
                break;
               case 'eb': 
                newnote = note.replace(/eb/gi, 'd#');
            
                break;
               case 'fb': 
                newnote = note.replace(/fb/gi, 'e#');
            
                break;
               case 'gb':
                newnote = note.replace(/gb/gi, 'f#');
            
                break;
               case 'ab': 
                newnote = note.replace(/ab/gi, 'g#');
            
                break;
               case 'bb': 
                newnote = note.replace(/bb/gi, 'a#');
            
                break;
               case 'cb': 
                newnote = note.replace(/cb/gi, 'b#');
            
                break;
               case 'b#': 
                newnote = note.replace(/b#/gi, 'c');
            
                break;
           }
            if(newnote != undefined) {
                note = newnote;
            }
            console.log(note,'out==>',everyNote.indexOf(note));
            return everyNote.indexOf(note);
        }
        
        function toNote(midi) {
            return everyNote[midi];
        }

    }
    
    
patternLength(e) { 
    this.setState({stepNumber: e.target.value});
    this.setState({steps: Array(Number(e.target.value)).fill('-')});

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
    
toggleChords(e) {
    
    if (this.state.chordsEnabled==true) {
       
        this.setState({currentModes:this.state.modesMelodic,
                       currentProgs:this.state.noteSequences,
                       currentProg: "Random"
                
                       });
    } else {
        this.setState({currentModes:this.state.modesChords,
                       currentProgs:this.state.chordProgs,
                       currentProg: "Random"
                      });
    }
    this.setState({chordsEnabled: !this.state.chordsEnabled});
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
    if (this.state.chordsEnabled=='true') {
        this.setState({currentProg: newProg});
    } else {
        this.setState({currentProg: newProg});
    }
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
        
        <CustomizedSwitches checked={this.state.chordsEnabled} onChange={this.toggleChords.bind(this)} />
        
            <FormControl>
             <InputLabel htmlFor="selectKey">Key:</InputLabel>
              <Select 
                onChange={this.changeKey.bind(this)}
                value={this.state.currentKey}
                inputProps={{
                  id: 'selectKey'
                }}
              >
               {this.state.keys.map((key, i) => {
                return <MenuItem key={ i } value={key}>{key}</MenuItem>;
               })}
             </Select>
             </FormControl>
        
             <FormControl>
              <InputLabel htmlFor="selectMode">Mode:</InputLabel>
            <Select 
                onChange={this.changeMode.bind(this)}
                value={this.state.currentMode}
                inputProps={{
                  id: 'selectMode'
                }}
              >
               {this.state.currentModes.map((mode, i) => {
                return <MenuItem key={ i } value={mode}>{mode}</MenuItem>;
               })}
             </Select>
             </FormControl>
            
             <FormControl>
             <InputLabel htmlFor="selectProg">Progression:</InputLabel>
              <Select 
                onChange={this.changeProg.bind(this)}
                value={this.state.currentProg}
                inputProps={{
                  id: 'selectProg'
                }}
              >
               {this.state.currentProgs.map((prog, i) => {
                   return <MenuItem key={ i } value={prog}>{prog}</MenuItem>;
                
               })}
             </Select>
            </FormControl>
             
             <FormControl>
             <InputLabel htmlFor="selectDiv"> Divisions:</InputLabel>
            <Select 
                onChange={this.changeDiv.bind(this)}
                value={this.state.currentDiv}
                inputProps={{
                  id: 'selectDiv'
                }}
              >
               {this.state.divs.map((div, i) => {
                return <MenuItem key={ i } value={div}>{div}</MenuItem>;
               })}
             </Select>
             </FormControl>
        
             
             
                 
            
            
       
            
        <div style={{ margin: "0 0 20px 5px",
            textDecoration: "none",
            cursor: "pointer"}}> 
           
           {this.state.steps.map((step, i) => {
            return <Button key={ i } onClick={this.handleStepClick.bind(this, i)} variant="contained" color="secondary">{step}</Button>;
           })}
        </div>
        
        
        
        <Button variant="contained" color="secondary" onClick={this.midiGen.bind(this, 
        [this.state.steps, 
         this.state.currentKey,
         this.state.currentMode,
         this.state.currentProg,
         this.state.currentDiv,
         this.state.chordsEnabled
        ])}>
            Generate Midi
        </Button>
           
        <Button  
        variant="contained" color="secondary" onClick={this.midiGen.bind(this, 
        [this.state.steps, 
         this.state.currentKey,
         this.state.currentMode,
         this.state.currentProg,
         this.state.currentDiv,
         this.state.chordsEnabled,
         this.state.inceptionizedSequence
        ])}>Inceptionize</Button>
        
        <Button href={this.state.fileName} 
        download={this.state.fileName}
        variant="contained" color="secondary">Download</Button>    
        
      </MuiThemeProvider>
    );
  }
}
