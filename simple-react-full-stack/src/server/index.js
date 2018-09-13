const express = require('express');
const scribble = require('scribbletune');
let router = require('express').Router();
let bodyParser = require('body-parser');



const everyNote = 'C,C#,D,D#,E,F,F#,G,G#,A,A#,B,'.repeat(20).split(',').map( function(x,i) {
    return x + '' + Math.floor(i/12);
});

const app = express();

app.use(bodyParser.json())

app.use(express.static('dist'));

app.listen(8080);

app.post('/api/midiGen', (req, res) => {
   
    let pattern = req.body.pattern;
    let key = req.body.key;
    let mode = req.body.mode;
    let div = req.body.div;
    let chords = req.body.chords;
    let numInterpolations;
    let prog = req.body.prog;
   
    if (req.body.numInterpolations) {
        numInterpolations = req.body.numInterpolations;
    }
    if (req.body.musicVAE!=undefined) {
        prog = req.body.musicVAE;
    }

    let success = midiGen(pattern,key,mode,prog,div,chords,numInterpolations);
    
    res.send({ success });
    
});


function valueLengthLoop(value,array) {
  var newValue = value;
  while (newValue > array.length-1) {
    newValue += - array.length;
  }
  alert(array[newValue]);
  return newValue
}

function toMidi(note) {
    return everyNote.indexOf(note);
}

