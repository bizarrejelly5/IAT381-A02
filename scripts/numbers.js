/*
show the number[i]s at the bottom of the screen. The number[i]s can be dragged and placed into boxes to determine the alarm
*/

var stage = new PIXI.Stage(0x97c56e, true);

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);
//seems to make it take up the entire screen
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
renderer.view.style.left = "0px";

requestAnimFrame( animate );

//the sprites, number[i]s and hour/minute boxes
var number = [];
//cloned numbers when clicked, 
var clonedNumber = [];
var box = [];
var refNumber = [];
var hour = [];
var minute = [];
var currentHour = [];
var currentMinute = [];
var newAlarmPos = 1;
var onOff, onOff2 = false;

//only allow up to 3 alarms
var alarmLimit = 3;

//alarm audio file
var playAlarm = false;
var audio = new Audio('audio/alarm.wav');
var stopAlarm = false;

//tracks which number is deleted after 5 seconds
var deleteReference = 0;

//set the timer
var text = new PIXI.Text(currentHour + " : " + currentMinute, {font:"50px Arial", fill:"red"});

var pinnedNumber = [];

function init(){
	for(var i = 0; i < 10; i++){
		createNumbers(i);
		number[i] = [];
	}
}

//shows the current time
function timer(){
	var currentTime = new Date();
	currentHour = "" + currentTime.getHours() + "";
	
	//hours are 1 character long if the time is from 1 to 9 AM, this adds a 0 to the front
	if(currentHour.length == 1){
		currentHour = "0" + currentTime.getHours() + "";
	}
	currentMinute = "" + currentTime.getMinutes() + "";
	if(currentMinute.length == 1){
		currentMinute = "0" + currentTime.getMinutes() + "";
	}
	
	//display the time at the top of the screen and update it
	text.setText(currentHour + " : " + currentMinute, {font:"50px Arial", fill:"red"});
	stage.addChild(text);
}

//put the number[i]s on the bottom of the screen
function createNumbers(i)
{	
		var texture = PIXI.Texture.fromImage("images/" + i + ".png");
		number[i] = new PIXI.Sprite(texture);
		
		// allow mouse click and drag	
		number[i].interactive = true;
		number[i].buttonMode = true;
		
		// center the number[i]'s anchor point
		number[i].anchor.x = 0.5;
		number[i].anchor.y = 0.5;
		// make it a bit bigger, so its easier to touch
		number[i].scale.x = number[i].scale.y = screen.width/10000;

		number[i].mousedown = number[i].touchstart = function(data)
		{
			duplicateNumber(i);
			deleteReference++;
		}
		
		// move the sprite to its designated position
		number[i].position.x = i * window.innerWidth/10 + 50;
		number[i].position.y = window.innerHeight - 100;
		
		// add it to the stage
		stage.addChild(number[i]);
};

function duplicateNumber(x){
	var reference = deleteReference;
	var texture = PIXI.Texture.fromImage("images/" + x + ".png");
	clonedNumber[clonedNumber.length] = new PIXI.Sprite(texture);

	clonedNumber[clonedNumber.length-1].interactive = true;
	clonedNumber[clonedNumber.length-1].buttonMode = true;
	
	//variable to determine if the number is pinned to the alarm, if not, they will be removed after 5 seconds
	//var pinnedNumber = false;
	pinnedNumber[reference] = false;
	
	// make it a bit bigger, so its easier to touch
	clonedNumber[reference].scale.x = clonedNumber[reference].scale.y = screen.width/10000;
	 
	//center anchor
	clonedNumber[reference].anchor.x = 0.5;
	clonedNumber[reference].anchor.y = 0.5;
	
	clonedNumber[reference].position.x = Math.floor( Math.random() * (window.innerWidth - 0));
	clonedNumber[reference].position.y = Math.floor( Math.random() * (window.innerHeight - (window.innerHeight+100)) + window.innerHeight-100);
	
	clonedNumber[reference].mousedown = clonedNumber[reference].touchstart = function(data)
		{
			this.data = data;
			this.alpha = 0.9;
			this.dragging = true;
		}
		
		clonedNumber[reference].mouseup = clonedNumber[reference].mouseupoutside = clonedNumber[reference].touchend = clonedNumber[reference].touchendoutside = function(data)
		{
			this.alpha = 1
			this.dragging = false;
			// set the interaction data to null
			this.data = null;
			intersect(clonedNumber[reference], x, reference);
		};
		clonedNumber[reference].mousemove = clonedNumber[reference].touchmove = function(data)
		{
			if(this.dragging)
			{
				// need to get parent coords..
				var newPosition = this.data.getLocalPosition(this.parent);
				clonedNumber[reference].position.x = newPosition.x;
				clonedNumber[reference].position.y = newPosition.y;
			}
		}
		stage.addChild(clonedNumber[reference]);
		
		//rotate number
		moveNumbers(clonedNumber[reference], reference);
}

