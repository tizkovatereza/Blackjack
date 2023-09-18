// blackjack.js
// A simple 'vanilla' JavaScript implementation of blackjack

// Know Issues:
// "Simple stratgey" is a massive oversimplification

//console.log("Script link success!");

// Object creation helper function from JavaScript: The Good Parts
/*
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        var F = function () { };
        F.prototype = o;
        return new F();
    }
};*/

// an object to hold all of the variables for the blackjack app
// to avoid global variable drama
var jsbApp = {};

// Store important elements in variables for later manipulation
jsbApp.pcards = document.getElementById('pcards');
jsbApp.dcards = document.getElementById('dcards');
jsbApp.hitButton = document.getElementById('hit');
jsbApp.stayButton = document.getElementById('stay');
jsbApp.playButton = document.getElementById('play');
jsbApp.textUpdates = document.getElementById('textUpdates');
jsbApp.buttonBox = document.getElementById('buttonBox');
jsbApp.phandtext = document.getElementById('phand');
jsbApp.dhandtext = document.getElementById('dhand');
jsbApp.tracker = document.getElementById('tracker');
jsbApp.newgame = document.getElementById('newgame');
jsbApp.choice = document.getElementById('choice');

// initialize variables to track hands/cards/etc.
jsbApp.playerHand = [];
jsbApp.dealerHand = [];
jsbApp.deck = [];
jsbApp.suits = ['clubs <span class="bold">&#9827</span>', 'diamonds <span class="redcard">&#9830</span>', 'hearts <span class="redcard">&#9829</span>', 'spades <span class="bold">&#9824</span>'];
jsbApp.values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
jsbApp.gameStatus = 0; // flag that game has not yet been won
jsbApp.wins = 0; // flag that game has not yet been won
jsbApp.draws = 0; // flag that game has not yet been won
jsbApp.losses = 0; // flag that game has not yet been won
jsbApp.games = 0; // flag that game has not yet been won

// Object Constructor for a card. !!! ALWAYS USE NEW WHEN MAKING A NEW CARD!!!
function card(suit, value, name) {
    this.suit = suit; // string of c/d/h/s
    this.value = value; // number 1 - 10
    this.name = name; // string of the full card name
};


var newGame = function () {
    // remove newgame button and show hit/stay buttons
    jsbApp.newgame.classList.add("hidden");
    
    // reset text and variables for newgame
    jsbApp.dcards.innerHTML = "";
    jsbApp.dcards.innerHTML = "";
    jsbApp.playerHand = [];
    jsbApp.dealerHand = [];
    jsbApp.gameStatus = 0;

    // Create the new deck
    jsbApp.deck = createDeck();

    // Deal two cards to the player and two cards to the dealer
    jsbApp.playerHand.push(jsbApp.deck.pop());
    jsbApp.playerHand.push(jsbApp.deck.pop());

    // check for player victory
    if (handTotal(jsbApp.playerHand) === 21)
    {
        jsbApp.wins += 1;
        jsbApp.games += 1;        
        jsbApp.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        drawHands();
        jsbApp.textUpdates.innerHTML = "You won! You got 21 on your initial hand!";
        track();
        jsbApp.gameStatus = 2; // game is won
        return;
    }

    jsbApp.dealerHand.push(jsbApp.deck.pop());
    jsbApp.dealerHand.push(jsbApp.deck.pop());

    // check for dealer victory    
    if (handTotal(jsbApp.dealerHand) === 21)
    {
        jsbApp.games += 1;
        jsbApp.losses += 1;
        jsbApp.gameStatus = 1; // to cause the dealer's hand to be drawn face up
        drawHands();
        jsbApp.textUpdates.innerHTML = "You lost! The dealer had 21 on their initial hand.";
        track();
        jsbApp.gameStatus = 2; // game is won
        return;
    }

    // draw the hands if neither won on the initial deal
    drawHands();
    advise();
    jsbApp.buttonBox.classList.remove("hidden"); // show hit/stay buttons
    jsbApp.textUpdates.innerHTML = "The initial hands are dealt!";
    
};

var createDeck = function () {
    var deck = [];
    // loop through suits and values, building cards and adding them to the deck as you go
    for (var a = 0; a < jsbApp.suits.length; a++) {
        for (var b = 0; b < jsbApp.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";            
            if (cardValue > 10){
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (jsbApp.values[b] + " of " + jsbApp.suits[a] + " (" + cardValue + ")");
            }
            else
            {
                cardTitle += (jsbApp.values[b] + " of " + jsbApp.suits[a] + " (" + cardValue + " or 11)");
            }
            var newCard = new card(jsbApp.suits[a], cardValue, cardTitle);
            deck.push(newCard);
            

        }
    }
    //console.log("Deck created! Deck size: " + deck.length)
    deck = shuffle(deck);
    //console.log("Deck shuffeled! Deck size: " + deck.length)
    //deckPrinter(deck);
    return deck;
};

