//premiaze gasvla moshlis setingebi
// ujraze orjer daklikebisas shegvedzlos monacemis chasworeba an msgavsi ram sityvaze ro shegveshalos ramdenis wageba gvinda

//--------------------VARIABLES----------------------

const names = document.querySelectorAll("thead input"),
shuffleBtn = document.getElementById("shuffle"),
startBtn = document.getElementById("start"),
callBtns = document.querySelectorAll("aside table button"),
xishti = document.getElementById("xishti"),
timer = {
	minutes: 0,
	minutesDispaly: document.getElementById("minutes"),
	seconds: 0,
	secondsDisplay: document.getElementById("seconds"),
	keys: [null, null],
	update: (display, value) => display.innerHTML = value,
	start: function(){
		this.keys[0] = setInterval( () => {
			this.seconds = -1; // so the seconds will display 0 and not 
			this.update(this.minutesDispaly, ++this.minutes);
		}, 60000);
		this.keys[1] = setInterval( () => {
			this.update(this.secondsDisplay, ++this.seconds);
		}, 1000);
	},
	stop: function(){this.keys.forEach( (key) => clearInterval(key))}
}
players = [player1 = {	id: 0, score:0	}, player2 = {	id: 1, score:0	}, player3 = {	id: 2, score:0	}, player4 = {	id: 3, score:0	}];

let round = 0,
turn = 0,
activePlayer = null,
roundOver = false,
turnCount = 0,
wagebuliCount = 0,
wasagebiCount = 0;

//----------------------------------------------------------------------

init();

//----------------------------------------------------------------------

function init(){
	players.forEach(function(player)
	{
		player.calls = document.querySelectorAll("td:nth-of-type(" + (player.id + 2) + ") input:nth-of-type(1)");
		player.results = document.querySelectorAll("td:nth-of-type(" + (player.id + 2) + ") input:nth-of-type(2)");
		player.scoreDisplays = document.querySelectorAll(".scores th:nth-of-type(" + (player.id + 2) +")");
	})

	startBtn.addEventListener("click",function(){
		if(xishti.value !== "")
		{
			if(xishti.classList.contains("required"))
				xishti.classList.remove("required");
			toggleBtns(false);
			timer.start();
			play();
		}
		else 
		{
			xishti.focus();
			xishti.classList.add("required");
		}
	});

	callBtns.forEach(function(call){
		call.addEventListener("click", function(){
			if(activePlayer !== null && round < 16){				
				if(turnCount < 4)
				{
					activePlayer.calls[round].value = call.value;
					activePlayer.calls[round].classList.remove("turn");
					wasagebiCount += call.value === "პასი" ? 0 : Number(call.value);
				}
				else if(turnCount > 3)
				{
					addScore(activePlayer.calls[round].value, call.value);
					activePlayer.calls[round].classList.remove("live");
				}
				turnCount++;
				if(turnCount === 8)
				{
					roundOver = true;
				}
				turn++;
				playRound();
			}

		});
	})

	checkNames();
	shuffle();
}

function play(){
	playRound();
}

//--------------------INIT FUNCTIONS----------------------

function checkNames()
{
	var count = 0;
	names.forEach(function(name)
	{
		name.addEventListener("focusout", function()
		{
			if(this.value !== "" && isUnique(this.value))
			{
				this.classList.contains("required") ? this.classList.remove("required") : null;
				this.setAttribute("disabled", true);
				count++;
				if(count === 3)
					listenToLastInput();
			}
			else{
				this.classList.add("required");
			}
		});
	});
};

function isUnique(name){
	var count = 0;
	var unique = true;
	names.forEach(function(otherName){
		if(name === otherName.value){
			count++;
			if(count === 2){
				unique = false;
			}
		}
	});
	return unique;
}

function shuffle()
{
	shuffleBtn.addEventListener("click",function()
	{
		this.setAttribute("disabled", true);
		var first = Math.floor(Math.random()*4);
		for(var i=0; i < first; i++){
			for(var j=1; j < names.length; j++)
			{
				names[j-1].value = [names[j].value, names[j].value = names[j-1].value][0];
			}			
		}

	});
};

function listenToLastInput(){
	names.forEach(function(name){
		if(name.value === ""){
			name.addEventListener("keyup", function(){
				if(this.value !== "" && isUnique(this.value))
					toggleBtns(true)
				else
					toggleBtns(false);
			})
		}
	});
}

function toggleBtns(enable){
	if(enable){
		shuffleBtn.removeAttribute("disabled");
		startBtn.removeAttribute("disabled");
	}
	else{
		shuffleBtn.setAttribute("disabled", true);
		startBtn.setAttribute("disabled", true);
	}
}

