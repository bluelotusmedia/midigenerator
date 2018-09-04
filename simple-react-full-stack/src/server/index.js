const express = require('express');
const scribble = require('scribbletune');

const app = express();

app.use(express.static('dist'));

app.listen(8080);

app.get('/api/midiGen', (req, res) => {
    let pattern = req.query.settings;
    let success = midiGen(pattern);
    res.send({ success });
});

function midiGen(pattern) {
    // start scribbletune
    var date = new Date();
    var time = date.getTime();
    var modes = scribble.modes();
    var notes = ["c", "d", "e", "f", "g", "a", "b"]

    // random seed number
    let rootNum = Math.floor(Math.random()*9);

    // random scale
    modes.sort(function(a, b){return 0.5 - Math.random()});

    // random notes
    notes.sort(function(a, b){return 0.5 - Math.random()});

    genClip(4)

    function genClip(rootNum) {
        let modes = ['minor','major'];
        let clip = scribble.clip({
            notes: scribble.progression(notes[0]+' '+modes[0], chooseProgression(rootNum)),
            pattern: pattern,
            subdiv: '3n'
        });

        scribble.midi(clip, "scribbletune-"+notes[0]+"-"+modes[0]+"-"+time+".mid"); 
    }

    function chooseProgression(rootNum) {

        let commonProgressions = ["I, IV, V", 
                                  "I, vi, IV, V", 
                                  "ii, V, I", 
                                  "I, vi, ii, V", 
                                  "I, V, vi, IV", 
                                  "I, IV, vi, V",
                                  "I, IV, V, ii",
                                  "IV, ii, V, I",
                                  "IV, I7, ii7"];

        let maxlen = commonProgressions.length; 

        commonProgressions.sort(function(a, b){return 0.5 - Math.random()});

        return commonProgressions[0];
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
            "fileName": "scribbletune-"+notes[0]+"-"+modes[0]+"-"+time+".mid",
            message: 'chords in '+notes[0]+' '+modes[0]+' generated with a seed of '+rootNum+'!',
            notes, 
            modes, 
            rootNum
          }
        }
    ];
    
    
    return success;
}