// Update the screen with the contents of the player and dealer hands
var drawHands = function () {    
    var htmlswap = "";
    var ptotal = handTotal(jsbApp.playerHand);
    var dtotal = handTotal(jsbApp.dealerHand);
    htmlswap += "<ul>";
    for (var i = 0; i < jsbApp.playerHand.length; i++)
    {
        htmlswap += "<li>" + jsbApp.playerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    jsbApp.pcards.innerHTML = htmlswap;
    jsbApp.phandtext.innerHTML = "Your Hand (" + ptotal + ")"; // update player hand total
    if (jsbApp.dealerHand.length == 0)
    {
        return;
    }

    // clear the html string, re-do for the dealer, depending on if stay has been pressed or not
    htmlswap = "";
    if (jsbApp.gameStatus === 0)
    {
        htmlswap += "<ul><li>[Hidden Card]</li>";
        jsbApp.dhandtext.innerHTML = "Dealer's Hand (" + jsbApp.dealerHand[1].value + " + hidden card)"; // hide value while a card is face down
    }
    else
    {
        jsbApp.dhandtext.innerHTML = "Dealer's Hand (" + dtotal + ")"; // update dealer hand total
    }
    
    for (var i = 0; i < jsbApp.dealerHand.length; i++) {
        // if the dealer hasn't had any new cards, don't display their face-down card
        // skip their first card, which will be displayed as hidden card
        // per the above if statement
        if (jsbApp.gameStatus === 0)
        {
            i += 1;
        }
        htmlswap += "<li>" + jsbApp.dealerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    jsbApp.dcards.innerHTML = htmlswap;
    //console.log("Player has " + jsbApp.playerHand.length + " cards, dealer has " + jsbApp.dealerHand.length + " cards, and deck has " + jsbApp.deck.length + " cards.");

};

// return the total value of the hand 
var handTotal = function (hand) {
    //console.log("Checking hand value");
    var total = 0;
    var aceFlag = 0; // track the number of aces in the hand
    for (var i = 0; i < hand.length; i++) {
        //console.log("Card: " + hand[i].name);
        total += hand[i].value;
        if (hand[i].value == 1)
        {
            aceFlag += 1;
        }
    }
    // For each ace in the hand, add 10 if doing so won't cause a bust
    // To show best-possible hand value
    for (var j = 0; j < aceFlag; j++)
    {
        if (total + 10 <= 21)
        {
            total +=10;
        }
    }
    // console.log("Total: " + total);
    return total;
}

// Shuffle the new deck
var shuffle = function (deck) {
    // console.log("Begin shuffle...");
    var shuffledDeck = [];
    var deckL = deck.length;
    for (var a = 0; a < deckL; a++)
    {
        var randomCard = getRandomInt(0, (deck.length));        
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1);        
    }
    return shuffledDeck;
}

var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    // console.log("Min: " + min + " Max: " + max);
    return Math.floor(Math.random() * (max - min)) + min;
    // code based on sample from MDN
}

// print the deck to the console 
// only for for debugging purposes
var deckPrinter = function (deck) {
    for (var i = 0; i < deck.length; i++)
    {
        console.log(deck[i].name);
    }
    return
}

// Game loop begins when the play button is pressed
jsbApp.playButton.addEventListener("click", newGame);

// Hit button pressed:
jsbApp.hitButton.addEventListener("click", function () {
    // disable if the game has already been won
    if (jsbApp.gameStatus === 2)
    {
        console.log("Hit clicked when game was over or already clicked.");
        return;
    }

    // deal a card to the player and draw the hands
    jsbApp.playerHand.push(jsbApp.deck.pop());
    drawHands();
   

    var handVal = handTotal(jsbApp.playerHand);
    if (handVal > 21)
    {
        bust();
        advise();
        return;
    }
    else if (handVal === 21)
    {
        victory();
        advise();
        return;
    }
    advise();
    jsbApp.textUpdates.innerHTML = "Hit or stay?</p>";
    return;      
});

