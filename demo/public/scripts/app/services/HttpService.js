(function (App) {

    App.services.HttpService = Class({
      GetQuerystr : function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " ")); 
      },
      LoadTemplate : function (url, onSuccess, onError) {
        $.ajax({
            url: url, type: 'GET', success : onSuccess, error : onError
        });
      },
      
      SetAuthHeader : function (request) {
        var object = App.instances.ls.fetchFromSession("_token");
        if(!object || !object.data) return; 
        var data = object.data,
          dateString = object.timestamp,
          now = new Date().getTime().toString();
        
        if(data) request.setRequestHeader("Authorization", data);
      },
      
      PostRequest : function (url, data, headers, onSuccess, onError) {
        var self = this;
        var _beforeSend = function (request) {
          self.SetAuthHeader(request);
          for(var header in headers) {
            if(!headers.hasOwnProperty(header)) continue;
            request.setRequestHeader(header, headers[header]);
          }
        };
        $.ajax({
            url : url, beforeSend : _beforeSend, dataType:"json", data:JSON.stringify(data), type : "post", success : onSuccess, error : onError
        });  
      },

      GetRequest : function (url, params, headers, onSuccess, onError) {
        var self = this;
        var _beforeSend = function (request) {
          self.SetAuthHeader(request);
          for(var header in headers) {
            if(!headers.hasOwnProperty(header) || !headers[header]) continue;
            request.setRequestHeader(header, headers[header]);
          }
        };
        
        if(params) {
          var counter = 0;
          for(var p in params) {
            if(!params.hasOwnProperty(p) || !params[p]) continue;
            if(counter === 0)
              url += "?" + p + "=" + params[p];
            else
              url += "&" + p + "=" + params[p];

            counter++;
          }
        }
        $.ajax({
          url : url, beforeSend: _beforeSend, dataType:"json", type : "get", success : onSuccess, error : onError
        });  
      }
    });
}(App));
