// Particles Demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx=canvas.getContext("2d");

// Init. Variables
// assumed: m=1
const n = 1000;
const w = canvas.width;
const h = canvas.height;
const G = 1000000; // Gravitational constant
var x = [];
var y = [];
var vx = [];
var vy = [];

// Init. particles
var i;
for(i=0;i<n;i++){
	x[i] = Math.random()*w;
	y[i] = Math.random()*h;
	vx[i] = (Math.random()*4)-2;
	vy[i] = (Math.random()*4)-2;
}

// Run
setInterval(update,1000/60); // Update at 60 fps

function applyForces(p){ // Calculate and apply normal and gravitational forces
	// Calculate and apply all gravitational forces on p
	var d;
	for(i=0;i<n;i++){
		d = Math.sqrt(Math.pow(x[p]-x[i],2)+Math.pow(y[p]-y[i],2));
		Fg = G*(1/Math.pow(d,2));
		// TODO: Trig
	}
	// TODO: Apply normal force if needed
}

function update(){ // Update simulation
	var j;
	for(j=0;j<n;j++){
		erase(x[j],y[j]);
		applyForces(j);
		x[j] += vx[j];
		y[j] += vy[j];
		plot(x[j],y[j])
	}
}

function plot(x,y){ // Fill in a pixel
	ctx.fillStyle = "white";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function erase(x,y){ // Erase a pixel
	ctx.fillStyle = "black";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}
