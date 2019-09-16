// tamashis dro atuzvidan dasrulebamde
// dro tito xels ramdeni dautmes
// vinc xelshi gafuchda da tavisi ver waigo grafa gawitldes da wagebuli gamwvandes

var names = document.querySelectorAll("thead input");
var shuffleBtn = document.getElementById("shuffle");
var startBtn = document.getElementById("start");
var calls = document.querySelectorAll("td input:first-of-type");
var results = document.querySelectorAll("td input:nth-of-type(even)");
var callBtns = document.querySelectorAll("aside table button");
var players = [player1 = {	id: 1	}, player2 = {	id: 2	}, player3 = {	id: 3	}, player4 = {	id: 4	}];
var gotNames = false;
var started = false;
var round = 0;
var turn = 0;
var activePlayer = null;

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
		this.setAttribute("disabled", true);
		play();
	});

	checkNames();
	shuffle();
}

function play(){
	activePlayer = players[0];
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
	activePlayer.calls[round].classList.add("turn");
	makeCall();
}

function makeCall(){
	callBtns.forEach(function(call){
		call.addEventListener("click", function callClick(){
			turn++;
			activePlayer.calls[round].value = call.value;
			activePlayer.calls[round].classList.remove("turn");
			// removeListeners();
			// if(turn > 0 && turn % 4 !== 0){
			// 	activePlayer = players[round + (turn % 4)];
			// 	playRound();
			// }
		});
	})
}

// function removeListeners(){
// 	callBtns.forEach(function(call){
// 		console.log("removed from", call.value);
// 		call.removeEventListener("click", callClick, true);
// 	});
// }