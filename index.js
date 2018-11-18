/*
  primary file for the API
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// the server should respond with a string
const server = http.createServer((req, res) => {
  // get the url and parse it
  const parseUrl = url.parse(req.url, true);
  // get the path
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the query string
  const queryStringObject = parseUrl.query;

  //get the http method
  const method = req.method.toLowerCase();

  //get the headers as object
  const headers = req.headers;

  // get the payload if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();
    // send the response
    res.end('Hello Word\n');

    // Log the request path
    console.log(buffer);
  });
});

//Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log('The server is listening on port 3000');
});
