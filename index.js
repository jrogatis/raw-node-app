/*
 * Primary file for API
 *
 */

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// the server should respond with a string
const server = http.createServer((req, res) => {
  // get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // get the query string
  const queryStringObject = parsedUrl.query;

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

    // choose the handler the request should go to. If not found use not foundHandler
    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handlers.notFound;

    // construct the data object to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    };

    // route the request to the handler specified in the handler
    chosenHandler(data, (statusCode, payload) => {
      //Use the status code called back by the handler, or default 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200;
      // use the payload called back by the handler, or t
      payload = typeof payload == 'object' ? payload : {};

      // convert the payload to string
      const payloadString = JSON.stringify(payload);

      // return the response
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('Returning this response: ', statusCode, payloadString);
    });
  });
});

//Start the server, and have it listen on port 3000
server.listen(3000, () => {
  console.log('The server is up and running now');
});

// define handler
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
  // Callback a http status code, and a payload object
  callback(406, { name: 'sample handler' });
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// define a request router
const router = {
  sample: handlers.sample
};
