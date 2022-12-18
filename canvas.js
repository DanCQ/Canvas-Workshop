const canvas = document.getElementById("canvas");
const portfolio = document.querySelector(".portfolio");

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
canvas.height = screenHeight;
canvas.width = screenWidth;
c = canvas.getContext("2d");

const circArr = []; //object array
const twister = []; //mouse cursor
let mouse = { //mouse location
    x: undefined,
    y: undefined
};
let user; //user interactivity
let userVx; //user velocity x
let userVy; //user velocity y

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


//checks collision distance between objects
function distance(x1,y1,x2,y2) {
    let xSpace = x2 - x1;
    let ySpace = y2 - y1;

    return Math.sqrt(Math.pow(xSpace,2) + Math.pow(ySpace,2));
}


//simulated collision physics 
function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;
    
    //measures angle & velocity before equation
    function rotate(velocity, angle) {
	    const rotatedVelocities = {
		    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
		    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
	    };
        return rotatedVelocities;
    } 
    
    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x * particle.collision;
        particle.velocity.y = vFinal1.y * particle.collision;

        otherParticle.velocity.x = vFinal2.x * otherParticle.collision;
        otherParticle.velocity.y = vFinal2.y * otherParticle.collision;
    }
}


//Returns a random number within a chosen range
function randomRange(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
//Math.floor() rounds down to the nearest whole number  e.i. 10 = 0 - 9  
//Math.random() returns a random decimal between 0 - 0.99
}


//object blueprint
function Circle(x,y,vx,vy,radius,color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: vx,
        y: vy
    };
    this.color = color;
    this.radius = radius;
    this.gravity = 0.98 + size(); 
    this.frictionY = 0.95 - size();
    this.frictionX = 0.82 - size();
    this.collision = 0.97 - size(); //I added to Resolve Collision
    this.mass = 1 + size(); //needed for Resolve collision

    //takes size into account
    function size() {
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

    this.update = circArr => {

        //accurate collision detection
        for(let k = 0; k < circArr.length; k++) {

            if(this === circArr[k]) continue;
            if(distance(this.x, this.y, circArr[k].x, circArr[k].y) - this.radius - circArr[k].radius < 0) {

                //activates if combined velocity is above threshold
                if(this.velocity.y + this.velocity.x + circArr[k].velocity.y + circArr[k].velocity.x > 1.8 || 
                this.velocity.y + this.velocity.x + circArr[k].velocity.y + circArr[k].velocity.x < -1.8) {

                    resolveCollision(this, circArr[k]);
                } 
            }
        }

        //sets left & right boundaries
        if(this.x + this.radius + this.velocity.x >= screenWidth || this.x + this.velocity.x <= this.radius) {
            this.velocity.x = -this.velocity.x * this.frictionX; //reduces side movement on side bounce
        }
        //sets ceiling & floor boundaries
        if(this.y + this.radius + this.velocity.y >= screenHeight || this.y + this.velocity.y <= this.radius) {
            this.velocity.y = -this.velocity.y * this.frictionY;  //reduces upward movement on floor bounce
        } else {
            this.velocity.y += this.gravity; //gravity
        }

        if(this.y + this.radius <= this.radius * 2 - 5) {   //rapidly unstick from ceiling
            this.y += 25;
            this.velocity.x += randomRange(-2,2);  //adds slight sideways movement 
        } else if(this.y + this.radius <= this.radius * 2) {  //unstick items from ceiling
            this.y += 1; 
        }
        if(this.y + this.radius >= screenHeight + 5) {  //rapidly bring up items from floor
            this.y -= 25; 
            this.velocity.x += randomRange(-2,2);  //adds slight sideways movement 
        } else if(this.y + this.radius >= screenHeight) {  //prevents from sinking into floor
            this.y -= 0.05; 
        }

        if(this.x + this.radius >= screenWidth + 5) {   //rapidly unstick from right
            this.x -= 25;
            this.velocity.x += randomRange(-2,2);  //adds slight sideways movement 
        } else if(this.x + this.radius >= screenWidth) {   //unstick items from right
            this.x -= 1; 
        }
        if(this.x + this.radius <= (this.radius * 2) - 5) {  //rapidly unstick from left
            this.x += 25;
            this.velocity.x += randomRange(-2,2);  //adds slight sideways movement 
        } else if(this.x + this.radius <= this.radius * 2) {    //unstick items from left
            this.x += 1; 
        }

        //slowly reduces rolling speed
        if(this.velocity.x > -10 && this.velocity.x < 0) {
            this.velocity.x += 0.005;
        } else if (this.velocity.x < 10 && this.velocity.x > 0) {
            this.velocity.x -= 0.005;
        } 

        //slowly reduces bounce height
        if(this.velocity.y > -10 && this.velocity.y < 0) {
            this.velocity.y += 0.005;
        } else if (this.velocity.y < 10 && this.velocity.y > 0) {
            this.velocity.y -= 0.005;
        }
        

        //interactivity; accurate click & mouse collision detection
        for(let m = 0; m < circArr.length; m++) {

            if(distance(user.x, user.y, circArr[m].x, circArr[m].y) - user.radius - circArr[m].radius < 0) {

                userVx = (user.x - circArr[m].x);  //user x velocity set at impact
                 
                userVy = (user.y - circArr[m].y); //user y velocity set at impact
                
                resolveCollision(user, circArr[m]); //collision physics 
            } 
        }

        this.x += this.velocity.x; 
        this.y += this.velocity.y;
        
        this.draw();
    }
}


