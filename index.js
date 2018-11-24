/*
 * Primary file for API
 *
 */

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const unifiedServer = (req, res) => {
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
      //console.log({ data, statusCode, payload });
      //Use the status code called back by the handler, or default 200
      statusCode = typeof statusCode == 'number' ? statusCode : 200;
      // use the payload called back by the handler, or t
      payload = typeof payload === 'object' ? payload : {};

      // convert the payload to string
      const payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader('content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('Returning this response: ', statusCode, payloadString);
    });
  });
};

// the server should respond with a string
const httpServer = http.createServer((req, res) => unifiedServer(req, res));

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) =>
  unifiedServer(req, res)
);

//Start the server, and have it listen on port 3000
httpServer.listen(config.httpPort, () => {
  console.log(
    `The server is up and running now at port: ${config.httpPort} mode: ${
      config.envName
    }`
  );
});

httpsServer.listen(config.httpsPort, () => {
  console.log(
    `The server is up and running now at port: ${config.httpsPort} mode: ${
      config.envName
    }`
  );
});

// define handler
const handlers = {};

// ping handler

handlers.ping = (data, callback) => {
  callback(200);
};

handlers.hello = (data, callback) => {
  const response = { message: 'Hello Im HAL' };
  callback(200, response);
};

// Not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

// define a request router
const router = {
  ping: handlers.ping,
  hello: handlers.hello
};
