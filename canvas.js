const canvas = document.getElementById("canvas");
const portfolio = document.querySelector(".portfolio");

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
};

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


function distance(x1,y1,x2,y2) {
    let xSpace = x2 - x1;
    let ySpace = y2 - y1;

    return Math.sqrt(Math.pow(xSpace,2) + Math.pow(ySpace,2));
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


//object blueprint
function Circle(x,y,dx,dy,radius,color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.radius = radius;
    this.gravity = 0.98 + mass(); 
    this.frictionY = 0.95 - mass();
    this.frictionX = 0.82 - mass();

    //takes size into account
    function mass() {
        if(this.radius > 0) {
            return this.radius / 100;
        } else {
            return 0;
        }
    }

    this.draw = ()=> {
        //circle
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = "black";
        c.stroke();
        c.fillStyle = `${this.color}`;
        c.fill();
    }

    this.update = ()=> {
            //sets left & right boundaries
            if(this.x + this.radius + this.dx >= screenWidth || this.x + this.dx <= this.radius) {
                this.dx = -this.dx * this.frictionX; //reduces side movement on side bounce
            }
            //sets ceiling & floor boundaries
            if(this.y + this.radius + this.dy >= screenHeight || this.y + this.dy <= this.radius) {
                this.dy = -this.dy * this.frictionY;  //reduces upward movement on floor bounce
            } else {
                this.dy += this.gravity; //gravity
            }

            if(this.y + this.radius <= this.radius * 2 - 5) {   //rapidly unstick from ceiling
                this.y += 25;
                this.dx += randomRange(-2,2);  //adds slight sideways movement 
            } else if(this.y + this.radius <= this.radius * 2) {  //unstick items from ceiling
                this.y += 1; 
            }
            if(this.y + this.radius >= screenHeight + 5) {  //rapidly bring up items from floor
                this.y -= 25; 
                this.dx += randomRange(-2,2);  //adds slight sideways movement 
            } else if(this.y + this.radius >= screenHeight) {  //prevents from sinking into floor
                this.y -= 0.05; 
            }

            if(this.x + this.radius >= screenWidth + 5) {   //rapidly unstick from right
                this.x -= 25;
                this.dx += randomRange(-2,2);  //adds slight sideways movement 
            } else if(this.x + this.radius >= screenWidth) {   //unstick items from right
                this.x -= 1; 
            }
            if(this.x + this.radius <= (this.radius * 2) - 5) {  //rapidly unstick from left
                this.x += 25;
                this.dx += randomRange(-2,2);  //adds slight sideways movement 
            } else if(this.x + this.radius <= this.radius * 2) {    //unstick items from left
                this.x += 1; 
            }

            //slowly reduces rolling speed
            if(this.dx > -10 && this.dx < 0) {
                this.dx += 0.005;
            } else if (this.dx < 10 && this.dx > 0) {
                this.dx -= 0.005;
            } 

            //slowly reduces bounce height
            if(this.dy > -10 && this.dy < 0) {
                this.dy += 0.005;
            } else if (this.dy < 10 && this.dy > 0) {
                this.dy -= 0.005;
            }
        

        //interactivity
        if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
            
            this.x += randomRange(-5,5); //random side movement
            this.y += -randomRange(1,10) * 2; //random upwards movement

            //random directional speed
            this.dx = -this.dx + randomRange(2,6) * invert[randomRange(0,1)]; 
            this.dy = -this.dy + -randomRange(2,10);
        } 

        this.x += this.dx; 
        this.y += this.dy;
        
        this.draw();
    }
}


//object creator sets individual attributes
function creator(num) {

    let circle, color, dx, dy, radius, x, y;
    
    for(let i = 0; i < num; i++) {
        
        color = colorArray[randomRange( 0, colorArray.length - 1)]; //random color picker
        dx = randomRange(1,25) * invert[randomRange(0,1)]; //random direction x-axis
        dy = randomRange(1,25) * invert[randomRange(0,1)]; //random direction y-axis
        radius = randomRange(5,65); //random circle radius
        x = randomRange(radius, screenWidth - radius); //choose location
        y = randomRange(radius, screenHeight - radius); //choose location
        
        if(i != 0) { //if count is more than one
            //on creation prevents overlapping of circles
            for(let j = 0; j < circArr.length; j++) {
                if(distance(x, y, circArr[j].x, circArr[j].y) - radius * 2 <= 0) {
                    x = randomRange(radius, screenWidth - radius); //choose another location
                    y = randomRange(radius, screenHeight - radius); //choose another location
                    j--;
                }
            }
        }
        
        circle = new Circle(x,y,dx,dy,radius,color);

        circArr.push(circle); //sends to array
    }
}


function animate() {

    requestAnimationFrame(animate); //loop
    c.clearRect(0,0,screenWidth,screenHeight); //clears screen

    //animates all array items
    circArr.forEach(obj => {
        obj.update(); //updates each object
    });
}


canvas.addEventListener("click", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    portfolio.style.visibility == "visible" ? portfolio.style.visibility = "hidden" : portfolio.style.visibility = "visible";

    setTimeout(function() {
        mouse.x = undefined;
        mouse.y = undefined;
    },100);
});


canvas.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    setTimeout(function() {
        mouse.x = undefined;
        mouse.y = undefined;
    },25);
});


//prevents infite loop when loading page on mobile
setTimeout(function() {
    window.addEventListener("resize", function() {
        
        //Only way found to avoid a canvas resize bug on mobile
        setTimeout(function() {
            screenHeight = window.innerHeight;
            screenWidth = window.innerWidth;
            canvas.height = screenHeight;
            canvas.width = screenWidth;
        },50);
    });
}, 25); 


window.onload = function() {

    creator(randomRange(10,20));
    
    animate();
};