function midiGen(pattern,key,mode,prog,div,chords,numInterpolations) {
    // start scribbletune
    let date = new Date();
    let time = date.getTime();
    let type = '';
    let modes = [];
    let scale = [];
     // random seed number
    let rootNum = Math.floor(Math.random()*9); 
    
    let notes = ['c','c#','d','eb','e','f','f#','g','ab','a','bb','b']
    let progs = ["I,IV,V", 
                 "I,vi,IV,V", 
                 "ii,V,I", 
                 "I,vi,ii,V", 
                 "I,V,vi,IV", 
                 "I,IV,vi,V",
                 "I,IV,V,ii",
                 "IV,ii,V,I",
                 "IV,I7,ii7"];
    let divs = ["1n","2n","4n","8n","16n","1/12","1/32"];
   let noteSequences = [{
          "Numbers": [
            1,2,3,
            4,5,6,
            7,8,9
          ],
          "Doubles": [
            1,2,4,
            8,7,5
          ],
          "No Threes": [
            1,2,4,
            5,7,8
          ],
          "All Threes": [
            3,6,9
          ],
          "Fibonacci": 
          [
            1,2,3,5,
            8,4,3,7,
            1,7,9,8,
            8,7,6,4,
            1,7,9,8,
            8,7,6,4,
            1,5,6,2,
            8,1,9,
            1,3,3,5,
            8,4,3,7,
            1,8,9,8,
            8,7,6,4
          ],
          "Fibonacci 2": [
            1,2,3,5,
            8,4,3,7
          ],
          "Fibonacci 3": [
            1,7,9,8,
            8,7,6,4
          ],
          "Fibonacci 4": [
            1,5,6,2,
            8,1,9
          ],
          "Fibonacci 5": [
            1,3,3,5,
            8,4,3,7
          ],
          "Fibonacci 6": [
            1,8,9,
            8,8,7,
            6,4
          ],
          "Magic Square 9-1": [
            8,1,6,
            3,5,7,
            4,9,2
          ],
          "Magic Square 9-2": [
            2,7,6,
            9,5,1,
            4,3,8
          ],
          "Magic Squares 16-1": [
            16,2,3,13,
            5,11,10,8,
            9,7,6,12,
            4,14,15,1
          ],
          "Magic Squares 25-1": [
            3,16,9,22,15, // 25
            20,8,21,14,2,
            7,25,13,1,19,
            24,12,5,18,6,
            11,4,17,10,23
          ],
          "Magic Squares 36-1": [
            36,5,3,34,2,31, // 36
            25,29,10,9,26,12,
            13,20,22,21,17,18,
            24,14,16,15,23,19,
            7,11,27,28,8,30,
            6,32,33,4,35,1
          ],
          "Golden Ratio": [
            1,8,13,1,5,13
          ],
          "Golden Ratio 2": [
            1,7,3,1,4,3,1,6,13
          ]
        }]
    
    if (numInterpolations!=undefined && pattern.indexOf('x')!=-1) {
        pattern = pattern.repeat(numInterpolations);
    } else if (pattern.indexOf('x')==-1) {
        pattern = genPattern(rootNum,pattern);
    } else {
        // pattern is set
    }
    
    if (key == 0) {
        // random key
        notes.sort(function(a, b){return 0.5 - Math.random()});
        key = notes[0];
    } else {
        key = notes[Number(key)-1];
    }
   
    if (chords == true) {
        type = 'chords';
        modes = ['minor','major'];
         if (prog == 'Random') {
             
            // random progression
           progs.sort(function(a, b){return 0.5 - Math.random()});
           prog = progs[0];
        } else {
            // progression is set
        }
        if (mode == 'Random') {
            // random scale
            modes.sort(function(a, b){return 0.5 - Math.random()});
            scale = scribble.progression(key+' '+modes[0], prog);
            mode = modes[0];
        } else {
            // mode is set
            scale = scribble.progression(key+' '+mode.toLowerCase(), prog)
        }
    } else {
        type = 'melody';
        modes = scribble.modes();
        let melodicSequence = [];
        let progs = noteSequences[0];
        let progKey = Object.keys(progs).sort(function(a, b){return 0.5 - Math.random()})[0]
        
        if (mode=="Random") {
            modes.sort(function(a, b){return 0.5 - Math.random()});
            scale = scribble.scale(key+'4 '+modes[0]).slice(0);
            mode = modes[0];
        } else {
            scale = scribble.scale(key+'4 '+mode.toLowerCase()).slice(0) 
        }
        
        if (prog == 'Random') {
           // random progression
           
           prog = progs[progKey];
           
           prog.map((x) => melodicSequence.push(scale[valueLengthLoop(x,scale)].toLowerCase()));
           scale = melodicSequence;
           
        } else if (Array.isArray(prog)) {
            
            scale = prog;
           // deep dreamed pattern, no need to select from array
           
        } else {
           
           // progression is set
           prog = progs[prog];
            
           prog.map((x) => melodicSequence.push(scale[valueLengthLoop(x,scale)].toLowerCase()));
           scale = melodicSequence;
           
        }
    
    }
    
    
    if (div == 'Random') {
        // random progression
       divs.sort(function(a, b){return 0.5 - Math.random()});
       div = divs[0];
    } else {
        // progression is set
        
    }
   
    genClip(4)
    
    function genClip() {
        let clip = scribble.clip({
            notes: scale,
            pattern: pattern,
            subdiv: div
        });
        
        // convert # to sharp for filename
        var regex = /#/gi;
        key = key.replace(regex, '-sharp');
        
        scribble.midi(clip, "scribbletune-"+key+"-"+mode+"-"+time+".mid"); 
    }

    


    function isOdd(num) { return num % 2;}


    function genPattern(rootNum,pattern) {


        let patternArray = ['x','-','_'];
        let patternArray2 = pattern.split('');
        let presets = ['x--x--x-x--x--x-','x-x-x-x-x-x-x-x-',
                       'xxxxxxxxxxxxxxxx','-xxx-xxx-xxx-xxx',
                       '--x---x---x---x-','--xx-xxx--xx-xxx',
                       '--xx-xxx--xx-xxx','--xx--xx--xx--xx',
                       'x-xxx-xxx-xxx-xx','x_x_xxx-x_x_xxxx',
                       'x__xx-xxx__xx-xx','x_x_xxx-x_x_xxxx',
                       '-x--x--x-x--x--x','-x_x-x_x-x__x__x'];
        let sequence = '';
        
        
        if (!isOdd(rootNum)) {
             patternArray2.forEach(function(val, i){
                patternArray.sort(function(a, b){return 0.5 - Math.random()});
                sequence += patternArray[0];
            })
        } else {
            presets.sort(function(a, b){return 0.5 - Math.random()})
            sequence = presets[0];
        }
        
        return sequence;
    } 
    
    function valueLengthLoop(value,array) {
      var newValue = value;
      while (newValue > array.length-1) {
        newValue += - array.length;
      }
      return newValue
    }
    
    let success = [
        {
          "response": {
            "fileName": "scribbletune-"+key+"-"+mode+"-"+time+".mid",
            message: type+' in '+key+' '+mode+' generated with a '+prog+' progression of '+scale+'!',
            melody1: scale,
            pattern1: pattern
          }
        }
    ];
    
    
    return success;
}
