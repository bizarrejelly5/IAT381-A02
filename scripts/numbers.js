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


//set the timer
var text = new PIXI.Text(currentHour + " : " + currentMinute, {font:"50px Arial", fill:"red"});

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
		}
		
		// move the sprite to its designated position
		number[i].position.x = i * window.innerWidth/10 + 50;
		number[i].position.y = window.innerHeight - 100;
		
		// add it to the stage
		stage.addChild(number[i]);
};

function duplicateNumber(x){
	var texture = PIXI.Texture.fromImage("images/" + x + ".png");
	clonedNumber[x] = new PIXI.Sprite(texture);
	
	clonedNumber[x].interactive = true;
	clonedNumber[x].buttonMode = true;
	
		// make it a bit bigger, so its easier to touch
	clonedNumber[x].scale.x = clonedNumber[x].scale.y = screen.width/10000;
	clonedNumber[x].position.x = x * window.innerWidth/10 + 50
	clonedNumber[x].position.y = window.innerHeight - 100;
	
	clonedNumber[x].mousedown = clonedNumber[x].touchstart = function(data)
		{
			this.data = data;
			this.alpha = 0.9;
			this.dragging = true;
		}
		
		clonedNumber[x].mouseup = clonedNumber[x].mouseupoutside = clonedNumber[x].touchend = clonedNumber[x].touchendoutside = function(data)
		{
			this.alpha = 1
			this.dragging = false;
			// set the interaction data to null
			this.data = null;
			intersect(clonedNumber[x], x);
		};
		clonedNumber[x].mousemove = clonedNumber[x].touchmove = function(data)
		{
			if(this.dragging)
			{
				// need to get parent coords..
				var newPosition = this.data.getLocalPosition(this.parent);
				clonedNumber[x].position.x = newPosition.x;
				clonedNumber[x].position.y = newPosition.y;
			}
		}
		stage.addChild(clonedNumber[x]);
}

function createBoxes(){
	//make a box that user puts the number[i]s in
	for(var i = 0; i < 4; i++){
		box[i] = new PIXI.Graphics();
		box[i].beginFill(0xFFFFFF);
		box[i].lineStyle(5, 0x000000);
		box[i].position.x = i * 250 + 200;
		box[i].position.y =  newAlarmPos * 100;
		box[i].drawRect(0, 0, 75, 75);
		stage.addChild(box[i]);

		//wtf it needs console to work 
		console.log(box[i].height);
	}
}


function intersect(obj, num){
	//bounding box to determine if a number is in a box
	
	//currently only the 0 number works, need to make it so that they all work by changing number[i][0] to something like number[i][x]
	 console.log("num pos x: " + obj.position.x + " num pos y: " + obj.position.y);
	 console.log("box pos x: " + box[0].position.x + " box pos y: " + box[0].position.y);
	 console.log("box width: " + box[0].width + "box height: " + box[0].height);
	
	for (var i = 0; i < 10; i++) {
		if(obj.position.x > box[0].position.x && 
		 obj.position.x < box[0].position.x + box[0].width &&
		 obj.position.y > box[0].position.y &&
		 obj.position.y < box[0].position.y + box[0].height){
			hour[0] = num;
			console.log("it works");
		}
		 if(obj.position.x > box[1].position.x && 
		 obj.position.x < box[1].position.x + box[1].width &&
		 obj.position.y > box[1].position.y &&
		 obj.position.y < box[1].position.y + box[1].height){
			hour[1] = num;
		}
		 if(obj.position.x > box[2].position.x && 
		 obj.position.x < box[2].position.x + box[2].width &&
		 obj.position.y > box[2].position.y &&
		 obj.position.y < box[2].position.y + box[2].height){
			minute[0] = num;
		}
		 if(obj.position.x > box[3].position.x && 
		 obj.position.x < box[3].position.x + box[3].width &&
		 obj.position.y > box[3].position.y &&
		 obj.position.y < box[3].position.y + box[3].height){
			minute[1] = num;
		}
		
	}
}

function checkAlarm(){
	//needs console from above to work wtf
	//console.log(minute[1]);
	if(hour[0] == currentHour[0] && hour[1] == currentHour[1] && minute[0] == currentMinute[0] && minute[1] == currentMinute[1]){
		console.log("Clock set to current time, used for testing");
		//add some functionality to adding new alarm, deleting alarm
	 }
}


function animate() {
	requestAnimFrame( animate );
	renderer.render(stage);
}

function addAlarm(){
	//alarm text
	var addAlarmText = new PIXI.Text("Add Alarm", {font:"50px Arial", fill:"red"});
	addAlarmText.position.x = window.innerWidth/2 - 75;
	addAlarmText.position.y = newAlarmPos * 100 + 100;
	
	//alarm box
	newAlarmBox = new PIXI.Graphics();
	newAlarmBox.beginFill(0xFFFFFF);
	newAlarmBox.lineStyle(5, 0x000000);
	newAlarmBox.position.x = window.innerWidth/2 - 75;
	newAlarmBox.position.y = newAlarmPos * 100 + 100;
	newAlarmBox.drawRect(0, 0, addAlarmText.width, addAlarmText.height);
	
	stage.addChild(newAlarmBox);
	stage.addChild(addAlarmText);
	
	//make the box interactive
	newAlarmBox.interactive = true;
	newAlarmBox.buttonMode = true;
	newAlarmBox.mousedown = newAlarmBox.touchstart = function(data){
		this.data = data;
		newAlarmPos += 1;
		console.log(newAlarmPos);
		createBoxes();
		newAlarmBox.clear();
		stage.removeChild(addAlarmText) 
		//remove and then add numbers back to front of the canvas
		for (var i=0; i < 10; i++) {
			stage.removeChild(number[i]);
		}
		addAlarm();
	};
}


//update timer every one second
var myVar=setInterval(function(){
		timer(), checkAlarm();
},1000);
addAlarm();
createBoxes();
createNumbers();
init();

