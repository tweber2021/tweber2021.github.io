// Particles Demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx=canvas.getContext("2d");

// Init. Variables
const n = 10000;
const w = canvas.width;
const h = canvas.height;
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

function update(){
	var j;
	for(j=0;j<n;j++){
		erase(x[j],y[j]);
		x[j] += vx[j];
		y[j] += vy[j];
		plot(x[j],y[j])
	}
}

function plot(x,y){
	ctx.fillStyle = "white";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function erase(x,y){
	ctx.fillStyle = "black";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}
