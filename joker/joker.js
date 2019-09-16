// tamashis dro atuzvidan dasrulebamde
// dro tito xels ramdeni dautmes

var names = document.querySelectorAll("thead input");
var calls = document.querySelectorAll("td input:first-of-type");
var results = document.querySelectorAll("td input:nth-of-type(even)");
var shuffleBtn = document.getElementById("shuffle");
var startBtn = document.getElementById("start");
var callBtns = document.querySelectorAll("aside table button");
var xishti = document.getElementById("xishti");
var players = [player1 = {	id: 0, score:0	}, player2 = {	id: 1, score:0	}, player3 = {	id: 2, score:0	}, player4 = {	id: 3, score:0	}];
var gotNames = false;
var started = false;
var round = 0;
var turn = 0;
var activePlayer = null;
var roundOver = false;
var turnCount = 0;
var wagebuliCount = 0;
var wasagebiCount = 0;

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
			this.setAttribute("disabled", true);
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
			if(this.value !== "")
			{
				this.setAttribute("disabled", true);
				count++;
				gotNames = count ===  4 ? true : false;
				enableBtns(gotNames);
			}
		});
	});
};

function shuffle()
{
	shuffleBtn.addEventListener("click",function()
	{
		this.style.backgroundColor="green";
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

function enableBtns(){
	if(gotNames){
		shuffleBtn.removeAttribute("disabled");
		startBtn.removeAttribute("disabled");
	}
}

//--------------------GAME FUNCTIONS----------------------

function playRound(){
	if(roundOver)
	{
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
			addScore(activePlayer.calls[round].value, 9 - wagebuliCount);
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

//--------------------MATH FUNCTIONS----------------------

function roundDecOne(value) {
	return Number(Math.round(value+'e'+1)+'e-'+1);
}