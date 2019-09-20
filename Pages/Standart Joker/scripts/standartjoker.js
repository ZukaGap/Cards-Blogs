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

function playRound(){
	if(roundOver)
	{
		liveScore();

		if(round === 8 || round === 12 || round === 20 || round === 24 )
			writeScores(round);

		round++;
		turnCount = 0;
		roundOver = false;
		validateButtons();
		wagebuliCount = 0;
		wasagebiCount = 0;
	}
	if(round < 24)
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

function calcOutcome(){
	callBtns[callBtns.length - 1 - wasagebiCount].setAttribute("disabled", true);
}

//--------------------DISPLAY FUNCTIONS----------------------

function writeScores(round){
	var player;	
	var scoreDisplay;
	for(var i = 0; i < 4; i++)
	{
		player = players[i];
		player.score = roundDecOne(player.score);
		switch(round)
		{
			case 8:
			{				
				scoreDisplay = player.scoreDisplays[0];
			}
			break;
			case 12:
			{				
				scoreDisplay = player.scoreDisplays[1];
			}
			break;
			case 20:
			{				
				scoreDisplay = player.scoreDisplays[2];
			}
			break;
			case 24:
			{				
				scoreDisplay = player.scoreDisplays[3];
			}
			break;
		}	

		if(round === 8)
		{
			lastQuarterScore = 0;
		}
		else if(round === 12)
		{
			lastQuarterScore = Number(player.scoreDisplays[0].innerHTML);
		}	
		else if(round === 20)
		{
			lastQuarterScore = Number(player.scoreDisplays[1].innerHTML);
		}	
		else if(round === 24)
		{
			lastQuarterScore = Number(player.scoreDisplays[2].innerHTML);
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