// Stay button pressed:
jsbApp.stayButton.addEventListener("click", function stayLoop() {
    //console.log("(1)Inside stayLoop now");
    // disable ig game already won
    if (jsbApp.gameStatus === 2)
    {
        console.log("Stay clicked when game was over or already clicked.");
        return;
    }
    else if (jsbApp.gameStatus === 0) // i.e. stay was just pressed
    {
        
        jsbApp.buttonBox.classList.add("hidden"); // take away the hit and stay buttons
        var handVal = handTotal(jsbApp.dealerHand);
        jsbApp.gameStatus = 1; // enter the 'stay' loop
        advise(); // clear advise
        jsbApp.textUpdates.innerHTML = "The dealer reveals their hidden card";
        drawHands();
        setTimeout(stayLoop, 750); // return to the stay loop
    }
    else if (jsbApp.gameStatus === 1) {    

    // If dealer has less than 17, hit
    var handVal = handTotal(jsbApp.dealerHand);
    if (handVal > 16 && handVal <= 21) // dealer stays and game resolves
    {
        drawHands();
        //console.log("----------Dealer stays, checking hands");
        var playerVal = handTotal(jsbApp.playerHand);
        if (playerVal > handVal)
        {            
            victory();
            return;
        }
        else if (playerVal < handVal)
        {            
            bust();
            return;
        }
        else
        {            
            tie();
            return;
        }
    }
    if (handVal > 21)
    {
        victory();
        return;
    }
    else // hit
    {
        jsbApp.textUpdates.innerHTML = "Dealer hits!";
        jsbApp.dealerHand.push(jsbApp.deck.pop());
        drawHands();
        setTimeout(stayLoop, 750);
        return;
    }   
    }
});

var victory = function () {
    jsbApp.wins += 1;
    jsbApp.games += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(jsbApp.playerHand);
    var dealerTotal = handTotal(jsbApp.dealerHand);
    if (playerTotal === 21)
    {
        explanation = "Your hand's value is 21!";
    }
    else if (dealerTotal > 21)
    {
        explanation = "Dealer busted with " + dealerTotal + "!";
    }
    else
    {
        explanation = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    jsbApp.textUpdates.innerHTML = "You won!<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var bust = function () {
    jsbApp.games += 1;
    jsbApp.losses += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(jsbApp.playerHand);
    var dealerTotal = handTotal(jsbApp.dealerHand);
    if (playerTotal > 21)
    {
        explanation = "You busted with " + playerTotal + ".";
    }
    jsbApp.textUpdates.innerHTML = "You lost.<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var tie = function () {    
    jsbApp.games += 1;
    jsbApp.draws += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; // flag that the game is over
    var playerTotal = handTotal(jsbApp.playerHand);
    jsbApp.textUpdates.innerHTML = "It's a tie at " + playerTotal + " points each.<br>Press 'New Game' to play again.";
    track();
}

// update the win/loss counter
var track = function () {
    jsbApp.tracker.innerHTML = "<p>Wins: " + jsbApp.wins + " Draws: " + jsbApp.draws + " Losses: " + jsbApp.losses + "</p>";
    jsbApp.newgame.classList.remove("hidden");
    jsbApp.buttonBox.classList.add("hidden");
}

// check the player hand for an ace
var softCheck = function (hand) {    
    var total = 0;
    var aceFlag = 0; // track the number of aces in the hand
    for (var i = 0; i < hand.length; i++) {
        //console.log("Card: " + hand[i].name);
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }
    // For each ace in the hand, add 10 if doing so won't cause a bust
    // To show best-possible hand value
    for (var j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            return true; // the hand is soft, i.e. it can be multiple values because of aces
        }
    }    
    return false; // the hand is hard, i.e. it has only one possible value
}

var advise = function () {
    // no advise if player has no choices
    if (jsbApp.gameStatus > 0)
    {
        jsbApp.choice.innerHTML = "";
        return;
    } 
    var playerTotal = handTotal(jsbApp.playerHand);
    var soft = softCheck(jsbApp.playerHand);
    console.log("Soft: " + soft);
    var dealerUp = jsbApp.dealerHand[1].value;
    // count dealer's ace as 11 to simplify logic
    if (dealerUp === 1)
    {
        dealerUp = 11;
    }

    // provide advice based on HIGHLY simplified blackjack basic strategy
    if (playerTotal <= 11 && !soft)
    {
        jsbApp.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp <= 6 && !soft)
    {
        jsbApp.choice.innerHTML = "[Stay]";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp >= 7 && !soft)
    {
        jsbApp.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 17 && playerTotal <= 21 && !soft)
    {
        jsbApp.choice.innerHTML = "[Stay]";
    }
    else if (playerTotal >= 12 && playerTotal <= 18 && soft)
    {
        jsbApp.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 19 && playerTotal <= 21 && soft)
    {
        jsbApp.choice.innerHTML = "[Stay]";
    }
    else
    {
        jsbApp.choice.innerHTML = "Massive error, unexpected scenario, idk";
        console.log("Error: Player's hand was " + playerTotal + " and dealer's faceup was " + dealerUp + ".");
    }
    return;
}
