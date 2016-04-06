(function (App, History, EventEmitter) {
    
    App.lib.event = new EventEmitter();
    App.instances.router = new App.Router();
    App.instances.httpService = new App.services.HttpService();

    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
      var State = History.getState(); // Note: We are using History.getState() instead of event.state
      History.log('statechange:', State.data, State.title, State.url);
      App.instances.router.navigate(State);
    });

    //Load the default view
    App.instances.router.defaultView();
})(App, History, EventEmitter);
