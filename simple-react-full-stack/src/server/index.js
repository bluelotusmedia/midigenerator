const express = require('express');
const scribble = require('scribbletune');

const app = express();

app.use(express.static('dist'));

app.listen(8080);

app.get('/api/midiGen', (req, res) => {
    let pattern = req.query.pattern;
    let key = req.query.key;
    let mode = req.query.mode;
    let prog = req.query.prog;
    let div = req.query.div;
    let chords = req.query.chords;
    let success = midiGen(pattern,key,mode,prog,div,chords);
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

function midiGen(pattern,key,mode,prog,div,chords) {
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
    let divs = ["1n","2n","4n","8n","16n"];
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
    
    if (pattern.indexOf('x')==-1) {
        pattern = genPattern(rootNum);
    } else {
        // pattern is defined
    }
    
    if (key == 0) {
        // random key
        notes.sort(function(a, b){return 0.5 - Math.random()});
        key = notes[0];
    } else {
        key = notes[Number(key)-1];
    }
    
    if (chords == 'true') {
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
        
        if (mode=="Random") {
            modes.sort(function(a, b){return 0.5 - Math.random()});
            scale = scribble.scale(key+'4 '+modes[0]).slice(0);
            mode = modes[0];
        } else {
            scale = scribble.scale(key+'4 '+mode.toLowerCase()).slice(0) 
        }
       
        if (prog == 'Random') {
           // random progression
           
           let progKey = Object.keys(progs).sort(function(a, b){return 0.5 - Math.random()})[0]
           let prog = progs[progKey];
           
           prog.map((x) => melodicSequence.push(scale[valueLengthLoop(x,scale)].toLowerCase()));
           scale = melodicSequence;
           
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
        console.log(scale);
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


    function genPattern(rootNum) {


        let patternArray = ['x_','x-','xx','-x','-_','--','__','_-','_x'];
        let patternArray2 = ['x--x--x-x--x--x-'];
        let sequence = '';

        if (!isOdd(rootNum)) {
             patternArray.forEach(function(val, i){

                patternArray.sort(function(a, b){return 0.5 - Math.random()});
                sequence += patternArray[i];

            })
        } else {
            sequence = patternArray2[0];
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
            message: type+' in '+key+' '+mode+' generated with a seed of '+rootNum+'!',
            notes, 
            modes, 
            rootNum
          }
        }
    ];
    
    
    return success;
}
