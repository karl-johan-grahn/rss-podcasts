# rss-parser
This is a Node.js service that parses RSS feeds.

It uses Koa.js as web framework, which leverages asynchronous functions. Correctly used, this should make the code easier to read and maintain,
as compared to using callbacks.

## Strong areas
* Service constructor enables testing it by injecting different options
* Mostly using NPM modules for functionality - testing is focused on the service as such, not on functionality provided by modules
* Simple testing framework setup
* Service is missing functionality but has rather been written to be easy to maintain and easy to extend
* HATEOAS driven REST API

## Weak areas - open for feedback
* Checksum not calculated - it was not clear if it should be calculated or fetched. Node is a good platform for I/O-bound applications, not for computationally intensive ones though. Tried different methods for extracting it via HEAD requests, and by doing different file requests, but to no luck.
* Error handling for endpoints needs to be improved
* Extracting the ID3 tag does not work as expected - either the NPM module does not return all tags, or the code is incorrect
* No API tests

## Getting started

### Requirements

[Node.JS](https://nodejs.org/) and NPM is required.

### Install dependencies

`npm install`

### Run tests

`npm run test`

### Start service in development mode

`npm run dev`

This will run the service with `nodemon`, which will automatically restart the service as soon as changes are done to the source files.

### Start service

`npm run start`

### License

MIT
