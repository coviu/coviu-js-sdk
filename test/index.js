var assert = require('assert');
var sdk = require('../');
var helpers = require('./helpers');
var shapeful = require('shapeful');

var apiKey = helpers.fromEnv('API_KEY');
var keySecret = helpers.fromEnv('KEY_SECRET');
var opts = {
  endpoint: helpers.fromEnv('ENDPOINT'),
  // Enabling debug forces client side checks against request bodies and
  // query parameters.
  debug: true
};

var coviu = sdk(apiKey, keySecret, opts);

describe('the coviu-js-sdk sesions api', function(){

  var session;
  var host;
  var guest;

  it('can get the sessions for the owner of the client', function(){
    this.timeout(10000);
    return coviu.sessions.getSessions({}).run().then(function(sessions){
      assert(sessions);
      assert(shapeful(sessions, {content: 'array', page: 'number', page_size: 'number', more:'boolean'}));
    });
  });

  it('can create a session', function(){
    // Set the session start time 10 seconds into the future.
    var example = helpers.exampleSession(10000);
    return coviu.sessions.createSession(example).run().then(function(result){
      assert(result);
      assert(result.team_id);
      assert(result.client_id);
      assert(result.session_id);
      session = result
    });
  });

  it('can add a host participant to a session', function(){
    var example = helpers.exampleHost();
    return coviu.sessions.addParticipant(session.session_id, example).run().then(function(result){
      assert(result);
      assert(result.participant_id);
      assert(result.entry_url);
      assert(result.role === 'HOST');
      host = result;
    });
  });

  it('can add a guest participant to the session', function(){
    var example = helpers.exampleGuest();
    return coviu.sessions.addParticipant(session.session_id, example).run().then(function(result){
      assert(result);
      assert(result.participant_id);
      assert(result.entry_url);
      assert(result.role === 'GUEST');
      guest = result;
    });
  });

  it('can get a session by id', function(){
    return coviu.sessions.getSession(session.session_id).run().then(function(result){
      assert(result.session_id === session.session_id);
      assert(result.participants.length === 2);
      assert(result.participants.filter(function(p){return p.role === 'HOST'}).length === 1);
      assert(result.participants.filter(function(p){return p.role === 'GUEST'}).length === 1);
    });
  });

  it('can update a participant to e.g. set a guest to a host', function(){
    var update = {role: 'HOST', display_name: 'New Display Name'};
    return coviu.sessions.updateParticipant(guest.participant_id, update).run().then(function(result) {
      assert(result);
      assert(result.role === update.role);
      assert(result.display_name === update.display_name);
    });
  });

  it('can update a session\s name, start, and end time, and picture', function(){
    var update = {
      start_time: helpers.relativeNow(10*60*60*1000).toUTCString(),
      end_time: helpers.relativeNow(20*60*60*1000).toUTCString(),
      display_name: 'example',
      picture: 'example'
    };
    return coviu.sessions.updateSession(session.session_id, update).run().then(function(result) {
      assert(result);
      assert(result.start_time === update.start_time);
      assert(result.end_time === update.end_time);
      assert(result.participants.filter(function(p){return p.role === 'HOST'}).length === 2);
    });
  });

  it('can get just the participants for a session', function(){
    return coviu.sessions.getSessionParticipants(session.session_id).run().then(function(result) {
      assert(result);
      assert(result.length === 2);
    });
  });

  it('can get a single participant by id', function(){
    return coviu.sessions.getParticipant(host.participant_id).run().then(function(result) {
      assert(result.participant_id === host.participant_id);
      assert(result.session_id === session.session_id);
    });
  });

  it('can remove a participant from a session', function(){
    return coviu.sessions.deleteParticipant(guest.participant_id).run().then(function(){
      return coviu.sessions.getSession(session.session_id).run().then(function(session){
        assert(session.participants.length === 1);
      });
    });
  });

  it('A removed participant may still be accessed by including the deleted_participants flag', function(){
    return coviu.sessions.getSession(session.session_id).query({deleted_participants: true}).run()
    .then(function(session){
      assert(session.participants.length === 2);
    });
  });

  it('can cancel a session', function(){
    return coviu.sessions.deleteSession(session.session_id).run().then(function(){
      return helpers.expectFailure(coviu.sessions.getSession(session.session_id).run());
    });
  });

  it('A deleted session is still included in a session page result if the include_canceled flag is set', function(){
    return coviu.sessions.getSessions({include_canceled: true}).run()
    .then(function(sessions) {
      assert(sessions.content.length >= 1);
    });
  });
});
