/*
 *  Author : Sandip
 *  Version : 1.0
 *  Phase: beta
 *  Description: A micro framework to manage your view within DOM. It can auto bind an event to an callback defined in the class. 
 *  With support of auto binding you don't have to define event handler every time in your view. 
 *  You can even manage your micro view in a service class, and you can dynamically load your template with handlebars, underscore or any other 
 *  templating framework. 
 */

 (function (window) {
    var MyElement = function () {
      this.createElement = function(selector, _ref){
        if(!selector) return this;

        return document.createElement(selector);
      };
      
      this.addAttribute = function(element, attributes){
        if(!element) return this;

        for(var a in attributes) {
          if(attributes.hasOwnProperty(a) && !element.getAttribute(a))
            element.setAttribute(a, attributes[a]);
        }
        return this;
      };
      
      this.addClass = function(element, className){
        if(!element) return this;

        if(element.className.indexOf(className) == -1)
          element.className += className;

        return this;
      };
    };
    
    // This is the framework core where it will manage the view
    // and it contain Mutation observer whose job is observe any dom change and 
    // bind the callback to an event
    window.Class = function (Object) {
      //Return jsClass method
      var jsClass = function() {
        var self = this;

        var _el = new MyElement();
        var ce = function (name) {
          var el = _el.createElement(name || 'div');
          return el;
        };
        if(!this.Element) {
          this.Element = ce(jsClass.prototype.tagname);
          if(jsClass.prototype.attributes)
            _el.addAttribute(this.Element, jsClass.prototype.attributes);
          if(jsClass.prototype.className)
            _el.addClass(this.Element, jsClass.prototype.className);
        }
        
        mutator.call(this, this.Element); 
        
        var eventsMap = {};      
        String.prototype.hashCode = function() {
          var hash = 0, i, chr, len;
          if (this.length === 0) return hash;
          for (i = 0, len = this.length; i < len; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
          }
          return hash;
        };

        function finder(elem, selector) {
          var result = [];
          var plain_name = selector;
          if(selector.indexOf(".") === 0 || selector.indexOf("#") === 0) { 
            plain_name = selector.substring(1, selector.length);
          }
          var cond = elem.className.indexOf(plain_name) > -1  || elem.id == plain_name || elem.tagName == plain_name.toUpperCase();  
          if(cond) { result.push(elem); }

          var nodes = elem.querySelectorAll(selector);
          // if(nodes.length > 0) result = result.concat(nodes);
          for(var n=0;n<nodes.length;n++){ 
            result.push(nodes[n]);
          } 
          return result;
        }

        function event_binder(elem) {
          var events = jsClass.prototype.events;
          for(var evt in events) {
            if(!events.hasOwnProperty(evt)) continue;

            var _se = evt.split('|^|');
            var selector = finder(elem, _se[0]);
            for(var s=0;s<selector.length;s++) {
              var _data = { 
                handleEvent : self[events[evt]],
                context : self
              };
              if(eventsMap[_se[0]]) { selector[s].removeEventListener(_se[1], eventsMap[_se[0]], false); }
              selector[s].addEventListener(_se[1], _data, false);
              eventsMap[_se[0]] = _data;
            }
          } 
        }

        function handler(elems) {
          mutations = [];
          if(!(mutations instanceof Array)) mutations.push(elems);
          else mutations = elems;

          for(var j=0;j<mutations.length;j++) {
            var mutation = mutations[j];
            var $el = mutation.target; 
            if(window.MutationRecord && mutation instanceof MutationRecord) {
              var addedNodes = mutation.addedNodes;
              for(var i=0; i<addedNodes.length;i++) {
                var cond = mutation.addedNodes[i].nodeName == '#text' || mutation.addedNodes[i].nodeName == "#comment";
                if (cond) continue; 
                event_binder(mutation.addedNodes[i]);
              } 
            }
            else {
              event_binder($el);
            }
          }
        }

        function mutator (targetNode) {
          var observer;
          if(typeof MutationObserver !== "undefined") {
            observer = new MutationObserver(handler);

            // Listen to all changes to body and child nodes
            observer.observe(targetNode, {
                attributes: true,
                childList: true,
                characterData: true
            });
          }
          else if(typeof WebkitMutationObserver !== "undefined") {
            observer = new WebkitMutationObserver(handler);

            // Listen to all changes to body and child nodes
            observer.observe(targetNode, {
                attributes: true,
                childList: true,
                characterData: true
            });
          }
        }

        // Invoke constructor method
        this.init.apply(this, arguments);
      };

      // Append all the property to returned class
      for(var prop in Object) {
        if(Object.hasOwnProperty(prop)) {
          jsClass.prototype[prop] = Object[prop];			
        }
      }
      
      if(!jsClass.prototype.init)
        jsClass.prototype.init = function(){ };

      return jsClass;
    };
})(window);
