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
    let modes = scribble.modes();
    modes.forEach(function(element) {
      //console.log(scribble.scale('D4 '+element).slice(0));
    });
    //console.log(scribble.modes(), scribble.scale('D4 vietnamese 2').slice(0));
    //let modes = ['minor','major'];
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
    let numbers = [1,2,3,4,5,6,7,8,9];
    let doubles = [1,2,4,8,7,5]; // 16=1+6=7 32=3+2=5
    let no3s = [1,2,4,5,7,8];
    let all3s = [3,6,9];
    let fibonacci = [1,2,3,
                     5,8,13,
                     21,34,55,
                     89,144,233,
                     377,610,987,
                     1597,2584,4181,
                     6765,10946,17711,
                     28657,46368,75025,
                     121393,196418,317811,
                     514229,832040,1346269,
                     2178309,3524578,5702887,
                     9227465,14930352,24157817,
                     39088169,63245986,102334155,
                     165580141,267914296,433494437,
                     701408733,1134903170,1836311903,
                     2971215073,4807526976,7778742049,
                     20365011074,32951280099,53316291173,
                     86267571272,139583862445,225851433717,
                     365435296162,591286729879,956722026041,
                     1548008755920,2504730781961,4052739537881,
                     6557470319842,10610209857723,17167680177565,
                     27777890035288,44945570212853,72723460248141,
                     117669030460994,190392490709135,308061521170129,
                     498454011879264,806515533049393,1304969500000000];

   let fibonacci2 = [{
                     [1,2,3,5,8,4,3,7],
                     [1,7,9,8,8,7,6,4],
                     [1,5,6,2,8,1,9],
                     [1,3,3,5,8,4,3,7],
                     [1,8,9,8,8,7,6,4]
                     }];
    
   let magicSquares = [{
                       [8,1,6 // 9
                       3,5,7,
                       4,9,2],
                       [2,7,6 // 9
                       9,5,1,
                       4,3,8],
                       [16,2,3,13, // 16
                        5,11,10,8,
                        9,7,6,12,
                        4,14,15,1],
                       [3,16,9,22,15, // 25
                       20,8,21,14,2,
                       7,25,13,1,19,
                       24,12,5,18,6,
                       11,4,17,10,23],
                       [36,5,3,34,2,31, // 36
                        25,29,10,9,26,12,
                        13,20,22,21,17,18
                        24,14,16,15,23,19,
                        7,11,27,28,8,30,
                        6,32,33,4,35,1]
       
                      }]
    
    mode.forEach
    
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
