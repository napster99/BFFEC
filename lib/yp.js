var Arbiter = require('./arbiter');

module.exports = (function(){

  var yp = {
      sub: Arbiter.subscribe
    , pub: Arbiter.publish
    , unsub: Arbiter.unsubscribe
    , resub: Arbiter.resubscribe
  };

  return yp;

})();