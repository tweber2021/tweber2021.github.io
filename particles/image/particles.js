// Particles Demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx=canvas.getContext("2d");

// Init. Variables
// assumed: m=1
var l = 100;
var n = l*l;
const w = canvas.width;
const h = canvas.height;
var G = getUrlParam("G",120);
if(G==undefined){G=120;}
var Ga = getUrlParam("Ga",1);
if(Ga==undefined){Ga=1;}
const path = true;
var Vc = getUrlParam("Vc",10);
if(Vc==undefined){Vc=10;}
var P = getUrlParam("P",0);
if(P==undefined){Pe=0;}
var Rv = getUrlParam("Rv",1);
if(Rv==undefined){Rv=1;}
var x = [];
var y = [];
var vx = [];
var vy = [];
var tx = [];
var ty = [];
var frozen = [];
var color = [];

// Init. particles
loadImgData(function(pixArr){
	var i;
	var j;
	var pos = 0;
	for(i=0;i<l;i++){
		for(j=0;j<l;j++){
			x[pos] = Math.random()*w;
			y[pos] = Math.random()*h;
			tx[pos] = i+(w/2)-(l/2); // Target positions
			ty[pos] = j+(h/2)-(l/2);
			vx[pos] = (Math.random()-0.5)*Rv;
			vy[pos] = (Math.random()-0.5)*Rv;
			color[pos] = pixArr[i][j];
			frozen[pos] = false;
			pos++;
		}
	}
});

// Run
var time = 0;
setInterval(update,1000/60); // Update at 60 fps

function applyForces(p){
	// Attract p to its destination position
	var dx = x[p]-tx[p];
	var dy = y[p]-ty[p];
	var d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
	if(Math.abs(dx)<Math.abs(vx[p])||Math.abs(dy)<Math.abs(vy[p])||d>10000){ // Snap particle to grid
		x[p] = tx[p];
		y[p] = ty[p];
		vx[p] = 0;
		vy[p] = 0;
		frozen[p] = true;
		return;
	}
	var Fg = (G+(time*Ga))/Math.pow(d,2);
	var theta = Math.atan(Math.abs(dy)/Math.abs(dx));
	vx[p] += -1*Math.sign(dx)*Fg*Math.cos(theta); // Apply gravitational force
	vy[p] += -1*Math.sign(dy)*Fg*Math.sin(theta);
	//if(Math.abs(vx[p])>10){vx[p]=Math.sign(vx[p])*10;} // Speed limit
	//if(Math.abs(vy[p])>10){vy[p]=Math.sign(vy[p])*10;}
}

function update(){ // Update simulation
	var j;
	for(j=0;j<n;j++){
		if(P!=2){erase(x[j],y[j]);}
		var lx = x[j];
		var ly = y[j];
		if(!frozen[j]){
		x[j] += vx[j];
		y[j] += vy[j];
		applyForces(j);
		var v = Math.sqrt(Math.pow(vx[j],2)+Math.pow(vy[j],2));
		if(P>0){trace(lx,ly,x[j],y[j],v);}
		}
		if(P!=2){plot(x[j],y[j],color[j]);}
	}
	time+=1;
}

function plot(x,y,color){ // Fill in a pixel
	ctx.fillStyle = "rgb("+color.r+","+color.g+","+color.b+")";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function erase(x,y){ // Erase a pixel
	ctx.fillStyle = "black";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function trace(x1,y1,x2,y2,v){
	var blu = Math.floor(255*(v/Vc));
    if(blu>255){blu=255;}
	ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,"+blu.toString()+","+blu.toString()+")";
    ctx.stroke();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
        }
    return urlparameter;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function loadImgData(callback){
    var pixArr = createArray(100,2);
    var can2 = document.createElement('canvas');
    var ctx2 = can2.getContext('2d');
    var dat;
    
    var img = new Image();
    img.onload=function(){
        can2.width = img.width;
        can2.height = img.height;
        ctx2.drawImage(img,0,0);
        dat = ctx2.getImageData(0,0,can2.width,can2.height).data;
        var a;
        var b;
        for(a=0;a<can2.width;a++){
            for(b=0;b<can2.height;b++){
                var index=(a+b*can2.width)*4;
                pixArr[a][b]={r:dat[index], g:dat[index+1], b:dat[index+2]};
            }
        }
        callback(pixArr);
    };
    img.src = "willsmith.png";
}
