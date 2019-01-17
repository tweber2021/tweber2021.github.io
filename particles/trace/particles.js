// Particles Demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx=canvas.getContext("2d");

// Init. Variables
// assumed: m=1
const n = 500;
const w = canvas.width;
const h = canvas.height;
const G = 200; // Fake gravitational constant
const path = true;
var x = [];
var y = [];
var vx = [];
var vy = [];

// Init. particles
var i;
for(i=0;i<n;i++){
	x[i] = Math.random()*w;
	y[i] = Math.random()*h;
	vx[i] = (Math.random()*20)-10; // 0 for experiments
	vy[i] = (Math.random()*20)-10;
}

// Experiment
/*
x[0] = w/2;
y[0] = h/2;
x[1] = x[0];
y[1] = y[0]+10;
vx[0] = -0.42;
vx[1] = 0.42;*/

// Run
setInterval(update,1000/60); // Update at 60 fps

function applyForces(p){ // TODO: Calculate and apply normal and gravitational forces
	// Calculate and apply all gravitational forces on p
	for(i=0;i<n;i++){
		if(i===p){continue;}
		var dx = x[p]-x[i];
		var dy = y[p]-y[i];
		var d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		var Fg = G/Math.pow(d,2);
		var theta = Math.atan(Math.abs(dy)/Math.abs(dx));
		vx[p] += -1*Math.sign(dx)*Fg*Math.cos(theta); // Apply gravitational force
		vy[p] += -1*Math.sign(dy)*Fg*Math.sin(theta);
		if(Math.abs(dx/vx[p])<=1 && Math.abs(dy/vy[p])<=1){ // Apply normal force
			x[p] += Math.sign(vx[p])*Math.abs(dx/vx[p]);
			y[p] += Math.sign(vy[p])*Math.abs(dy/vy[p]);
			vx[p] = 0;
			vy[p] = 0;
		}
	}
}

function update(){ // Update simulation
	var j;
	for(j=0;j<n;j++){
		if(!path){erase(x[j],y[j]);}
		else{trace(x[j],y[j]);}
		var lx = x[j];
		var ly = y[j];
		applyForces(j);
		x[j] += vx[j];
		y[j] += vy[j];
		// TODO: Trace lines
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

function trace(x,y){ // Trace a pixel
	ctx.fillStyle = "blue";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}
