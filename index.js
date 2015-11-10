"use strict";
// Namespace
var War = {};

// War.Deck represents the deck of cards used in the game
War.Deck = (function(){
	// values for all cards; suit will be ignored
	var values = ["A","K","Q","J","10","9","8","7","6","5","4","3","2"],
		cards = shuffle(create(values));

	// simple shuffle method
	function shuffle(_cards){
		var results = [];

		while(_cards.length){
			var index = Math.round(Math.random() * (_cards.length - 1) );
			results.push(_cards.splice(index,1)[0]);
		}

		return results;
	}

	// make a full "deck" of cards
	function create(_cards){
		return _cards.concat(_cards, _cards, _cards);
	}

	// deal cards evenly to all players
	function deal(players){
		var start = 0;
		cards.forEach(function(card){
			players[start].hand.push(card);
			start = start >= (players.length - 1) ? 0 : start + 1;
		});
	}

	// determine which of the cards in the array is the "winner"
	function compare(_cards){
		var rankings = _cards.map(function(card){
				return values.indexOf(card);
			}),
			winner = Math.min.apply(Math, rankings),
			results = rankings.map(function(rank){
				return rank === winner ? 1 : 0;
			});

		return results;
	}

	// a player wins when they have all of the cards
	function isThereAWinner(players){
		return players.filter(function(player){
			return player.hand.length ===  cards.length;
		});
	}

	// a utility function to insert the return cards back into the deck or hand
	function returnCards(container, _cards){
		var cards = shuffle(_cards);
		while(cards.length){
			container.unshift(cards.pop());
		}
		return container;
	}

	// revealing module pattern
	return {
		cards: cards,
		deal: deal,
		compare: compare,
		isThereAWinner: isThereAWinner,
		returnCards: returnCards

	};

})();

// War.Player represents the players in the game
War.Player = (function(){
	var constructor = function(name){
			this.hand = [];
			this.name = name;
		};

	constructor.prototype = {
		turn: function(){
			return this.hand.pop();
		}
	};

	return constructor;

})();

// War.Play is the test harness
War.Play = (function(){
	var results = [],
		winner,
		loser = false,
		limit = 10000,
		counter = 0,
		play = function(players){

			// it seems to be possible to have a "scratch game" (no winner) so a limit is used 
			while(counter < limit){
				var queue = [];
				counter++;
				do {
					var round = [];

					// each player addes a card to the "round"
					players.forEach(function(player){
						var card = player.turn();
						console.info(player.name + " played a " + card);
						round.push(card);
					});

					// get the results of the round 
					results = War.Deck.compare(round);

					// determine if it is a tie or not
					if (Math.min.apply(Math, results) !== 0){
						console.info("Round " + counter + " was a tie!");

						// add cards from the previous round to the queue
						queue = War.Deck.returnCards(queue, round);

						// add the "War" cards to the queue
						players.forEach(function(player){
							queue.unshift(player.turn());
							// if a player runs out of cards during "War" they lose
							if (player.hand.length === 0){
								loser = player;
							}
						});

					} else {
						winner = players[results.indexOf(1)];
						War.Deck.returnCards(winner.hand, queue.concat(round));
					}
				 
				} while (!loser && results.reduce(function(a,b){return a + b;},0) > 1);

				if (!loser){
					 console.info(winner.name + " has won round " + counter +  "!");
					 console.info(player_1.name + " hand is " + player_1.hand);
					 console.info(player_2.name + " hand is " + player_2.hand);
					 console.info("******************************************");
				}
				
				var won = War.Deck.isThereAWinner(players).length ? War.Deck.isThereAWinner(players)[0] : false;
				if (won) {console.info(won.name + " just won the GAME in " + counter + " turns!!"); return;}
				if (loser) {console.info(loser.name + " lost the game after running out of cards in " + counter + " turns");return;};
			}

			console.info("There is no winner afer " + counter + " turns.");

		};

	return play;
})();

var player_1 = new War.Player("Larry");
var player_2 = new War.Player("Ralph");

War.Deck.deal([player_1, player_2]);
War.Play([player_1, player_2]);



