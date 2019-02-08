// Circles demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx=canvas.getContext("2d");

// Init. Variables
const n = 500;
const w = canvas.width;
const h = canvas.height;
const G = 1; // Fake gravitational constant
const border = true;
var x = [];
var y = [];
var vx = [];
var vy = [];
var m = [];

// Init. particles
var i;
for(i=0;i<n;i++){
	x[i] = Math.random()*w;
	y[i] = Math.random()*h;
	vx[i] = 0; //(Math.random()*20)-10; // 0 for experiments
	vy[i] = 0; //(Math.random()*20)-10;
	m[i] = 1; //Math.random()*Math.pow(10,Math.floor(Math.random()*5));
}
m[0] = 10000;

// Run
setInterval(update,1000/60); // Update at 60 fps

function update(){ // Update simulation
	cls();
	var j;
	for(j=0;j<n;j++){
		var lx = x[j];
		var ly = y[j];
		applyForces(j);
		x[j] += vx[j];
		y[j] += vy[j];
		if(border){
			if(x[j]>w-getRad(j)){x[j]=w-getRad(j);}
			if(j[j]>h-getRad(j)){y[j]=h-getRad(j);}
			if(x[j]<getRad(j)){x[j]=getRad(j);}
			if(y[j]<getRad(j)){y[j]=getRad(j);}
		}
		plot(x[j],y[j],getRad(j));
	}
}

function plot(x,y,r){ // Fill in a circle
	ctx.strokeStyle = "white";
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI,false);
	ctx.lineWidth = 1;
	ctx.stroke();
}

function cls(){ // Clear screen
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, w, h);
}

function applyForces(p){
	// Calculate and apply all gravitational forces on p
	for(i=0;i<n;i++){
		if(i===p){continue;}
		var dx = x[p]-x[i];
		var dy = y[p]-y[i];
		var d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		var Fg = (G*m[p]*m[i])/Math.pow(d,2);
		var theta = Math.atan(Math.abs(dy)/Math.abs(dx));
		vx[p] += -1*Math.sign(dx)*Fg*Math.cos(theta)/m[p]; // Apply gravitational force
		vy[p] += -1*Math.sign(dy)*Fg*Math.sin(theta)/m[p];
		var colDist = getRad(i)+getRad(p);
		if(Math.abs(d)<=colDist){ // Apply normal force
			collide(p,i);
		}
	}
}

function collide(p1,p2){ // TODO: Real collisions
	var dx = x[p1]-x[p2];
	var dy = y[p1]-y[p2];
	var d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
	var theta = Math.atan(Math.abs(dy)/Math.abs(dx));
	var overlap = (getRad(p1)+getRad(p2))-d;

	x[p2]-=Math.sign(vx[p2])*overlap;
	y[p2]-=Math.sign(vy[p2])*overlap;
	
	vx[p1]=0;
	vx[p2]=0;
	vy[p1]=0;
	vy[p2]=0;
}

function getRad(p){ // Get radius from particle p
	return Math.sqrt(m[p]/Math.PI);
}
