// tamashis dro atuzvidan dasrulebamde
// dro tito xels ramdeni dautmes
// vinc xelshi gafuchda da tavisi ver waigo grafa gawitldes da wagebuli gamwvandes
// modzravi fokusi unda gawitldes tu ver waiyvana tavisi shevsebis dros(wayvanis shevseba)
// bolo kacze avtomaturad sheitanos wagebuli kartebis odenoba 

var names = document.querySelectorAll("thead input");
var shuffleBtn = document.getElementById("shuffle");
var startBtn = document.getElementById("start");
var calls = document.querySelectorAll("td input:first-of-type");
var results = document.querySelectorAll("td input:nth-of-type(even)");
var callBtns = document.querySelectorAll("aside table button");
var xishti = document.getElementById("xishti");
var players = [player1 = {	id: 1, score:0	}, player2 = {	id: 2, score:0	}, player3 = {	id: 3, score:0	}, player4 = {	id: 4, score:0	}];
var gotNames = false;
var started = false;
var round = 0;
var turn = 0;
var activePlayer = null;
var roundOver = false;
var turnCount = 0;
var wagebuliCount = 0;

//----------------------------------------------------------------------

init();

//----------------------------------------------------------------------

function init(){
	players.forEach(function(player)
	{
		console.log(player.id);
		player.calls = document.querySelectorAll("td:nth-of-type("+(player.id+1)+") input:nth-of-type(1)");
		player.results = document.querySelectorAll("td:nth-of-type("+(player.id+1)+") input:nth-of-type(2)");
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
					
				}
				else if(turnCount > 3)
				{
					addScore(activePlayer.calls[round].value, call.value);
					activePlayer.calls[round].value +=" - " + call.value;
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
				console.log(gotNames);
				enableBtns(gotNames);
			}
		});
	});
};

function shuffle()
{
	shuffleBtn.addEventListener("click",function()
	{
		console.log("shuffled");
		this.style.backgroundColor="green";
		this.setAttribute("disabled", true);
		var first = Math.floor(Math.random()*4);
		console.log("First Player: ",first+1);
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
		round++;
		turnCount = 0;
		roundOver = false;
		validateButtons();
		wagebuliCount = 0;
	}
	if(round < 16)
	{
		activePlayer = players[(round + turn) % 4];
		if(turnCount < 4)
			activePlayer.calls[round].classList.add("turn");
		else 
			activePlayer.calls[round].classList.add("live");
	}
	else
	{
		console.log("Game Over");
	}
}

function addScore(wasagebi,wagebuli)
{
	console.log(activePlayer+"movida");
	var score = 0;

	if( wasagebi === 9 && wagebuli === 9 )
	{
		score = 900; 
	}
	else if(wasagebi !== "პასი" && wagebuli === "პასი")
	{
		score -= Number(xishti.value);
	}
	else if(wasagebi === wagebuli)
	{
		score = wasagebi === "პასი" ? 50 : wagebuli * 50 + 50;
	}
	else
	{
		score= wagebuli * 10;
	}
	console.log(score);
	activePlayer.results[round].value = score;
	activePlayer.score += score;

	if(wagebuli !== "პასი")
	{
		validateButtons(false,wagebuli);
		wagebuliCount+=Number(wagebuli);
		console.log(wagebuliCount);
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