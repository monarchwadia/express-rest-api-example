var express = require('express');
var app = express();

// This array just stays in memory and can be read and updated using the get/post/delete calls below
var quotes = [
  { author : 'Audrey Hepburn', text : "Nothing is impossible, the word itself says 'I'm possible'!"},
  { author : 'Walt Disney', text : "You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you"},
  { author : 'Unknown', text : "Even the greatest was once a beginner. Don’t be afraid to take that first step."},
  { author : 'Neale Donald Walsch', text : "You are afraid to die, and you’re afraid to live. What a way to exist."}
];

// express needs bodyParser in order to parse JSON bodies in POST calls
app.use(express.bodyParser());

// SEND ALL QUOTES
app.get('/', function(req, res) {
  // sends back a JSON representation of the quotes.
  res.json(quotes);
});

// SEND RANDOM QUOTE
app.get('/quote/random', function(req, res) {
  // pick a random quote
  var id = Math.floor(Math.random() * quotes.length);
  var q = quotes[id];
  
  // send it back
  res.json(q);
});

// SEND QUOTE BY ID
// The request here is a GET call to localhost:3412/quote/:id
// ":id" is a placeholder for a "URL parameter".
// the :id is placed in the req.params object and can be accessed via req.params.id
// :for a GET call to localhost:3412/quote/1, the :id is 1
// :for a GET call to localhost:3412/quote/23, the :id is 23
// :for a GET call to localhost:3412/quote/foo, the :id is foo
// if :id is not passed in, for example in a GET call to "localhost:3412/quote/" (trailing slash is optional), this route will not be matched.
app.get('/quote/:id', function(req, res) {
  // if id is greater than the number of quotes OR is less than 0, send back 404 not found with a message
  if(quotes.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  // send the chosen quote
  var q = quotes[req.params.id];
  res.json(q);
});

// CREATE NEW QUOTE. This is a POST request.
app.post('/quote', function(req, res) {
  // `req.body` refers to the JSON body sent up in the POST request.
  // if the json body does not have 'author' or 'text' fields, then send an error.
  if(!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('text')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  // create the new quote body
  var newQuote = {
    author : req.body.author,
    text : req.body.text
  };

  // push it into the array
  quotes.push(newQuote);
  
  // send back "true" to indicate the insert worked
  res.json(true);
});

// DELETE QUOTE. This is a DELETE request.
app.delete('/quote/:id', function(req, res) {
  if(quotes.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  // remove the quote from the array
  quotes.splice(req.params.id, 1);
  
  // send back a "true" response
  res.json(true);
});

app.listen(process.env.PORT || 3412);
