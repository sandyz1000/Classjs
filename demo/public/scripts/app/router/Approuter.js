(function (App) {
    App.Router = function() {
      this.currentState = null;
      this.previousState = null;
      this.states = {
        "main" : {"state" : {state:1, rand:Math.random()}, "title" : "Main", "path" : "?state=main" },
        "edit" : {"state" : {state:2, rand:Math.random()}, "title" : "Edit", "path" : "?state=edit" },
        "add" : {"state" : {state:3, rand:Math.random()}, "title" : "Add", "path" : "?state=add" },
        "error" : {"state" : {state:4, rand:Math.random()}, "title" : "Error", "path" : "?state=error" },
      };  
      
      function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        url = url.toLowerCase(); // This is just to avoid case sensitiveness  
        name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
      
      this.routes = function (path, data) {
        if(!this.states[path])
          throw new Error("Path not found");

        var state = this.states[path];
        var myPath = state.path;
        if(!data) data = {};
        for(var d in data) {
          if(!data.hasOwnProperty(d)) continue;
          myPath += ("&" + d + "=" + data[d]);
        }
        History.pushState(state.state, state.title, myPath);
      };

      this.back = function () {
        History.back();
      };
      
      this.navigate = function (state, data) {
        var hash = state.hash.substring(state.hash.indexOf("?") + 1, state.hash.length - 1);
        var query = hash.split("&");
        var _queryString = {};
        this.previousState = this.currentState;
        this.currentState = state.data;
        query.forEach(function (value, index) {
          var _e = value.split("=");
          _queryString[_e[0]] = _e[1];
        });

        switch(_queryString.state) {
          case "main":
            this.renderMainView();
            break;
          case "add":
            this.renderAddView();
            break;
          case "edit":
            this.renderEditView();
            break;
          case "error":
            this.renderErrorView();
            break;
          default:
            this.renderMainView();
        }
      };
     
      this.dataset = [
        {id : 1, "title" : "Title 1", "note" : "This is my first note"},
        {id : 2, "title" : "Title 2", "note" : "This is my second note"},
        {id : 3, "title" : "Title 3", "note" : "This is my third note"},
        {id : 4, "title" : "Title 4", "note" : "This is my note"},
        {id : 5, "title" : "Title 5", "note" : "This is my note"},
        {id : 6, "title" : "Title 6", "note" : "This is my note"},
        {id : 7, "title" : "Title 7", "note" : "This is my note"},
        {id : 8, "title" : "Title 8", "note" : "This is my note"},
        {id : 9, "title" : "Title 9", "note" : "This is my note"},
      ];

      this.defaultView = function () {
        var currentPath = getParameterByName("state");
        //Render Header 
        var headerView = new App.services.HeaderService();
        App.lib.event.on("headerTemplateLoaded", function () {
          $(".header").html(headerView.render().Element);
        });
        this.routes(currentPath || "main");
      };
      
      this.renderMainView = function () {
        var mainView = new App.services.MainService(this.dataset);
        App.lib.event.on("mainTemplateLoaded", function () {
          $(".container").html(mainView.render().Element);
        });
      };
      
      this.renderEditView = function () {
        //Get the id from the url
        var id = App.instances.httpService.GetQuerystr("id");
        var edit_data = null;
        this.dataset.forEach(function (value) {
          if(value.id == id)
            edit_data = value;
        });
        var view = new App.services.EditService(false, edit_data);
        App.lib.event.on("editTemplateLoaded", function () {
          $(".container").html(view.render().Element);
        });
      };
      
      this.renderErrorView = function () {
        var view = new App.services.ErrorService();
        $(".container").html(view.render().Element);
      };

      this.renderAddView = function () {
        var view = new App.services.EditService(true, null);
        App.lib.event.on("editTemplateLoaded", function () {
          $(".container").html(view.render().Element);
        });
      };
    };
})(App);
