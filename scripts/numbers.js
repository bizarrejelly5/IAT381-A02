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
var box = [];
var refNumber = [];
var hour = [];
var minute = [];
var currentTime = new Date();
var currentHour = "" + currentTime.getHours() + "";
if(currentHour.length == 1){
	currentHour = "0" + currentTime.getHours() + "";
}
var currentMinute = "" + currentTime.getMinutes() + "";
if(currentMinute.length == 1){
	currentMinute = "0" + currentTime.getMinutes() + "";
}

//put the number[i]s on the bottom of the screen
function createNumbers()
{	
	for (var i=0; i < 10; i++) {
		//store what number[i] it actually is so we can use it for the clock
		refNumber[i] = i;
		
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

		// use the mousedown and touchstart
		number[i].mousedown = number[i].touchstart = function(data)
		{
			this.data = data;
			this.alpha = 0.9;
			this.dragging = true;
		};
		
		// set the events for when the mouse is released or a touch is released
		number[i].mouseup = number[i].mouseupoutside = number[i].touchend = number[i].touchendoutside = function(data)
		{
			this.alpha = 1
			this.dragging = false;
			// set the interaction data to null
			this.data = null;
		};
		
		// set the callbacks for when the mouse or a touch moves
		number[i].mousemove = number[i].touchmove = function(data)
		{
			if(this.dragging)
			{
				// need to get parent coords..
				var newPosition = this.data.getLocalPosition(this.parent);
				this.position.x = newPosition.x;
				this.position.y = newPosition.y;
				intersect();
			}
		}
		
		// move the sprite to its designated position
		number[i].position.x = i * window.innerWidth/10 + 50;
		number[i].position.y = window.innerHeight - 100;
		
		// add it to the stage
		stage.addChild(number[i]);
	}
}

function createBoxes(){
	//make a box that user puts the number[i]s in

	for(var i = 0; i < 4; i++){
		box[i] = new PIXI.Graphics();
		box[i].beginFill(0xFFFFFF);
		box[i].lineStyle(5, 0x000000);
		box[i].position.x = i * 250 + 200;
		box[i].position.y = 100;
		box[i].drawRect(0, 0, 150, 150);
		stage.addChild(box[i]);
		console.log(box[i].width);
	}
}


function intersect(){
	//bounding box to determine if a number is in a box
	for (var i = 0; i < 10; i++) {
		//for the first box
		 if(number[i].position.x > box[0].position.x && 
		 number[i].position.x < box[0].position.x + box[0].width &&
		 number[i].position.y > box[0].position.y &&
		 number[i].position.y < box[0].position.y + box[0].height){
			hour[0] = refNumber[i];
		}
		 if(number[i].position.x > box[1].position.x && 
		 number[i].position.x < box[1].position.x + box[1].width &&
		 number[i].position.y > box[1].position.y &&
		 number[i].position.y < box[1].position.y + box[1].height){
			hour[1] = refNumber[i];
		}
		 if(number[i].position.x > box[2].position.x && 
		 number[i].position.x < box[2].position.x + box[2].width &&
		 number[i].position.y > box[2].position.y &&
		 number[i].position.y < box[2].position.y + box[2].height){
			minute[0] = refNumber[i];
		}
		 if(number[i].position.x > box[3].position.x && 
		 number[i].position.x < box[3].position.x + box[3].width &&
		 number[i].position.y > box[3].position.y &&
		 number[i].position.y < box[3].position.y + box[3].height){
		//	number[i].position.x = box[j];
			minute[1] = refNumber[i];
		}
	}

	 if(hour[0] == currentHour[0] && hour[1] == currentHour[1] && minute[0] == currentMinute[0] && minute[1] == currentMinute[1]){
		 console.log("Clock set to current time, used for testing");
	 }
}


function animate() {
	requestAnimFrame( animate );
	renderer.render(stage);
}


createBoxes();
createNumbers();

