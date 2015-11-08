"use strict";
var War = {};

War.Deck = (function(){
	var values = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"],
		cards = shuffle(create(values));

	function shuffle(cards){
		var results = [];

		while(cards.length){
			var index = Math.round(Math.random() * (cards.length - 1) );
			results.push(cards.splice(index,1)[0]);
		}

		return results;
	}

	function create(values){
		return values.concat(values, values, values);
	}

	function deal(players){
		var start = 0;
		cards.forEach(function(v,i,a){
			players[start].hand.push(v);
			start = start >= (players.length - 1) ? 0 : start + 1;
		});
	}

	function compare(cards){
		var rankings = cards.map(function(v,i,a){
				return values.indexOf(v);
			}),
			winner = Math.min.apply(Math, rankings),
			results = rankings.map(function(v,i,a){
				return v === winner ? 1 : 0;
			});
	
		return results;
	}

	return {
		cards: cards,
		deal: deal,
		compare: compare
	};

})();

War.Player = (function(){
	var constructor = function(name){
			this.hand = [];
			this.name = name;
		};

	constructor.prototype = {
		turn: function(){
			return this.hand.pop();
		},
		returnCards: function(cards){
			while(cards.length){
				this.hand.unshift(cards.pop());
			}
		}
	};

	return constructor;

})();

War.Play = (function(){
	var results = [],
		winnerObj,
		play = function(players){
			// Look Mom! - a "Do" loop
			do {
				var round = [];
				
				players.forEach(function(player,i,a){
					round.push(player.turn());
					
				});
				
				results = War.Deck.compare(round);
				
				winnerObj = players[results.indexOf(1)];
				winnerObj.returnCards.call(winnerObj, round);
			
			} while (results.reduce(function(a,b){return a + b;},0) > 1);
			
			
			return winnerObj.name + " has won!";
		};

	return play;
})();

var player_1 = new War.Player("Joe");
var player_2 = new War.Player("Ralph");

War.Deck.deal([player_1, player_2]);

War.Play([player_1, player_2]);



//console.info(War.Deck.compare(["8", "Q", "A", "A"]));
//console.info(player_1.hand);
//console.info(player_2.hand)