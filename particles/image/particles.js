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
var G = parseInt(getUrlParam("G",120));
if(G==undefined){G=120;}
var Ga = parseInt(getUrlParam("Ga",1));
if(Ga==undefined){Ga=1;}
const path = true;
var Vc = getUrlParam("Vc",10);
if(Vc==undefined){Vc=10;}
var P = getUrlParam("P",0);
if(P==undefined){Pe=0;}
var Rv = getUrlParam("Rv",1);
if(Rv==undefined){Rv=1;}
var Ii = parseInt(getUrlParam("Ii",0));
if(Ii==undefined){Ii=0;}
var If = parseInt(getUrlParam("If",1));
if(If==undefined){If=1;}
var x = [];
var y = [];
var vx = [];
var vy = [];
var tx = [];
var ty = [];
var tx2 = [];
var ty2 = [];
var frozen = [];
var color = [];
var stage = 0;

// Init. particles
var ImgI = "";
var ImgF = "";
switch(Ii){
	case 0: ImgI = "willsmith.png"; break;
	case 1: ImgI = "sans.png"; break;
	case 2: ImgI = "ness.png"; break;
	case 3: ImgI = "ninja.png";
}
switch(If){
	case 0: ImgF = "willsmith.png"; break;
	case 1: ImgF = "sans.png"; break;
	case 2: ImgF = "ness.png"; break;
	case 3: ImgF = "ninja.png";
}

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
},ImgI);
loadImgData(function(pixArr){
	var i;
	var j;
	var k;
	var reserved = createArray(100,2);
	//var pos = 0;
	var distRec = 450;
	var sel = {x:-1, y:-1};
	for(i=0;i<n;i++){
		distRec = 450;
		for(j=0;j<l;j++){
			for(k=0;k<l;k++){
				colDist = Math.sqrt(Math.pow(color[i].r-pixArr[j][k].r,2)+Math.pow(color[i].g-pixArr[j][k].g,2)+Math.pow(color[i].b-pixArr[j][k].b,2));
				if(colDist<distRec&&!reserved[j][k]){
					distRec=colDist;
					sel = {x:j,y:k};
				}
				//pos++;
			}
		}
		reserved[sel.x][sel.y] = true;
		tx2[i] = sel.x+(w/2)-(l/2);
		ty2[i] = sel.y+(h/2)-(l/2);
		if(distRec>0){/*console.log("dR: "+distRec);*/console.log("x");}
	}
},ImgF);

// Run
var time = 0;
var freezeCount = 0;
setInterval(update,1000/60); // Update at 60 fps

function applyForces(p){
	// Attract p to its destination position
	var dx = x[p]-tx[p];
	var dy = y[p]-ty[p];
	if(time%60==0&&p==0){console.log("x[0]: "+x[0]);}
	var d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
	if(Math.abs(dx)<Math.abs(vx[p])||Math.abs(dy)<Math.abs(vy[p])&&G>0){ // Snap particle to grid
		x[p] = tx[p];
		y[p] = ty[p];
		vx[p] = 0;
		vy[p] = 0;
		frozen[p] = true;
		freezeCount++;
		if(freezeCount==10000&&stage==0){
			console.log("boom");
			for(i=0;i<n;i++){
				frozen[i]=false;
				x[i] = tx[i];//Math.random()*w;
				y[i] = ty[i];//Math.random()*h;
				tx[i] = tx2[i];
				ty[i] = ty2[i];
			}
			stage++;
			freezeCount = 0;
			cls();
		}
		return;
	}
	var Fg = G/Math.pow(d,2);
	var theta = Math.atan(Math.abs(dy)/Math.abs(dx));
	vx[p] += -1*Math.sign(dx)*Fg*Math.cos(theta); // Apply gravitational force
	vy[p] += -1*Math.sign(dy)*Fg*Math.sin(theta);
}

function update(){ // Update simulation
	var j;
	for(j=0;j<n;j++){
		if(P!=2&&!frozen[j]){erase(x[j],y[j]);}
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
	G+=Ga;
}

function plot(x,y,color){ // Fill in a pixel
	ctx.fillStyle = "rgb("+color.r+","+color.g+","+color.b+")";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function erase(x,y){ // Erase a pixel
	ctx.fillStyle = "black";
	ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function cls(){ // Clear the screen
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, w, h);
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

function loadImgData(callback,filename){
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
    img.src = filename;//"willsmith.png";
}
