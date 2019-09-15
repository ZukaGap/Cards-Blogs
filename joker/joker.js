// tamashis dro atuzvidan dasrulebamde
// dro tito xels ramdeni dautmes
// vinc xelshi gafuchda da tavisi ver waigo grafa gawitldes da wagebuli gamwvandes
var joker = {
	names: document.querySelectorAll("thead input"),
	shuffleBtn: document.getElementById("shuffle"),
	startBtn: document.getElementById("start"),
	calls: document.querySelectorAll("td input:first-of-type"),
	results: document.querySelectorAll("td input:nth-of-type(even)"),
	players: [player1 = {	id: 1	}, player2 = {	id: 2	}, player3 = {	id: 3	}, player4 = {	id: 4	}],
	realNames: [],
	count: 0,

	init: function(){
		this.players.forEach(function(player)
		{
			console.log(player.id);
			player.calls = document.querySelectorAll("td:nth-of-type("+(player.id+1)+") input:nth-of-type(1)");
			player.results = document.querySelectorAll("td:nth-of-type("+(player.id+1)+") input:nth-of-type(2)");
		})

		this.count = assignNames(this.names,this.count,this.startBtn,this.realNames);
		shuffle(this.shuffleBtn,this.count,this.names);
	}

}

//------------------------

joker.init();

//------------------------

function assignNames(names,count,startBtn,realNames)
{
	names.forEach(function(name)
	{
		name.addEventListener("focusout", function()
		{
			if(this.value !== "")
			{
				this.setAttribute("disabled", true);
				count++;
				if( count === 4 )
				{
					getNames(names,realNames);
					count = true;
					// startBtn.addEventListener("click",function(){

					// });
				}
			}
		});
	});
return count;
}

function getNames(names,realNames)
{
	names.forEach(function(name)
	{
		realNames.push(name.value);
	});
}

function shuffle(shuffleBtn,count,names)
{
	shuffleBtn.addEventListener("click",function()
	{
		if(count === true)
		{
			this.style.backgroundColor="green";
			count=false;
			var first = Math.floor(Math.random()*4);
			console.log("First Player: ",first+1);
			for(var i=0; i < first; i++)
			{
				for(var j=1; j < names.length; j++)
				{
					names[j-1].value = [names[j].value, names[j].value = names[j-1].value][0];
				}			
			}
		}
	});
}