function createBoxes(){
	//make a box that user puts the numbers in
	for(var i = 0; i < 4; i++){
		box[i + ((newAlarmPos - 1) * 4)] = new PIXI.Graphics();
		box[i + ((newAlarmPos - 1) * 4)].beginFill(0xFFFFFF);
		box[i + ((newAlarmPos - 1) * 4)].lineStyle(5, 0x000000);
		box[i + ((newAlarmPos - 1) * 4)].drawRect(0, 0, 75, 75);
		box[i + ((newAlarmPos - 1) * 4)].position.x =  i * window.innerWidth/4 + (window.innerWidth/8 - 40);
		box[i + ((newAlarmPos - 1) * 4)].position.y =  newAlarmPos * window.innerWidth/15;
		stage.addChild(box[i + ((newAlarmPos - 1) * 4)]);

		//wtf it needs console to work 
		console.log(box[i + ((newAlarmPos - 1) * 4)].height);
	}
}


function intersect(obj, num, reference){
	//bounding box to determine if a number is in a box
	
	//currently only the 0 number works, need to make it so that they all work by changing number[i][0] to something like number[i][x]
	 // console.log("num pos x: " + obj.position.x + " num pos y: " + obj.position.y);
	 // console.log("box pos x: " + box[0].position.x + " box pos y: " + box[0].position.y);
	 // console.log("box width: " + box[0].width + "box height: " + box[0].height);

	for (var i = 0; i < newAlarmPos; i++) {
		if(obj.position.x > box[i * 4].position.x && 
		obj.position.x < box[i * 4].position.x + box[i * 4].width/2 &&
		obj.position.y > box[i * 4].position.y - box[1 + i * 4].height/2 &&
		obj.position.y < box[i * 4].position.y + box[1 + i * 4].height/2){
			hour[i * 2] = num;
			console.log("in Box 0");
			pinnedNumber[reference] = true;
		}
		if(obj.position.x > box[1 + i * 4].position.x && 
		 obj.position.x < box[1 + i * 4].position.x + box[1 + i * 4].width &&
		 obj.position.y > box[1 + i * 4].position.y - box[1 + i * 4].height/2 &&
		 obj.position.y < box[1 + i * 4].position.y + box[1 + i * 4].height/2){
			hour[i * 2 + 1] = num;
			console.log("in Box 1");
			pinnedNumber[reference] = true;
		}
		if(obj.position.x > box[2 + + i * 4].position.x && 
		 obj.position.x < box[2 + + i * 4].position.x + box[2 + + i * 4].width &&
		 obj.position.y > box[2 + + i * 4].position.y - box[2 + i * 4].height/2&&
		 obj.position.y < box[2 + + i * 4].position.y + box[2 + i * 4].height/2){
			minute[i * 2] = num;
			console.log("in Box 2");
			pinnedNumber[reference] = true;
		}
		if(obj.position.x > box[3 + + i * 4].position.x && 
		 obj.position.x < box[3 + + i * 4].position.x + box[3 + + i * 4].width &&
		 obj.position.y > box[3 + + i * 4].position.y - box[3 + i * 4].height/2 &&
		 obj.position.y < box[3 + + i * 4].position.y + box[3 + + i * 4].height/2){
			minute[i * 2 + 1] = num;
			console.log("in Box 3");
			pinnedNumber[reference] = true;
		}
	}
	//remove the number after 5 seconds
	var something = setInterval(function(){
		if(pinnedNumber[reference] == false){
			//removes the last clone
			stage.removeChild(clonedNumber[reference]);
		}
	},5000);
}

