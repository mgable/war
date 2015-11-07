"use strict";
var War = {};

War.Deck = (function(){
	var values = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"],
    cards = create(values);
  
  function shuffle(cards){}
  
  function create(values){
    return values.concat(values, values, values);
  }
  
  function deal(players){}
  
  function compare(card_1, card_2){}

  return {
    cards: cards
  };
  
})();

console.info(War.Deck.cards);

War.Player = (function(){
	var constructor = function(hand){this.hand = hand;};

	 constructor.prototype = {
	 	turn: function(){}
	 };

	 return constructor;

})();

War.Play = (function(){})();

var player_1 = new War.Player([1,2,3]);
var player_2 = new War.Player([4,5,6]);

console.info(player_1.hand);
console.info(player_2.hand);