//mouse movement and click object
function MyMouse(x,y,color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.collision = 1;
    this.distance = {
        x: randomRange(1,25), //horizontal distance from center
        y: randomRange(1,10)  //vertical distance from center
    } 
    this.mass = 1;
    this.radians = Math.random() * Math.PI * 2; //random location within a circular radius
    this.radius = 25; //radius of mouse object
    this.width = (Math.random() * 1) + 1; //particle size range between 1-2
    this.spinVelocity = 0.08;
    this.velocity = {
        x: 0.08,
        y: 0.08
    };
    
    this.draw = ()=> {
        c.beginPath();
        c.arc(this.x, this.y, this.width, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath;
    };

    this.update = ()=> {
        this.radians += this.spinVelocity;
        this.x = mouse.x + Math.cos(this.radians) * this.distance.x; 
        this.y = mouse.y + Math.sin(this.radians) * this.distance.y;
        this.velocity = {
            x: userVx,
            y: userVy
        };

        this.draw();
    };
}


//object creator sets individual attributes
function creator(num) {

    let circle, color, vx, vy, radius, x, y;
    
    for(let i = 0; i < num; i++) {
        
        color = colorArray[randomRange( 0, colorArray.length - 1)]; //random color picker
        vx = randomRange(-25,25); //random velocity x-axis
        vy = randomRange(-25,25); //random velocity y-axis
        radius = randomRange(5,30); //random circle radius
        x = randomRange(radius, screenWidth - radius); //choose location
        y = randomRange(radius, screenHeight - radius); //choose location
        
        circle = new Circle(x,y,vx,vy,radius,color);

        circArr.push(circle); //sends to array
    }    
    
    for(let i = 0; i < 50; i++) {

        color = colorArray[randomRange( 0, colorArray.length - 1)];
        
        user = new MyMouse(undefined,undefined,color);

        twister.push(user);
    }
}


function animate() {

    requestAnimationFrame(animate); //loop
    c.clearRect(0,0,screenWidth,screenHeight); //clears screen

    twister.forEach(obj => {
        obj.update();
    });
    //user.update(); //mouse|click object

    //animates all array items
    circArr.forEach(obj => {
        obj.update(circArr); //updates each object
    });
}


canvas.addEventListener("click", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

    portfolio.style.visibility == "visible" ? portfolio.style.visibility = "hidden" : portfolio.style.visibility = "visible";

   /*  setTimeout(function() {
        mouse.x = undefined;
        mouse.y = undefined;
    },100);  */
});


canvas.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

   /*  setTimeout(function() {
        mouse.x = undefined;
        mouse.y = undefined;
    },25); */
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
        },75);
    });
}, 25); 


window.onload = function() {

    creator(randomRange(50,125));
    
    animate();
};
