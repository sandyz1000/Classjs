// Author: Sandip
// version: 0.1 


var EventEmitter = function(){
  this.events = {};
  
  if(!Object.prototype.IsFunction) {
    Object.prototype.IsFunction = function(){
      return typeof Object === 'function';
    };
  }
  
  this.on = function(eventname, callback){
    if(!callback.IsFunction())
      throw TypeError('Listener must be function');

    if(!this.events[eventname]) this.events[eventname] = [];
    this.events[eventname].push(callback);

    return this;
  };
  
  this.emit = function(eventname){
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.events[eventname]) {
      this.events[eventname].forEach(function(callback) {
        callback.apply(this, args);
      });
    }
    return this;
  };
  
  this.once = function(eventname, callback){
    if(!callback.IsFunction())
      throw TypeError("Listener must be function");
    var isFired = false;

    var g = function() {
      this.removeListener(eventname, g);
      if(!isFired) {
        isFired = true;
        callback.apply(this, arguments);
      }
    };

    this.on(eventname, g);
    return this;
  };

  this.removeListener = function(eventname, callback){	
    if(!callback.IsFunction())
      throw TypeError("Listener is not a function");

    var list = this.events[eventname];
    var position = -1;
    if(list.length > 0) {
      for(var i=0;i<list.length;i++) {
        if(list[i] === callback) 
          position = i; break;
      }
    }
    if(position < 0) return this;

    list.splice(position, 1);
    return this;
  };
  
  this.removeAllListener = function(eventname){
    if(this.events[eventname])
      delete this.events[eventname];

    return this;
  };
  
  this.listeners = function(type){
    var ret;
    if (!this.events || !this.events[type])
      ret = [];
    else if (this.events[type].IsFunction())
      ret = [this.events[type]];
    else
      ret = this.events[type].slice();

    return ret;
  };
};
