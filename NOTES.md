# So far...
  * In the last few days, we have been working with JavaScript without caring so much in which environment our code was running
  * Today we're going to start caring
  * First off we'll talk about the two different environments that interest us
  
# The browser
  * In weeks 4 and 5 of the bootcamp, we'll be concentrating on the browser as a JavaScript environment
  * Web browsers have internal APIs that they make accessible through some global functions pre-defined in their JavaScript environment
  * Some examples:
    * The DOM: An API that allows programmatic manipulation of the web page where the JavaScript code is running
    * Networking: The `fetch` API allows a developer to make HTTP requests from JavaScript code running on the page, without refreshing the page.
    * Canvas: The Canvas API allows the programmer to draw on a two-dimensional array of pixels using some primitive methods defined in a JavaScript class.
    * Audio: The Audio API allows sound to be played by writing some JavaScript code

  * Most of these APIs would only make sense in the browser
  * We will be playing with some of them during the second half of the course.

# NodeJS
  * NodeJS is the first JavaScript environment that we will start exploring, starting today.
  * Often called simply "Node"
  * JavaScript functionality started in browsers
  * Google's Chrome uses the V8 JavaScript engine
  * Since the engine is simply C++ code, it was used in building NodeJS
  * NodeJS = V8 + some APIs that make sense for a server
  * Some examples of Node APIs:
    * `fs`: access the file system of the machine it's running on
    * `net`: create a TCP server and make requests to other TCP servers (e.g. MySQL or Memcache)
    * `http`: create a web server and make requests to other web servers
    * `crypto`: set of functions for dealing with cryptography
  * There are many others
  * Node also provides a module system called CommonJS (more on that later)

# Purpose of NodeJS
  * Node is most often used to write web server code
  * Before Node, this functionality used to be implemented in any other general-purpose programming language
  * Examples are Python, Ruby, PHP, Java, and C++ to name a few
  * NodeJS has been designed to be able to process many concurrent requests at the same time
  * The way Node does this is by running code in a single thread, and creating separate threads for anything I/O
  * Examples of I/O:
    * reading from/writing to disk
    * sending to/receiving from the network
    * getting user input from the keyboard
  * The separate threads are completely inaccessible to JavaScript
  * This design allows the JavaScript code to process requests, and offload processing to databases or other servers
  * To understand how Node does multiple things with only one thread, we need to know a bit about the call stack

# The JavaScript call stack
  * Every time you call a function, JavaScript has to suspend the currently running code and "jump" to the code of the function
  * When a `return` statement is hit inside a function, JavaScript has to know where to "return", or go back
  * The way we keep track of this is through a data structure named the "call stack"
  * A stack is a data structure on which you can push items, and popping the stack will retrieve the last pushed item (LIFO, Last In, First Out)
  * This happens for every function *call*: if you have a recursive function, each call will add one more frame on the call stack
  * Since the call stack uses up memory, you can sometimes be hit with an error `RangeError: Maximum call stack size exceeded` if you don't pay attention to your recursive functions' termination conditions.
  * Contrary to some other languages, JavaScript only has one such call stack. This means it can only execute one thing at the same time
  * This can seem limiting, but it can be a good thing: having multiple instructions executing at the same time can make it harder to reason about your code

## Errors and the call stack, `throw`, `try`/`catch`
  * Ideally programs always run correctly
  * However sometimes there are unforeseen errors
  * You might have seen them in the form of `ReferenceError`, `TypeError`, `RangeError` or various other classes of errors
  * Usually accompanied by something called a "stack trace", which represents the call stack at the time the error occurred
  * You can signal errors in your own code by `throw`ing an `Error` object, e.g. `throw new RangeError("The input must be between 1 and 100")`
  * `throw` will stop the execution of the current function just like `return`
  * But unlike `return`, `throw`ing will not make the code go back to the previous function
  * Instead, the error that was thrown will "bubble up" the call stack
  * At any point in that call stack, you can use a `try`/`catch` block to stop a thrown error from bubbling up even more
  * This allows you to selectively handle errors at the best place possible
  * If an error bubbles up all the way to the end of the call stack and never gets `catch`ed (sorry), then your program will terminate unsuccessfully

## Blocking the call stack
  * Remember that we will be using Node mostly as a web server
  * This means we'd like to be able to process multiple requests at the same time.
  * Here's how one request/response cycle unfolds:
    * Receive an HTTP request from a client
    * Parse the HTTP request to make sense out of it
    * Find out that the request is asking about the last 10 blog posts in our database
    * Make a request to the database (over the network)
    * **Wait** for the database response to come back
    * Parse the data and make it into an acceptable web format (HTML, JSON, XML)
    * Send the response to the client
  * The key part here is the "**wait**". Since the database is called over the network, this could take a lot of time (in milliseconds) to come back
  * If the function that calls the database waits until the response comes back, this will block the call stack: we can't serve other requests!
  * This means we have to find a way for the database call function -- or any other I/O for that matter -- to return immediately
  * But if the function returns immediately after doing the database call, then it won't have the data
  * Here's how Node handles this:
    * Any I/O functions -- functions that could run for a long time -- are made to be "asynchronous"
    * Node will use a separate thread under its control to do the I/O
    * The I/O function will **not `return` anything**
    * Instead, the I/O function will take an additional parameter, always in the last position
    * This parameter will be a function -- as we already know, we call those functions callbacks
    * However, contrary to say the `forEach` callback, Node will not call those callbacks immediately -- it couldn't the data is not yet available
    * Instead, Node will register the callback function in its memory, and will call it back **later, when the database response comes back**.
    * We say that Node will call the callback function **asynchronously**.

