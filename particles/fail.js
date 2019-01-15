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
const G = 100; // Gravitational constant
var x = [];
var y = [];
var vx = [];
var vy = [];

// Init. particles
var i;
for(i=0;i<n;i++){
	x[i] = Math.random()*w;
	y[i] = Math.random()*h;
	vx[i] = 0;//(Math.random()*4)-2;
	vy[i] = 0;//(Math.random()*4)-2;
}

// Run
setInterval(update,1000/60); // Update at 60 fps

function applyForces(p){ // TODO: Calculate and apply normal and gravitational forces
	// Calculate and apply all gravitational forces on p
	for(i=0;i<n;i++){
		if(i===p){continue;}
		var dx = x[p]-x[i];
		var dy = y[p]-y[i];
		var d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		var Fg = 0.01;//G*(1/Math.pow(d,2));
		var theta = Math.atan(dy/dx);
		vx[p] += -1*Math.sign(dx)*Fg*Math.cos(theta);
		vy[p] += -1*Math.sign(dy)*Fg*Math.sin(theta);
		//console.log(Fg,m,Fgx,Fgy);
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
