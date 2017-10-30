// This exercise will be done in a new file, guess-the-number.js.

// Using the inquirer module, write a program that will play the "guess the number game":

// Create a random number between 1 and 100. Call it the hidden number
// Start with 5 guesses
// As long as there are guesses left:
// Ask the user for a number between 1 and 100 until they give you one
// If they find the hidden number, they win the game. END
// Otherwise, tell them whether their guess is lower or higher than the hidden number
// Loop back
// The user has lost the game. END

var inquirer = require("inquirer");
var guesses = 5;
var hiddenNumber = Math.floor((Math.random() * 100) + 1);


console.log(hiddenNumber);

function guessingGame(attempts) {
    console.log(attempts);

    if (attempts > 0) {
        inquirer.prompt("Guess a number between 1 and 100")
    }
    
    else if (num === answer) {
        console.log("You win")
        return;
    }
}

guessingGame(guesses);