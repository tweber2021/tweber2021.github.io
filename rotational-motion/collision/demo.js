// Particles Demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight/2;
var ctx=canvas.getContext("2d");

// Init. Variables
const w = canvas.width;
const h = canvas.height;
const fps = 60;
const ofsX = w/2;
const ofsY = h/2;

var body = [
	{
		cx: -500,
		cy: 0,
		w: 50,
		h: 100,
		x: [],
		y: [],
		Rx: [],
		Ry: [],
		vx: 0,
		vy: 0,
		ax: 0.003,
		ay: 0,
		angP: 0,
		angV: 0,
		angA: 0.0002
	},
	{
		cx: 500,
		cy: 0,
		w: 50,
		h: 100,
		x: [],
		y: [],
		Rx: [],
		Ry: [],
		vx: 0,
		vy: 0,
		ax: -0.003,
		ay: 0,
		angP: 0,
		angV: 0,
		angA: 0.0002
	}
];

// Run
setInterval(update,1000/fps);

function update(){ // Update simulation
	cls();
	var i;
	for(i=0;i<body.length;i++){
		rect = body[i];
		
		// Update vertex coordinates
		var px = rect.w/2;
		var py = rect.h/2;
		rect.x[0] = rect.cx-px; rect.x[1] = rect.cx+px; rect.x[2] = rect.x[1]; rect.x[3] = rect.x[0];
		rect.y[0] = rect.cy-py; rect.y[1] = rect.y[0]; rect.y[2] = rect.cy+py; rect.y[3] = rect.y[2];
		
		// Translational Motion
		rect.vx+=rect.ax;
		rect.xy+=rect.ay;
		rect.cx+=rect.vx;
		rect.cy+=rect.vy;
		
		// Angular Motion
		rect.angV+=rect.angA;
		rect.angP+=rect.angV;
		rect.angP%=(2*Math.PI);
		var j;
		for(j=0;j<4;j++){
			rotate(j,rect.angP);
		}
		
		// Collision
		colBroad(body[0],body[1]);
		
		draw();
	}
	updateText();
}

function rotate(id,angle){
	rect.x[id] -= rect.cx;
	rect.y[id] -= rect.cy;
	rect.Rx[id] = (rect.x[id]*Math.cos(angle))-(rect.y[id]*Math.sin(angle));
	rect.Ry[id] = (rect.y[id]*Math.cos(angle))+(rect.x[id]*Math.sin(angle));
	rect.x[id] += rect.cx;
	rect.y[id] += rect.cy;
	rect.Rx[id] += rect.cx;
	rect.Ry[id] += rect.cy;
}

function draw(){ // Draw a tilted rectangle
	var i;
	for(i=0;i<4;i++){
		line(rect.Rx[i]+ofsX,rect.Ry[i]+ofsY,rect.Rx[(i+1)%4]+ofsX,rect.Ry[(i+1)%4]+ofsY);
	}
}

function rec(x1,y1,x2,y2){ // Draw a simple rectangle
	var w = x2-x1;
	var h = y2-y1;
	ctx.strokeStyle = "red";
	ctx.rect(x1,y1,w,h);
	ctx.stroke();
}

function line(x1,y1,x2,y2){ // Draw a line
	ctx.strokeStyle = "white";
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
	pp.innerHTML = "θ₁ = "+roundDec(body[0].angP,3)+" rads";
	vp.innerHTML = "ω₁ = "+roundDec(body[0].angV,3)+" rads/frame";
	ap.innerHTML = "α₁ = "+body[0].angA+" rads/frame²"
	
	pp2.innerHTML = "θ₂ = "+roundDec(body[1].angP,3)+" rads";
	vp2.innerHTML = "ω₂ = "+roundDec(body[1].angV,3)+" rads/frame";
	ap2.innerHTML = "α₂ = "+body[1].angA+" rads/frame²"
}

function colBroad(b1,b2){ // Broad-phase collision detection
	var lim1 = getBounds(b1);
	var lim2 = getBounds(b2);
	rec(lim1[0]+ofsX,lim1[2]+ofsY,lim1[1]+ofsX,lim1[3]+ofsY);
	rec(lim2[0]+ofsX,lim2[2]+ofsY,lim2[1]+ofsX,lim2[3]+ofsY);
	return false;
}

function getBounds(bdy){ // Get the top left corner for broad-phase detection
	var lim = []; // 0: minX; 1: maxX; 2: minY; 3: maxY
	var i;
	for(i=0;i<4;i++){
		if(bdy.Rx[i]<lim[0] || lim[0] == undefined){lim[0] = bdy.Rx[i];}
		if(bdy.Rx[i]>lim[1] || lim[1] == undefined){lim[1] = bdy.Rx[i];}
		if(bdy.Ry[i]<lim[2] || lim[2] == undefined){lim[2] = bdy.Ry[i];}
		if(bdy.Ry[i]>lim[3] || lim[3] == undefined){lim[3] = bdy.Ry[i];}
	}
	console.log(lim[1]-lim[0],lim[3]-lim[2]);
	return lim;
}
