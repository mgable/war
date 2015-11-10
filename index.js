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
	function isThereAWinner(player){
		return player.hand.length ===  cards.length;
	}

	// a utility function to insert the return cards back into the deck or hand
	function returnCards(container, _cards){
		var cards = shuffle(_cards);
		while(cards.length){
			container.unshift(cards.pop());
		}
		// return container in case we want to assign it to another variable
		return container; 
	}

	// revealing module pattern
	return {
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
		winner = false,
		loser = false,
		limit = 3000,
		counter = 0,
		play = function(players){

			// this is the game play engine
			// it seems to be possible to have a "scratch game" (no winner) so a limit is used 
			while(counter < limit){
				// the queue holds the previous round(s) cards during "war"
				var queue = [],
					war = false;

				counter++;
				// this is the round (or turn) engine
				do {
					// holds all cards in current round;
					var round = [];

					// reset round winner and war
					winner  = false;
					war = false;

					// each player adds a card to the "round"
					round = players.map(turn);

					// get the results of the round 
					results = War.Deck.compare(round);

					// determine if the round resulted in a tie (or War)
					war = Math.min.apply(Math, results) !== 0;

					// if there is war
					if (war){
						console.info("Round " + counter + " was a tie!");

						// add cards from the previous round to the queue
						War.Deck.returnCards(queue, round);

						// add the "War" cards to the queue
						players.forEach(function(player){
							queue.unshift(player.turn());
							// if a player runs out of cards during "War" they lose
							if (player.hand.length === 0){
								loser = player;
							}
						});
					// there is a single winner
					} else {
						winner = players[results.indexOf(1)];
						War.Deck.returnCards(winner.hand, queue.concat(round));
					}
				 // continue until there is a loser or no war or there is a winner
				} while (!loser && war && !winner);

				if (!loser){
					 console.info(winner.name + " has won round " + counter +  "!");
					 players.forEach(function(player){console.info(player.name + " hand is " + player.hand);});
					 console.info("******************************************");
				}
				
				if (loser) {console.info(loser.name + " lost the game after running out of cards in " + counter + " turns");return;}
				if (War.Deck.isThereAWinner(winner)) {console.info(winner.name + " just won the GAME in " + counter + " turns!!"); return;}
			}

			console.info("There is no winner afer " + counter + " turns.");

		};

		function turn(player){
			var card = player.turn();
			console.info(player.name + " played a " + card);
			return card;
		}

	return play;
})();

var player_1 = new War.Player("Larry");
var player_2 = new War.Player("Ralph");

War.Deck.deal([player_1, player_2]);
War.Play([player_1, player_2]);