function checkAlarm(){
	for (var i = 0; i < newAlarmPos; i++) {
		if(hour[i * 2] == currentHour[0] && hour[i * 2 + 1] == currentHour[1] && minute[i * 2] == currentMinute[0] && minute[i * 2 + 1] == currentMinute[1] && playAlarm == false && stopAlarm == false){
			console.log("Clock set to current time, used for testing");
			//play alarm
			playAlarm = true;
		 }
	 }
	 
	 if(playAlarm == true && stopAlarm == false){
		audio.play();
	 }
	 else{
		playAlarm = false;
		audio.pause();
	 }
}

function addAlarm(){
	//alarm text
	var addAlarmText = new PIXI.Text("Add Alarm", {font:"50px Arial", fill:"red"});
	addAlarmText.position.x = window.innerWidth/2 - addAlarmText.width/2;
	addAlarmText.position.y = newAlarmPos * 100 + 100;
	
	//alarm box
	newAlarmBox = new PIXI.Graphics();
	newAlarmBox.beginFill(0xFFFFFF);
	newAlarmBox.lineStyle(5, 0x000000);
	newAlarmBox.position.x = window.innerWidth/2 - addAlarmText.width/2;
	newAlarmBox.position.y = newAlarmPos * 100 + 100;
	newAlarmBox.drawRect(0, 0, addAlarmText.width, addAlarmText.height);
	
	stage.addChild(newAlarmBox);
	stage.addChild(addAlarmText);
	
	//make the box interactive
	newAlarmBox.interactive = true;
	newAlarmBox.buttonMode = true;
	newAlarmBox.mousedown = newAlarmBox.touchstart = function(data){
		if(alarmLimit > 1){
			alarmLimit -= 1;
			this.data = data;
			newAlarmPos += 1;
			createBoxes();
			newAlarmBox.clear();
			stage.removeChild(addAlarmText) 
			addAlarm();	
		}
	};
}

function stopAlarmButton(){

}

//AMY CHANGE THESE VALUES USING THE PHONE GYRO, MAINLY 'DIRECTION' AND velX AND velY
function moveNumbers(x, reference){
		//rotate the numbers
		var direction = -0.1;
		var rotateVar = setInterval(function(){
			if(pinnedNumber[reference] == false){
				if(x.rotation > 0.5){
					direction *= -1;
				}
				if(x.rotation < -0.5){
					direction *= -1;
				}
				x.rotation += direction;
			}
		},100);

		//move position
		var velX = Math.random() * (5 - 1 + 1);
		var velY = Math.random() * (5 - 1 + 1);
		var plusOrMinus = Math.random() < 0.5 ? -1 : 1; //randomize velocity direction
	
		var velVar = setInterval(function(){
			if(pinnedNumber[reference] == false){
				x.position.x += velX * plusOrMinus;
				x.position.y += velY* plusOrMinus;
				//reverse direction if it hits an area
				if(x.position.x > window.innerWidth || x.position.x < 0){
					velX *= -1;
					console.log("hit");
				}
				// if(x.position.y > window.innerHeight || x.position.y < window.innerHeight - 200){
					// velY *= -1;
					// console.log("hit");
				// }
			}
		},100);
}

function animate() {
	requestAnimFrame( animate );
	renderer.render(stage);
}

//update timer every one second
var myVar=setInterval(function(){
		timer(), checkAlarm();
},1000);
addAlarm();
createBoxes();
createNumbers();
init();
animate();


