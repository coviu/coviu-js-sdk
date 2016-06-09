var cuid = require('cuid');
var Promise = require('es6-promises');

exports.fromEnv = function (key) {
  var v = process.env[key];
  if (typeof v === 'undefined') {
    console.error('Expected ' + key + ' in the environment, but it was not supplied. Exiting.');
    process.exit(1);
  }
  return v;
};


var relativeNow = exports.relativeNow = function (ms) {
  return new Date(new Date().getTime() + ms);
};

var userDetils = exports.userDetils = function () {
  return {
    email: cuid()+'@mailinator.com',
    firstName: 'That',
    lastName: 'Guy',
    password: cuid(),
    alias: cuid(),
    imageUrl: 'http://www.fillmurray.com/200/300'
  };
};

var exampleSession = exports.exampleSession = function (ms) {
  var start = typeof ms !== 'undefined' ? ms : 10*60*1000;
  return {
    session_name: "A test session with Dr. Who",
    start_time: relativeNow(start).toUTCString(), // 10mins into the future
    end_time: relativeNow(20*60*1000).toUTCString(), // 20mins into the future
    picture: 'http://www.fillmurray.com/200/300'
  };
};

var exampleHost = exports.exampleHost = function () {
  return {
    display_name: "Dr. Who",
    role: "host",
    picture: "http://fillmurray.com/200/300",
    state: "test-state"
  };
};

var exampleGuest = exports.exampleGuest = function () {
  return {
    display_name: "Dr. Who",
    role: "guest",
    picture: "http://fillmurray.com/200/300",
    state: "test-state"
  };
};

var expectFailure = exports.expectFailure = function (p) {
  return new Promise(function(accept, reject){
    p.then(reject).catch(accept);
  });
};
