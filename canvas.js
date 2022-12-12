const canvas = document.getElementById("canvas");

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
canvas.height = screenHeight;
canvas.width = screenWidth;
c = canvas.getContext("2d");

let circArr = [];
let invert = [-1,1]; //reverses directions
let mouse = {
    x: undefined,
    y: undefined
}

//141 colors. The minimum is 0, the maximum is 140
const colorArray = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", 
    "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", 
    "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkkhaki", 
    "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", 
    "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", 
    "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", 
    "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", 
    "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", 
    "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", "lightseagreen",
    "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", 
    "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", 
    "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", 
    "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", 
    "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", 
    "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", 
    "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "snow", "springgreen", "steelblue", "tan",
    "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
];


//Returns a random number within a chosen range
function randomRange(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
//Math.floor() rounds down to the nearest whole number  e.i. 10 = 0 - 9  
//Math.random() returns a random decimal between 0 - 0.99
}


/*

//rectangles
c.fillStyle = "rgba(255, 0, 0, 0.6)";
c.fillRect(150,140,100,100);
c.fillStyle = "rgba(0, 255, 0, 0.25)";
c.fillRect(250,240,100,100);
c.fillStyle = "rgba(0, 0, 255, 0.6)";
c.fillRect(350,140,100,100);

//lines
c.beginPath();
c.strokeStyle = "ivory";
c.moveTo(100,125);
c.lineTo(100,300);
c.lineTo(200,400);
c.lineTo(400,400);
c.lineTo(500,300);
c.lineTo(500,125);
c.lineTo(400,40);
c.lineTo(200,40);
c.lineTo(100,125);
c.stroke();

*/


//object
function Circle(x,y,dx,dy,radius,color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.radius = radius;

    this.draw = ()=> {
        //circles
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = `${this.color}`;
        c.stroke();
        c.fillStyle = `${this.color}`;
        c.fill();
    }

    this.update = ()=> {
        if(this.x + this.radius > screenWidth || this.x < this.radius) {
            this.dx = -this.dx;
        }
        if(this.y + this.radius > screenHeight || this.y < this.radius) {
            this.dy = -this.dy;
        }

        //interactivity
        if(mouse.x - this.x < 75 && mouse.x - this.x > -75 && mouse.y - this.y < 75 && mouse.y - this.y > -75) {
            this.dx = -this.dx * invert[randomRange(0,1)] + randomRange(-3,3);
            this.dy = -this.dy * invert[randomRange(0,1)] + randomRange(-3,3);
            this.x += randomRange(-5,5);
            this.y += randomRange(-5,5);
        } 

        if(this.dx > 9) {
            this.dx -= 0.1;
        }
        if(this.dy > 9) {
            this.dy -=0.1;
        }

        this.draw();
    
        this.x += this.dx;
        this.y += this.dy;
    }
}


//select a number to create
function creator(num) {

    let circle, color, dx, dy, radius, x, y;
    
    for(let i = 0; i < num; i++) {
        
        color = colorArray[randomRange( 0, colorArray.length - 1)]; //random color picker
        dx = randomRange(1,20) * invert[randomRange(0,1)]; //random direction x-axis
        dy = randomRange(1,20) * invert[randomRange(0,1)]; //random direction y-axis
        radius = randomRange(10,70); //random circle radius
        x = randomRange(radius, screenWidth - radius); //choose location
        y = randomRange(radius, screenHeight - radius); //choose location

        circle = new Circle(x,y,dx,dy,radius,color); //circles will have different properties

        circArr.push(circle); //sends to array
    }
}


function animate() {

    requestAnimationFrame(animate); //loop
    c.clearRect(0,0,screenWidth,screenHeight); //clears screen

    for(let i = 0; i < circArr.length; i ++) {
        circArr[i].update(); //updates frame
    }
}


canvas.addEventListener("click", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    setTimeout(function() {
        mouse.x = undefined;
        mouse.y = undefined;
    },150);
});


canvas.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    setTimeout(function() {
        mouse.x = undefined;
        mouse.y = undefined;
    },10);
});


setTimeout(function() {
    window.addEventListener("resize", function() {
     
        screenHeight =  window.innerHeight;
        screenWidth =  window.innerWidth;
        canvas.height = screenHeight;
        canvas.width = screenWidth;
    });
},50);


window.onload = function() {

    animate();

    creator(randomRange(6,10));
};
