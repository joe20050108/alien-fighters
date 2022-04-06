var map = { //map variable IMPORTANT!!!!!
    r: [
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
        {c:["","","","","","","","","","","","","","","","","","","","","","",]},
    ]
}

//################################
//## MAP HANDLER CODE ############
//################################
//Funny how this function doesnt even need the above function. That one is just useless now.
var rowedMap = []; //Stores the map with all the rows combined. (Used for the \n joining code.)
function rowMap() { //Combine arrayedMap NEW: map!! into rows.
    for (var i = 0; i < 20; i++) {
        var temporaryColumn = [];
        for (var x = 0; x < 20; x++) {
          temporaryColumn[x] = map.r[i].c[x];
        }
        rowedMap[i] = temporaryColumn.join("");
    }
}

function editMap(row, column, value) { //edit a coordinate of the map.
    map.r[row].c[column] = value;
}

//execute this function any time something in the game happens.
function updateDisplay() { //updates the display of the 
    rowMap();
    renderMap();
}

function renderMap() {
    setProperty("mapArea", "text", rowedMap.join("\n"));
}

function faker() { //useful for setTimeouts
  var x = 1;
  x = x;
}

//#################################
//###game running code goes here###
//#################################
//test
for (var i = 0; i < 20; i++) {
  for (var x = 0; x < 20; x++) {
    map.r[i].c[x] = "   ";
  }
}
//refresh the display
updateDisplay();

//test an artifact
editMap(19, 5, "☹");
updateDisplay();

/*for(var i = 0; i < 19; i++) {
  editMap(19, i, i);
  setTimeout(faker(), 500);
  updateDisplay();
}*/

//function which adds an alien somewhere on the screen.
function addAlien() {
  //we also need to only execute this like every 5 times
  //code for this was added to willSpawn
  var spawns = willSpawn();
  if(spawns == true) {
    var x = randomNumber(0,13);
    var y = randomNumber(0,19);
    editMap(x, y, "☹");
    //editMap(x,y,cycle);
    updateDisplay();
    motivate("A frowny face has appeared!\n Go take it down commander!")
  }
  else if(spawns == false) {
    //do absolutely nothing
  }
}

var cycle = 0; //cycle 1-N/A for time the alien needs to spawn
function willSpawn() { //creates the 50% chance an alien will not spawn.
  var spawnableNumber = randomNumber(1,100);
  if (cycle == 300) {
    if(spawnableNumber % 2 == 0) {
      cycle = 0;
      return true;
    }
    else if(spawnableNumber % 2 == 1) {
      return false;
    }
  }
  cycle++;
}


//clear the map
function clearMap() {
  for (var i = 0; i < 20; i++) {
    for (var x = 0; x < 20; x++) {
      map.r[i].c[x] = "   ";
    }
  }
  updateDisplay();
}

function animateLaser(row,column,length) {//renders a laser gun animation(start = starting coorinate, length = length of laser)
  editMap(row, column, "|");
  updateDisplay();
  //annoying timed loop
  var counter = 0;
  timedLoop(30, function() {
    if(counter == length) { //exit and delete leftover artifacts
      stopTimedLoop();
      //return execution to gameLoop. MUST BE USED FOR ANY TIME LOOP.
      //gameLoop();
      editMap(row - counter, column, "   ");
      updateDisplay();
    }
    else {
      counter++;
      editMap(row - counter, column, "|")
      editMap(row - counter + 1, column, "   ");
      updateDisplay();
    }
  });
}
//event listeners
onEvent("screen1", "keypress", function(event) {
  if(event.key == "a") {
    moveLittleGuy("left");
  }
  else if(event.key == "d") {
    moveLittleGuy("right");
  }
  else if(event.key == "l") {
    attackAlien();
  }
  else if(event.key == "h") {
    autoPlay();
  }
  else if(event.key == "o") {
    motivate("H = demo\nA = left\nD = right\nL = attack");
  }
  else if(event.key == "j") { //J stops the demo code from running and restarts game.
    if(selfPlayingInterval != undefined) {
      clearInterval(selfPlayingInterval);
      editMap(18,0,"   ");
      updateDisplay();
    }
  }
});
//var heroIcon = "¯\\_(ツ)_/¯"
var heroIcon = "^";
var position = [17,10]; //start position of the character(smiley face)
function moveLittleGuy(direction) { //moves the guy based on the event listeners
  if(direction == "left") {
    editMap(position[0], position[1], "   ");
    position[1] = position[1] - 1;
    editMap(position[0], position[1], heroIcon);
    updateDisplay();
    motivate("Searching for frowny faces...");
  }
  else if (direction == "right") {
    editMap(position[0], position[1], "   ");
    position[1] = position[1] + 1;
    editMap(position[0], position[1], heroIcon);
    updateDisplay();
    motivate("Searching for frowny faces...")
  }
}
function createHero() {
  //position = [17,10]; //start position
  //editMap(position[0], position[1], "¯\\_(ツ)_/¯");
  editMap(position[0], position[1], heroIcon);
  updateDisplay();
}