//--------------------GAME FUNCTIONS----------------------

function playRound(){
	if(roundOver)
	{
		liveScore();

		if((round + 1) % 4 === 0)
			writeScores();

		round++;
		turnCount = 0;
		roundOver = false;
		validateButtons();
		wagebuliCount = 0;
		wasagebiCount = 0;
	}
	if(round < 16)
	{
		activePlayer = players[(round + turn) % 4];
		if(turnCount < 4){
			activePlayer.calls[round].classList.add("turn");
			if(turnCount === 3 && wasagebiCount <= 9)
				calcOutcome();
		}
		else if(turnCount === 7){
			autoFill(false);
		}
		else {
			if(turnCount === 4)
				validateButtons();
			activePlayer.calls[round].classList.add("live");
		}
			
	}
	else
	{
		timer.stop();
		console.log("Game Over");
	}
}

function addScore(wasagebi,wagebuli,player=activePlayer)
{
	player.calls[round].value += " - " + wagebuli;
	var score = 0;

	if( wasagebi !== "პასი" && wagebuli === "პასი")
	{
		score -= Number(xishti.value);
		player.results[round].classList.add("fail-full");
	}
	else if(Number(wasagebi) === 9 && Number(wagebuli) === 9)
	{
		score = 900; 
		player.results[round].classList.add("success-full");
	}
	else if(wasagebi === wagebuli)
	{
		score = wasagebi === "პასი" ? 50 : wagebuli * 50 + 50;
		player.results[round].classList.add("success");
	}
	else
	{
		score= wagebuli * 10;
		player.results[round].classList.add("fail-half");
	}

	player.results[round].value = score;
	player.score += score / 100;

	if(wagebuli !== "პასი")
	{
		validateButtons(false,wagebuli);
		wagebuliCount+=Number(wagebuli);
	}
	if(wagebuliCount === 9 && wasagebi !== null){
		autoFill();
	}
}

function validateButtons(enable=true,wagebuli = 0)
{
	for(var i = 0; i < wagebuli; i++)
	{
		callBtns[callBtns.length - 1 - i - wagebuliCount].setAttribute("disabled", true);
	}

	if(enable)
	{
		callBtns.forEach(function(call){
			call.removeAttribute("disabled");
		});
	}
}

function autoFill(all=true){
	roundOver = true;
	if(all){
		players.forEach(function(player){
			if(player.results[round].value === ""){
				addScore(player.calls[round].value, "პასი", player);
				turn++;
			}
		})
	}
	else{
		if (9 === wagebuliCount)
			addScore(activePlayer.calls[round].value, "პასი");
		else
			addScore(activePlayer.calls[round].value, String(9 - wagebuliCount));
		turn++;
		playRound();
	}
}

function calcOutcome(){
	callBtns[callBtns.length - 1 - wasagebiCount].setAttribute("disabled", true);
}

//--------------------DISPLAY FUNCTIONS----------------------

function writeScores(){
	var player;
	var quarter = Math.floor(round / 4);
	var lastQuarterScore;
	var scoreDisplay;
	for(var i = 0; i < 4; i++){
		player = players[i];
		player.score = roundDecOne(player.score);
		scoreDisplay = player.scoreDisplays[quarter];
		if(quarter === 0){
			lastQuarterScore = 0;
		}
		else{
			lastQuarterScore = Number(player.scoreDisplays[quarter - 1].innerHTML);
		}
		if(player.score > lastQuarterScore){
			scoreDisplay.classList.add("better");
		}
		else if(player.score < lastQuarterScore){
			scoreDisplay.classList.add("worse");
		}
		scoreDisplay.innerHTML = player.score;
	}
}


function liveScore()
{
	var player;
	var scoreDisplay;
	let bestScore = 0;
	let lowerScore = 0;
	for(var k=0;k<4;k++)
	{
		lowerScore = roundDecOne(players[k].score);
		if(bestScore < lowerScore)
		{
			bestScore = lowerScore;
		}
	}

	for(var i = 0; i < 4; i++)
	{
		player = players[i];
		player.score = roundDecOne(player.score);
		scoreDisplay = player.scoreDisplays[4];
		
		if(bestScore === player.score)
		{
			scoreDisplay.classList.contains("worse") ? scoreDisplay.classList.remove("worse") : null;
			scoreDisplay.classList.add("better");
		}			
		else
		{
			scoreDisplay.classList.contains("better") ? scoreDisplay.classList.remove("better") : null;
			scoreDisplay.classList.add("worse");	
		}		

		scoreDisplay.innerHTML = player.score;
	}
}

//--------------------MATH FUNCTIONS----------------------

function roundDecOne(value) {
	return Number(Math.round(value+'e'+1)+'e-'+1);
}