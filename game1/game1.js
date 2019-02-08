// Particles Demo

// Init. Canvas
var canvas=document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx=canvas.getContext("2d");

// Init. Input
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var ePressed = false;
var holdTime = 0;

// Init. Variables
const w = canvas.width;
const h = canvas.height;
const g = 1;

var bg = new Image();
bg.src = "bg.png";
var bg2 = new Image();
bg2.src = "bg2.png";
var norm = new Image();
norm.src = "norm.png";
var sno = new Image();
sno.src = "snowball.png";
var burger = new Image();
burger.src = "burger.png";
var com = new Image();
com.src = "enemy.png";

var sounds = [];

var fiteNite = false;
var snoDelay = 0;
var snoDelay2 = 0;
var t = 0;
var phase = 0;

// Init. Objects
var obj = [{ // Norm
	x: 0,
	y: h,
	vx: 0,
	vy: 0,
	m: 10,
	img: norm,
	ot: 0,
	hp: 100,
	destructible: false
},
{ // Enemy
	x: w-40,
	y: h,
	vx: 0,
	vy: 0,
	m: 20,
	img: com,
	ot: 1,
	hp: 300,
	destructible: false
}];

// Run
var timing = setInterval(update,1000/60); // Update at 60 fps

function update(){ // Update simulation
	cls();
	displayHP();
	if(snoDelay>0){snoDelay--;}
	if(snoDelay2>0){snoDelay2--;}
	if(snoDelay2<=0){ // Enemy projectiles
		if(phase==0){
			obj.push({
			x: obj[1].x+obj[1].img.width,
			y: obj[1].y,
			vx: -70,
			vy: -20*Math.random(),
			m: 1,
			img: burger,
			ot: 1,
			destructible: true
			});
			snoDelay2 = 60;
			}
		else if(phase==1){
			obj.push({
			x: (Math.floor(t/30)%5)*(w/5),//(obj[0].x+obj[0].img.width/2)+((Math.random()*50)-25),
			y: 0,
			vx: (Math.random()*20)-10,
			vy: 0,
			m: 1,
			img: burger,
			ot: 1,
			destructible: true
			});
			snoDelay2 = 5;
		}
		else{
			obj.push({
			x: (w/2)+Math.sin(t/30)*(w/2.8),
			y: 0,
			vx: Math.random()*10,
			vy: 0,
			m: 1,
			img: burger,
			ot: 1,
			destructible: true
			});
			snoDelay2 = 0;
		}
		}
	var j;
	for(j=0;j<obj.length;j++){
		applyForces(j);
		obj[j].x += obj[j].vx;
		obj[j].y += obj[j].vy;
		if(obj[j].x<0){obj[j].x=0;obj[j].vx*=-1;}
		if(obj[j].x>w-obj[j].img.width){obj[j].x=w-obj[j].img.width;obj[j].vx*=-1;}
		if(obj[0].vx>0){obj[0].vx-=1;}
		if(objHitObj(0,j)&&obj[j].ot!=0){
			sound("hurt.mp3");
			if(obj[j].destructible){
			obj.splice(j,1);
			obj[0].hp--;
			}
			else{
				obj[0].hp-=1;
				obj[0].vx = -20;
				obj[0].vy-=35;
			}
		}
		if(objHitObj(1,j)&&obj[j].ot!=1&&obj[j].destructible){
			obj.splice(j,1);
			obj[1].hp--;
			sound("spoomg.mp3");
		}
		ctx.drawImage(obj[j].img,obj[j].x,obj[j].y);
	}
	t++;
	if(t%600==0){
		phase++;
		phase%=3;
		if(phase==0){
			obj[1].img.src = "enemy.png";
		}
		else{
			obj[1].img.src = "enemy"+(phase+1)+".png";
		}
	}
}

function applyForces(p){
	if(obj[p].y<=h-obj[p].img.height){obj[p].vy+=g;} // Gravity
	
	// Input
	if(rightPressed&&p==0&&obj[0].vx==0){
		obj[p].x+=10;
	}
	if(leftPressed&&p==0&&obj[0].vx==0){
		obj[p].x-=10;
	}
	if(spacePressed&&obj[p].y>=h-obj[p].img.height&&p==0){
		obj[p].vy-=35;
		obj[0].img.src = "norm2.png";
	}
	if(ePressed&&obj.length<=100&&snoDelay<=0){
		obj.push({
			x: obj[0].x+obj[0].img.width,
			y: obj[0].y,
			vx: 50*Math.random(),
			vy: -20*Math.random(),
			m: 1,
			img: sno,
			ot: 0,
			destructible: true
			});
			fiteNite = true;
			snoDelay = 5;
	}
	if(obj[p].y>=h-obj[p].img.height&&obj[p].vx!=0&&obj[p].vy>=0){obj[p].vx=0;} // "Friction"
	
	// Fnorm
	if(obj[p].y>h-obj[p].img.height){
		obj[p].y=h-obj[p].img.height;
		obj[p].vy=0;
		if(!ePressed){obj[0].img.src = "norm.png";}
		if(obj[p].destructible){
			obj.splice(p,1); // Remove snowballs on the ground
		}
	}
}

function objHitObj(a,b){ // Check if two objects are touching
	var x1 = obj[a].x; var x2 = obj[b].x; var y1 = obj[a].y; var y2 = obj[b].y;
	var w1 = obj[a].img.width; var w2 = obj[b].img.width; var h1 = obj[a].img.height; var h2 = obj[b].img.height;
	if(x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2){return true;}
	else{return false;}
}

function cls(){ // Clear screen
	if(!fiteNite){ctx.drawImage(bg,0,0,bg.width,bg.height,0,0,w,h);}
	else{ctx.drawImage(bg2,0,0,bg2.width,bg2.height,0,0,w,h);}
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "e") {
		obj[0].img.src = "norm3.png";
        ePressed = true;
    }
    else if(e.keyCode == 32) {
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "e") {
        ePressed = false;
    }
    else if(e.keyCode == 32) {
        spacePressed = false;
    }
}

function displayHP(){
	var percent = obj[0].hp/100;
	ctx.fillStyle = "green";
	ctx.fillRect(0,0,w*percent,20);
	var percent = obj[1].hp/300;
	ctx.fillStyle = "blue";
	ctx.fillRect(0,h-20,w*percent,20);
	if(obj[0].hp<=0){
		endGame();
	}
	if(obj[1].hp<=0){
		winGame();
	}
}

function endGame(){
	clearInterval(timing);
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,w,h);
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	ctx.fillText("Game Over", w/2,h/2); 
}

function winGame(){
	clearInterval(timing);
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,w,h);
	ctx.font = "30px Arial";
	ctx.fillStyle = "green";
	ctx.fillText("You Win!", w/2,h/2); 
}

function sound(src){
	var aud = new Audio(src);
	aud.play();
	sounds.push(aud);
	sounds[sounds.length-1].play();
}