//attack a meanie
function attackAlien() {
  for (var i = 0; i < 20; i++) { //search the row and check if there is an alien or not.
    if(map.r[i].c[position[1]] == "☹") {
      //console.log("bad found");
      editMap(i,position[1],"X");
      animateLaser(position[0] - 1,position[1],position[0] - i - 1);
      updateDisplay();
      motivate("The frowny face is now eliminated!")
      break;
    }
    else {
      motivate("No frowny faces here, no need to waste my laser power!")
    }
  }
  //be sure to clean up artifacts left over from previous attacks
  setTimeout(function() {
    for (var i = 0; i < 20; i++) {
      for (var x = 0; x < 20; x++) {
        if(map.r[i].c[x] == "|" || map.r[i].c[x] == "X") {
          editMap(i,x,"   ");
        }
      }
    }
  }, 500);
}


//cleaner function(more like a bug fixer) 


//winner function(you dont win so you dont get to see it!)
function winner() { //also this function is very broken.
  for(var x = 0; x < 18; x++) {
    animateLaser(19,x,19);
  }
}

//change the motivation text.
function motivate(text) {
  setProperty("motivator", "text", text);
}

//this function is MILDLY ANNOYING even though its
//concept is the same of animateLaser, except it has TWO
//timed loop to do array pattern nonsense
function testBulkAnim() {
  var x = 0;
  var y = 0;
  /* for(blah blah blah) --> timedLoop --> WITHIN THE TIMED LOOP
  the for(blah blah blah) for each row of characters blah blah blah*/
}


var selfPlayingInterval; //stores inverval id for selfPlay.
function autoPlay() {
  editMap(18,0,"Demo Mode");
  updateDisplay();
  selfPlayingInterval = setInterval(selfPlay, 300);
}
function selfPlay() {//makes the game play itself I guess?
  //console.log("Executing on auto.");
  editMap(18,0,"Demo Mode");
  for (var i = 0; i < 20; i++) { //check for frowny faces on its own
    for (var x = 0; x < 20; x++) {
      if(map.r[i].c[x] == "☹") { //if a frowny face was found, go to it.
        goToFrownAndAttack(i,x);
        break; //break loop so that it doesnt shoot multiple frowney faces at once.
      }
      else { //do absolutely nothing.
        //break;
        continue;
      }
    }
  }
  function goToFrownAndAttack(i,x) { //internal function for automatically going to a frowny face.
    var xx = x; //try to fix a bug that didn't even need to be fixed.
    //spoilers: i gave up
    timedLoop(50, function() {
      if(position[1] != x) {
        //motivate("position not match x")
        if(position[1] > x) {
          //motivate("going to frowny");
          moveLittleGuy("left");
        }
        else if(position[1] < x) {
          moveLittleGuy("right");
        }
      }
      else if(position[1] == x) {
        editMap(i,position[1],"X");
        stopTimedLoop();
        //attack
        animateLaser(position[0] - 1,position[1],position[0] - i - 1);
      }
    });
  }
}






//######################
//code runner
function startUpAnim() {
  var counter = 0;
  timedLoop(50, function(){
    counter++;
    if(counter == 12) { //exit our makeshift for loop
      stopTimedLoop(); //exit timedloop
      //pass execution to postInitailize.
      clearMap();
    }
    else {
      clearMap();
      updateDisplay();
      editMap(10,counter,"Hello there! :D");
      updateDisplay();
    }
  });
}
initialize();
function initialize() {
  //starts the game up.
  startUpAnim();
  clearMap();
  motivate("Lets get those evil frowny faces!\n Get ready to enter the arena commander!\n Press 'O' for key layout.");
  setTimeout(function() {
    motivate("H = demo, J = stop demo\nA = left\nD = right\nL = attack");
    clearMap();
    updateDisplay();
  },1200);
  setTimeout(function() { //give time for animation to run before refreshing and executing game.
    clearMap();
    updateDisplay();
    createHero();
    gameLoop();
    motivate("Look for the frowny faces and\n take them out! GO! GO! GO!");
  }, 6000); //i increased this so people can read the first motivation message.
}
function gameLoop() {
  /*timedLoop(1, function() {
    addAlien();
  });*/
  //timedGameLoop();
  setInterval(timedGameLoop, 10);
}
function timedGameLoop() {
  addAlien();
}
