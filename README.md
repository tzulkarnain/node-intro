# NodeJS Intro Workshop

## Base instructions
  * Fork this repository and clone it to your Cloud9 workspace
  * Notice that the `.gitignore` file contains one line that says "`node_modules`". What this is doing is telling Git that it should ignore the contents of the `node_modules` directory even when we do `git add .`. Since the code in `node_modules` can be downloaded from the NPM registry, and `package.json` has a reference to every package the project needs, we don't need to commit `node_modules` in our repository.
  * After your first commit, push and create a pull-request. Then make sure to commit and push often so we can see your work.
  * All the code goes in the `workshop.js` file.

## Calling APIs
In order to do these exercises, you will need to know about the [JSON format](https://www.digitalocean.com/community/tutorials/how-to-work-with-json-in-javascript).

### `getIssPosition`
  1. First, install the `request-promise` module with NPM, making sure it's added to `package.json`.
  2. Complete the code of this function so that it returns the position of the ISS as a `Promise`.
  3. Make sure to use the data from `http://api.open-notify.org/iss-now.json` to do your work
  4. The ISS API returns the position keys as `latitude` and `longitude`. Return them as `lat` and `lng` instead.
  
### `getAddressPosition`
  1. Complete the code of this function to return a `Promise` for a lat/lng object
  2. Use the [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/get-api-key) to do this
  3. Make sure to only return an object with lat/lng and not the whole response
  
### `getCurrentTemperatureAtPosition`
  1. Go to [Dark Sky API](https://darksky.net/dev/) and read the documentation
  2. Signup and get a free API key
  3. Complete the code of the function. The `position` parameter is an object with `lat` and `lng`.
  4. Make sure your function only returns a `Promise` for the current temperature (a number) and nothing else
  
### `getCurrentTemperature`
While it's useful to get the current temperature for a specific lat/lng, most often we want to provide the name of a place instead.

You already created a function that can do address ==> position, and one that can do position ==> temperature. For this exercise, re-use these two functions to create one that goes directly from address ==> temperature.

The code of this function should be very short, re-using two previously created functions.

### `getDistanceFromIss`
Again here you should re-use two previously created functions, plus the `getDistance` function provided to you in `workshop.js`.

One of the functions does address ==> position and the other simply does nothing ==> position. The `getDistance` function needs the two positions to compute the final value.

In this case, the two functions can be called in parallel. Make sure to use `Promise.all` to make it happen!

---

## Guess The Number
This exercise will be done in a new file, `guess-the-number.js`.

Using the `inquirer` module, write a program that will play the "guess the number game":

  * Create a random number between 1 and 100. Call it the hidden number
  * Start with 5 guesses
  * As long as there are guesses left:
    * Ask the user for a number between 1 and 100 until they give you one
    * If they find the hidden number, they win the game. END
    * Otherwise, tell them whether their guess is lower or higher than the hidden number
    * Loop back
  * The user has lost the game. END

---

## Challenge: Hangman
This exercise will be done in a new file, `hangman.js`.

Using the `inquirer` module and any others, write a program that will play Hangman according to the "Method 1" rules at http://www.wikihow.com/Play-Hangman

You can skip the step that says "draw the hangman". Instead, simply count 8 guesses.

To make it more fun, integrate the following functionality:

* Allow players to re-play after they won or lost (`inquirer` has a yes/no type of question)
* Get an account at Wordnik and use their [Random Words API](http://developer.wordnik.com/docs.html#!/words/getRandomWords_get_3) to start each game with a new random word.
* Actually draw the hangman using ASCII art
