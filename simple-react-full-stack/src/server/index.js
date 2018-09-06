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
    
    let success = midiGen(pattern,key,mode,prog,div);
    res.send({ success });
});

function midiGen(pattern,key,mode,prog,div) {
    // start scribbletune
    let date = new Date();
    let time = date.getTime();
    //let modes = scribble.modes();
    let modes = ['minor','major'];
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

    // random seed number
    let rootNum = Math.floor(Math.random()*9);
    
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
    
    if (mode == 'Random') {
        // random scale
        modes.sort(function(a, b){return 0.5 - Math.random()});
        mode = modes[0];
    } else {
        // mode is set
        mode = mode.toLowerCase();
    }
    
    if (prog == 'Random') {
        // random progression
       progs.sort(function(a, b){return 0.5 - Math.random()});
       prog = progs[0];
    } else {
        // progression is set
    }
    
    if (div == 'Random') {
        // random progression
       divs.sort(function(a, b){return 0.5 - Math.random()});
       div = divs[0];
    } else {
        // progression is set
        
    }
    console.log(div);
    genClip(4)

    function genClip(rootNum) {
        
        let clip = scribble.clip({
            notes: scribble.progression(key+' '+mode, prog),
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
    
    let success = [
        {
          "response": {
            "fileName": "scribbletune-"+key+"-"+mode+"-"+time+".mid",
            message: 'chords in '+key+' '+mode+' generated with a seed of '+rootNum+'!',
            notes, 
            modes, 
            rootNum
          }
        }
    ];
    
    
    return success;
}