## Asynchronous functions and the call stack
  * Since asynchronous functions return immediately, they can't signal any I/O errors using the `throw` mechanism: they don't have time to know if an error will occur
  * If any errors occur, they would be in the separate I/O thread which is under Node's control
  * Among other things, this means that asynchronous errors can't bubble up the call stack because there is no call stack anymore when the data comes back
  * Here's how Node solves this:
    * By convention, all async functions will accept a callback as their *last argument*
    * Async functions will call the provided callback *only once*
    * By convention, callbacks to async functions will always take an error parameter in the *first position*
    * Any "result" or "success" parameters will go afterwards
    * Callbacks to async functions must check if the error parameter is "set". Usually it will be an `Error` object, but anything truthy should be treated as an error
    * Effectively this means that asynchronous code using callbacks has to manually bubble errors up the asynchronous call "stack".
    * This creates code such as the following:
      ```js
      fs.readFile("file.json", function (err, val) {
        if (err) {
          console.error("unable to read file");
        }
        else {
          try {
            val = JSON.parse(val);
            console.log(val.success);
          }
          catch (e) {
            console.error("invalid json in file");
          }
        }
      });
      ```
  * The previous code contains a mix of synchronous (`JSON.parse`) and asynchronous (`fs.readFile`) code, showing the two modes of operation:
    * `JSON.parse` `return`s its value synchronously. It can cause a `SyntaxError` when parsing its input, so we have to use `try`/`catch` to handle the error
    * `fs.readFile` does not `return` anything! Instead, it accepts a callback function. When the disk access is done, Node calls the callback function and passes it the data. But because an error could have happened, and `throw` can't be used (no more call stack to catch it), the callback accepts an `err` as its first parameter. The callback handles the error by printing "unable to read file"
  * This mix of code styles has some drawbacks:
    * It is confusing because we can't easily know if a function is sync or async
    * It forces us to manually bubble up errors
    * It forces us to create awkward functions that have parameters that are not theirs -- `callback` for the async functions, and `err` for the callback

## `Promise`s: a solution to some of Node-style callbacks problems
  * `Promise`s have as their goal to make it easier to write asynchronous code
  * They are simply a clever code device to straighten up callback-based code
  * Here is the general idea behind `Promise`s:
    * An asynchronous function **does not** accept a callback as its last argument anymore
    * Instead, the function will return a value. Now this value can't be the result of the I/O operation, we can't cheat. Instead, the value is an object of class `Promise`. Conceptually, this object represents an eventual future value.
    * In order to receive the value from a promise, we have to call its `then` method, and pass a callback function to `then`.
    * What have we gained over Node-style callbacks? The `then` method makes the distinction between two callbacks: `successCallback` to which it passes a value in case of success, and `errorCallback` to which it passes an `Error` object.
    * Initially the Promise is **Pending**. Eventually it will **settle** by either being **fulfilled** (success) or **rejected** (error)
    * *Only one of* `successCallback` or `errorCallback` will ever be called depending on the way the Promise settled
    * `errorCallback` is optional, but if it is not passed, your program might terminate unsuccessfully in case of error, unless the error is handled lower "down the chain" (see below)

  * `Promise` chaining:
    * The `then` method of a Promise returns a **new Promise** -- just like the `map` method of an Array returns a new Array.
    * The new Promise returned by calling `then` will settle in the following way, depending on the return value of the `successCallback`:
    * If the return value of the `successCallback` is not a Promise, then the new Promise will be fulfilled with the return value of the `successCallback`.
    * If the return value of the `successCallback` is a Promise, the new Promise will settle in the same way as the Promise returned from the `successCallback`
    * Since `then` returns a new Promise, this means we can chain `then` calls to create a waterfall of asynchronous operations
    * Contrary to Node-style callbacks, if an error is not handled in a certain `then`, it will propagate to the new Promise created by `then`
    * This means that we can write a chain of multiple `then`s with only `successCallback`s, and tack on a last `then` at the end with a `null` for `successCallback`, and a generic `errorCallback`
    * This pattern is so common that a shortcut method called `catch` exists which only takes an `errorCallback`
    * The callback-based code above becomes:
      ```js
      fs.readFile("file.json")
      .then(JSON.parse)
      .then(function(data) {
        console.log(data);
      })
      .catch(function(error) {
        if (error instanceof SyntaxError) {
          console.error("invalid json file");
        }
        else {
          console.error("unable to read file");
        }
      });
      ```
    * In the above code, we can see that chaining takes care of nested callbacks.
    * By separating the success and error callbacks, we can more easily reuse functions like `JSON.parse`
    * We don't have to bubble up errors manually anymore
  * In this course we will use Promises over Node-style callbacks wherever possible. Most popular NPM libraries will have a Promise-based equivalent

