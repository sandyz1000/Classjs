(function (App) {

    App.services.HttpService = Class({
      tplMap : {},
      GetQuerystr : function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " ")); 
      },
      LoadTemplate : function (url, onSuccess, onError) {
        var self = this;
        if(self.tplMap[url]) {
          setTimeout(function () {
            onSuccess(self.tplMap[url]);
          }, 200);
          return 1;
        }

        var onResponse = function (result) {
          if(!self.tplMap[url]) self.tplMap[url] = result;
          onSuccess(result);
        };
        
        $.ajax({
            url: url, type: 'GET', success : onResponse, error : onError
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
