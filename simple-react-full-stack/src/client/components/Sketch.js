export default function sketch(p) {
    let radius = 400;
    let angle = 135;
    let rotation = 40;
    let inc = 0.1;
    let h = 90;
    let s = 100;
    let b = 100;
    let a = 25;
    let generatedProg = [];
    
    p.setup = function () {
        p.createCanvas(1140, 425);
        p.background(0);
        p.angleMode(p.DEGREES);
        p.colorMode(p.HSB, 100);
    };
    
    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.generatedProg){
          generatedProg = props.generatedProg;
        }
        console.log(generatedProg)
    };

    p.draw = function () {
        let x = radius * p.cos(angle);
        let y = radius * p.sin(angle);
        let xArray = [];
        let yArray = [];

        p.translate(p.width / 2, p.height / 2);
        p.fill(h,s,50,a)
        p.stroke(h,s,100,100);
        p.rotate(angle);
        p.ellipse(0, 0, radius, radius);

        for (let i = 0; i <= 360 / rotation; i++) {
            
            xArray.push(x);
            yArray.push(y);
            p.line(
                xArray[generatedProg[i * 1 % generatedProg.length]] / 2, 
                yArray[generatedProg[i * 1 % generatedProg.length]] / 2, 
                xArray[i] / 2, 
                yArray[i] / 2);
            angle += rotation;
            x = radius * p.cos(angle);
            y = radius * p.sin(angle);

        }
        angle = p.round(angle % 360);
        h = (h + inc) % 100; 
        console.log(h)
       
    };
};