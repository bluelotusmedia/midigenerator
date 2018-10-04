import React, { Component } from 'react';
import './app.css';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './components/Sketch';
import Button from '@material-ui/core/Button';
import NavBar from './components/NavBar';
import Sequencer from './components/Sequencer';
import StyledButton from './components/StyledButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
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
const NUM_STEPS = 32; // DO NOT CHANGE.
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Roboto',
    fontSize: '5rem'
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#43a047',
      contrastText: '#fff',
    },
    secondary: {
      main: '#9575cd',
    }, 
    textPrimary: {
       main: '#ffffff',
    }
  },
   root: {
        flexGrow: 1,
      }
});
const everyNote = 'c,c#,d,d#,e,f,f#,g,g#,a,a#,b,'.repeat(20).split(',').map( function(x,i) {
    return x + '' + Math.floor(i/12);
});

let resultVAE;

export default class App extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      stepNumber: 16,
      success: 'false',
      initMelody: null,
      fileName: null,
      chordsEnabled: true,
      deepdreamedSequence: null,
      numInterpolations: 4,
      steps: Array(16).fill('-'),
      stepClasses: Array(16).fill('noteoff'),
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
      divs:["Random","1n","2n","4n","8n","16n","1/12","1/32"],
      currentDiv: '16n',
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
           "Lucas 1",
           "Magic Square 9-1",
           "Magic Square 9-2",
           "Magic Squares 16-1",
           "Magic Squares 25-1",
           "Magic Squares 36-1",
           "Golden Ratio",
           "Golden Ratio 2"]
    };
    this.patternLength = this.patternLength.bind(this);
    this.numInterpolations = this.numInterpolations.bind(this);
    this.toggleChords = this.toggleChords.bind(this);
  }


    
  midiGen(settings) {    
    // initial pattern  
    let notes = this.state.keys;
    let pattern = settings[0].join("");
    let key = this.state.keys.indexOf(settings[1]);
    let mode = settings[2];
    let prog = settings[3];
    let div = settings[4];
    let chords = settings[5];
      
    // deep dream  
    let initMelody;
    let interpolations;
    let musicVAENotes;
    let musicVAERhythm;
     
    if (settings[6]) {
        initMelody = settings[6]; 
    }
    if (settings[7]) {
        interpolations = settings[7]; 
    }
    if (settings[8]) {
        musicVAENotes = settings[8]; 
    }
    if (settings[9]) {
        musicVAERhythm = settings[9]; 
    }
      
  fetch('/api/midiGen', {
    method: 'POST',
    body: JSON.stringify({
        pattern: pattern,
        key: key,
        mode: mode,
        prog: prog,
        div: div,
        chords: chords,
        initMelody: initMelody,
        numInterpolations: interpolations,
        musicVAENotes: musicVAENotes,
        musicVAERhythm: musicVAERhythm
      }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((success, req) => success.json())
    .then((success, req) => {
        
        if(success){
            let steps = success.success[0].response.pattern1.split('');
            let stepClasses = this.state.stepClasses.slice(0)
            steps.forEach(function(step,i) {
                switch(step) {
                    case 'x': stepClasses[i] = 'noteon';
                    break;
                    case '-': stepClasses[i] = 'noteoff';
                    break;
                    case '_': stepClasses[i] = 'sustain';
                    break;  
                }      
            });
           this.setState({
               fileName: success.success[0].response.fileName,
               message: success.success[0].response.message,
               steps: success.success[0].response.pattern1.split(''),
               stepClasses: stepClasses,
               initMelody: success.success[0].response.melody1
           })
           
        }
    })
    .catch((error) => {
      this.setState({message: error.message+' Please try again.'});
    }); 
     
  }
    
valueLengthLoop(value,array) {
  var newValue = value;
  while (newValue > array.length-1) {
    newValue += - array.length;
  }
  return newValue
}
    
toNote(midi) {
    return everyNote[midi];
}
    
scribbletuneToMusicVAE(initRhythm,initMelody){
    
    // scribbletune to musicVAE
    let notes = [];
    let noteCount = 0;
    
    initRhythm.map((val, i) => {
       
      switch(val) {
        case 'x':
          let thisNote = initMelody[this.valueLengthLoop(noteCount,initMelody)];
          notes[i] = {pitch: this.toMidi(thisNote), quantizedStartStep: i*2, quantizedEndStep: (i+1)*2};
          noteCount++
          break;
        case '-':
          i--;
          break;
        case '_':
         if (initRhythm[i-1] == 'x' && initRhythm[i+1] != '_') {
           notes[i-1].quantizedEndStep += 2;
         } else if (initRhythm[i-1] == '_' && initRhythm[i+1] != '_') {
           let underscoreCounter = 0
           for (let j=0; initRhythm[i-j] == '_'; j++) {
           underscoreCounter ++;

             if (initRhythm[(i-j)-1] == 'x') {
               notes[(i-j)-1].quantizedEndStep += (underscoreCounter * 2);
             }

           }
         }
      } // close switch

    });
    
    return notes;
}
    
deepDreamMelody = (settings) => {
        if (!settings[6]) { this.setState({message: 'Must generate midi first.'}) } else {
            
            this.setState({message: 'Dreaming... This could take a minute.'})
            
            let initMelody = settings[6]; // initMelody
            let initRhythm = settings[0];
            let reversedMelody = initMelody.slice(0).reverse();
            let reversedRhythm = initRhythm.slice(0).reverse();
            
            // go to https://goo.gl/magenta/musicvae-checkpoints to see more checkpoint urls
            //let melodiesModelCheckPoint = 'https://storage.googleapis.com/download.magenta.tensorflow.org/models/music_vae/dljs/mel_big';
            let melodiesModelCheckPoint = 'https://storage.googleapis.com/download.magenta.tensorflow.org/models/music_vae/dljs/mel_small';
            let interpolatedNoteSequences;
            let numInterpolations = settings[7];
            
            let notes1 = this.scribbletuneToMusicVAE(initRhythm,initMelody);
            let notes2 = this.scribbletuneToMusicVAE(reversedRhythm,reversedMelody);
            
            let MELODY1 = { notes: notes1 };
            let MELODY2 = { notes: notes2 };




            console.log(MELODY1);
            console.log(MELODY2);


            new musicvae.MusicVAE(melodiesModelCheckPoint)
            .initialize()
            .then((musicVAE) => {
                console.log(numInterpolations)
                return musicVAE.interpolate([MELODY1,MELODY2], numInterpolations);
            })
            .then((noteSequences) => { 

                let notesArray = [];
                
                // build notes array
                noteSequences.map((seq, i) => {
                    seq.notes.forEach((note) => {
                      notesArray.push(this.toNote(note.pitch));
                    }); 
                });

                settings.push(notesArray);
                
                let rhythmString = "";
                let noteGrid = Array(32).fill(null);
                let possibleNotes = Array(16).fill('-');
                
                
                noteSequences.forEach(function(noteSeq){
                    noteSeq.notes.forEach(function(note) {
                      possibleNotes[note.quantizedStartStep/2] = 'x';
                      if (Number(note.quantizedEndStep) > Number(note.quantizedStartStep)+2) {
                        let sustainCount = 0;
                        for (let k=Number(note.quantizedEndStep); k>Number(note.quantizedStartStep)+2; k-=2) {
                          sustainCount++;  
                          possibleNotes[(Number(note.quantizedStartStep)/2+sustainCount)] = "_";   
                        } 
                      }  
                    });
                
                    rhythmString += possibleNotes.join('')
                })

                
                settings.push(rhythmString);    
                    
                {this.midiGen(settings)}
            });

        }

    }
   


toMidi(note) {

   let newnote;
   let flatDetector = note.slice(0,2);


   switch(flatDetector) {
       case 'db': 
        newnote = note.replace(/db/gi, 'c#');
        break;
       case 'eb': 
        newnote = note.replace(/eb/gi, 'd#');

        break;
       case 'e#': 
        newnote = note.replace(/e#/gi, 'f');

        break;
       case 'fb': 
        newnote = note.replace(/fb/gi, 'e');

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
        newnote = note.replace(/cb/gi, 'b');

        break;
       case 'b#': 
        newnote = note.replace(/b#/gi, 'c');

        break;
   }
    if(newnote != undefined) {
        note = newnote;
    }

    return everyNote.indexOf(note);
}
    
patternLength(e) { 
    this.setState({
      stepNumber: e.target.value,
      steps: Array(Number(e.target.value)).fill('-'),
      stepClasses: Array(Number(e.target.value)).fill('noteoff')
    });
}
  
numInterpolations(e) { 
    this.setState({numInterpolations: e.target.value});
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
    
handleStepClick(i) {
     
    let steps = this.state.steps.slice(0);
    let stepClasses = this.state.stepClasses.slice(0);
    
    if (steps[i] == '-') {
        stepClasses[i] = 'noteon';
        steps[i] = 'x';
    } else if (steps[i] == 'x') {
        stepClasses[i] = 'sustain';
        steps[i] = '_';
    } else {
        stepClasses[i] = 'noteoff';
        steps[i] = '-';
    };
    
    this.setState({steps: steps, stepClasses: stepClasses})
}

  render() {
   
    return (
      <MuiThemeProvider theme={theme}>
        <NavBar />
        
        <p>{this.state.message}</p>
        
        <P5Wrapper sketch={sketch} />
        
       
        <InputLabel>Steps: </InputLabel>
        <input onKeyUp={this.patternLength.bind(this)} defaultValue={this.state.stepNumber} size={2} />
        
        <InputLabel> Interpolations: </InputLabel>
        <input onKeyUp={this.numInterpolations.bind(this)} defaultValue={this.state.numInterpolations} size={2} />
        
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
        
          
        <Sequencer 
             steps={this.state.steps} 
             stepClasses={this.state.stepClasses} 
             onClick={this.handleStepClick.bind(this)}
             className="sequencer"
        />
            
         
        
        
        <StyledButton onClick={this.midiGen.bind(this, 
        [this.state.steps, 
         this.state.currentKey,
         this.state.currentMode,
         this.state.currentProg,
         this.state.currentDiv,
         this.state.chordsEnabled
        ])}>Generate Midi</StyledButton>
        
       
      
           
          {this.state.chordsEnabled != true &&
              
                <StyledButton onClick={this.deepDreamMelody.bind(this, 
                    [this.state.steps, 
                     this.state.currentKey,
                     this.state.currentMode,
                     this.state.currentProg,
                     this.state.currentDiv,
                     this.state.chordsEnabled,
                     this.state.initMelody,
                     this.state.numInterpolations
                    ])}>Deep Dream
                </StyledButton>
     
          }
            
                <StyledButton href={this.state.fileName} download={this.state.fileName}>
                    Download
                </StyledButton>
                       
        
      </MuiThemeProvider>
    );
  }
}
