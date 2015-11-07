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

	function compare(cards){}

	return {
		cards: cards,
		deal: deal
	};

})();

War.Player = (function(){
	var constructor = function(){this.hand = [];};

	 constructor.prototype = {
		turn: function(){}
	 };

	 return constructor;

})();

War.Play = (function(){})();

var player_1 = new War.Player();
var player_2 = new War.Player();

War.Deck.deal([player_1, player_2]);

console.info(player_1.hand);
console.info(player_2.hand);