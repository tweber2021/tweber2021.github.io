// Particles Demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight/2;
var ctx=canvas.getContext("2d");
var vp = document.getElementById("vp");
var ap = document.getElementById("ap");

// Init. Variables
const w = canvas.width;
const h = canvas.height/2;
const path = false;
const angA = 0.00002;
var angV = 0;
var angP = 0;
const fps = 60;
const ofsX = w/2;
const ofsY = h/2;

const shape = {
	x: [-25,25,25,-25],
	y: [-50,-50,50,50],
	vx: 0,
	vy: 0
};

var Rx = [];
var Ry = [];

// Run
setInterval(update,1000/fps);

function rotate(id,angle){
	Rx[id] = (shape.x[id]*Math.cos(angle))-(shape.y[id]*Math.sin(angle));
	Ry[id] = (shape.y[id]*Math.cos(angle))+(shape.x[id]*Math.sin(angle));
}

function update(){ // Update simulation
	cls();
	var i;
	angV+=angA;
	angP+=angV;
	angP%=(2*Math.PI);
	for(i=0;i<4;i++){
		rotate(i,angP);
	}
	draw();
	updateText();
}

function draw(){ // Draw a rectangle
	var j;
	for(j=0;j<4;j++){
		line(Rx[j]+ofsX,Ry[j]+ofsY,Rx[(j+1)%4]+ofsX,Ry[(j+1)%4]+ofsY,"white");
	}
}

function line(x1,y1,x2,y2,style){ // Draw a line
	ctx.strokeStyle = style;
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();
}

function cls(){ // Clear the screen
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, w, h);
}

function roundDec(n,digits){
	var factor = Math.pow(10,digits);
	return Math.round(n*factor)/factor;
}

function updateText(){
	pp.innerHTML = "θ = "+roundDec(angP,3)+" rads";
	vp.innerHTML = "ω = "+roundDec(angV,3)+" rads/frame";
	ap.innerHTML = "α = "+angA+" rads/frame²"
}