# Module System
  * Since code is located on your HD (vs. online), it makes sense to split it up in many files
  * Each file is called a module, and a module is a file
  * A module is made to have access to some variables that look global (technically they're not): `module`, `exports`, `require`, `__dirname`, and `__filename`
  * The most important function is `require`. It is passed a module name and returns the "contents" of the module
  * A module can export "content" in two ways:
    * If one thing to export, use `module.exports = ...`
    * If many things to export, use `exports.something1 = ...`
  * The `require` function caches modules, so they're only loaded once
  * To `require` another module, we will use a **relative path**. e.g. if we are in `index.js` and we want to load the module at `database.js`, we will do `var db = require('./database.js')`. If we say `'database.js'` instead, then Node will think that we are looking for a module located in the `node_modules` directory
  * This directory contains modules of JavaScript code often written by other people than you and installed with NPM

# NPM
  * NPM is Node Package Manager
  * It allows creators of open-source CommonJS modules to share them with the world through a common registry
  * The registry can be accessed from the command-line utility `npm`
  * A package can be installed with `npm install --save <package name>`
  * Projects using NPM will usually contain a `package.json` file
  * This file can be created with the `npm init` command or by hand. It contains information about the project, including its NPM dependencies
  * Every time a package is installed with `npm install --save`, a new line is written automatically to `package.json` to reflect this.
  * As a consequence, the `node_modules` directory is often made to be ignored by Git
  * When cloning a new project that uses NPM, you will often not have a `node_modules` directory
* You can install every package specified in `package.json` by simply calling `npm install` without any other arguments

# Making HTTP requests (API calls)
  * We will be using the `request-promise` NPM package
  * Here's an example of usage:
    ```js
    var request = require('request-promise');
    
    request('http://api.open-notify.org/iss-now.json')
    .then(JSON.parse)
    .then(function(data) {
      console.log(`The ISS is at ${data.iss_position.latitude},${data.iss_position.longitude}.`);
    })
    .catch(function(error) {
      console.log(error);
    });
    ```

# Getting user input
  * We will be using the `inquirer` NPM package
  * Here's an example of usage:
    ```js
    var inquirer = require('inquirer');
  
    inquirer.prompt({
      message: 'Guess a number between 1 and 100',
      name: 'guess'
    })
    .then(function(answers) {
      var guess = parseInt(answers.guess);
      if (guess < 1 || guess > 100) {
        throw new RangeError("Guess must be between 1 and 100");
      }
      else {
        console.log("thanks!!");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
    ```

# Promise patterns
## Executing multiple Promises "in parallel":
```js
Promise.all([
  request('http://reddit.com/r/montreal.json'),
  request('http://reddit.com/r/toronto.json')
])
.then(function(data) {
  var mtlData = data[0];
  var toData = data[1];
  //.....
})
.catch(function(error) {
  console.log(error);
});
```

## "Looping" with Promises
Since the functions that return Promises are asynchronous, they can't be used in a regular `while` or `for` loop and get the desired behavior.

This is the case because we would need to wait before deciding if we loop again, and if we wait then we block the call stack.

Instead, we will use a recursive function. This function will call itself asynchronously so it will not explode the call stack. Here is an example:
```js
/*
  This function returns a Promise for a guess between 1 and 100.
  It will keep asking until the conditions are met
*/
function getGuessFromUser() {
  return inquirer.prompt({
    message: 'Enter a number between 1 and 100',
    name: 'guess'
  })
  .then(function(answers) {
    var guess = parseInt(answers.guess);
    if (guess < 1 || guess > 100) {
      // THIS LINE CREATES THE LOOP!
      return getGuessFromUser();
    }
    else {
      // THE LOOP ENDS HERE!
      return guess;
    }
  });
}
```

**Notice** that Promise chains inside a function will not always have a `catch` block: they can choose to let the caller handle errors, since they will bubble up through the Promise mechanism.

# The `Promise` constructor
  * The `setTimeout` function is callback-based. Here's how to convert it to a Promise:
  
    ```js
    function wait(durationInMs) {
      return new Promise(function(resolve, reject) {
        setTimeout(resolve, durationInMs);
      });
    }
    ```
  
  * The `wait` function returns a Promise. Notice there is no `callback` in its parameter list.
  * The Promise constructor takes a function to execute. This function will receive two functions: the first one to fulfill the promise, and the second one to reject it.
  * You are only allowed to call one of resolve or reject to settle the Promise.