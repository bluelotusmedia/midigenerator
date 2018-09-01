const express = require('express');
const os = require('os');
const scribble = require('scribbletune');

const app = express();

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => midiGen());


app.get('/api/midiGen', function (req, res) {
    midiGen();
    console.log('requested');
    res.send({ success: 'success!' });
});

function midiGen() {
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
            pattern: genPattern(rootNum).repeat(4),
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
}
