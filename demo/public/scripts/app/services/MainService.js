(function (App) {

  App.services.HeaderService = Class({
      events : {"#home|^|click" : "onNavigateHome", "#new|^|click" : "onClickNew" , "#back|^|click" : "onBack"},
      tagname : 'nav',
      className : 'navbar navbar-default',
      attributes : {},
      init : function () {
        var self = this;
        App.instances.httpService.LoadTemplate('/public/scripts/templates/header.html', 
          function (result) {
            $(self.Element).html(result);
            App.lib.event.emit("headerTemplateLoaded");
        });
      },

      render : function () { return this; },

      onNavigateHome : function (e) {
      
      },

      onClickNew : function (e) {
        App.instances.router.routes("new"); 
      },

      onBack : function (e) {
      
      }
  });
  
  //Main View
  App.services.MainService = Class({
      tagname : 'div',
      className : 'row',
      dataset : [],
      init : function (dataset) {
        var self = this;
        this.dataset = dataset;

        self.renderGrid();
        App.lib.event.on("deleteGridElement", function (id) {
          self.destroy(id);
        });
      },
      
      renderGrid : function () {
        var self = this;
        var counter = 0;
        this.dataset.forEach(function (value, index) {
          var gridView = new App.services.GridService();
          setTimeout(function () {
            self.appendGrid(gridView, value);
            counter ++;
          }, 200);
        }); 
          
        //Broadcast on template loaded completely
        var interval = setInterval(function () {
          if(counter == self.dataset.length) {
            clearInterval(interval);
            App.lib.event.emit("mainTemplateLoaded");
          }
        }, 200);
      },
      
      appendGrid : function (gridView, value) {
        $(this.Element).append(gridView.render(value).Element);
      },
      
      render : function () {
        return this;
      },

      destroy : function (id) {
        for(var index in this.dataset) {
          if(this.dataset[index].id == id) {
            this.dataset.splice(index, 1);
            break;
          }
        }

        this.renderGrid();
      },
  });

  //Grid View
  App.services.GridService = Class({
      events : {"#edit|^|click" : "onClickEdit", "#delete|^|click" : "onClickDelete" },
      tagname : 'div',
      className : 'row',
      attributes : {"style" : "border:1px solid #CCC;"},
      tpl : null,
      dataset : null,
      init : function () {
        var self = this;
        App.instances.httpService.LoadTemplate('/public/scripts/templates/grid.html', 
          function (result) {
            self.tpl = result; 
        });
      },

      render : function (dataset) { 
        this.dataset = dataset;
        var _template = Handlebars.compile(this.tpl); 
        var _html = _template(dataset);
        $(this.Element).html(_html);
        return this; 
      },

      onClickEdit : function (evt) {
        var self = this.context;
        App.instances.router.routes("edit", {id : self.dataset.id });
      },

      onClickDelete : function (evt) {
        var self = this.context;
        App.lib.event.emit("deleteGridElement", self.dataset.id);
      }
  });
  
  //Edit View
  App.services.EditService = Class({
      events : { "#save|^|click" : "saveEdit", "#cancel|^|click" : "saveCancel" },
      tagname : 'div',
      className : '',
      attributes : {},
      isAdd : true,
      dataset : {} ,
      init : function (isAdd, dataset) {
        var self = this;
        App.instances.httpService.LoadTemplate('/public/scripts/templates/edit.html', 
          function (result) {
            self.tpl = result; 
            App.lib.event.emit("editTemplateLoaded");
        });
      },

      render : function () { 
        var self = this;
        var _template = Handlebars.compile(this.tpl); 
        if(!this.isAdd && this.dataset) {
          _html = _template(this.dataset);
          $(self.Element).html(_html);
        }
        else {
          _html = _template({note: "", title : ""});
          $(self.Element).html(_html);
        }
        return this; 
      },

      saveEdit : function (evt) {
        var self = evt.context;
        var title = "New title from edit";
        var note = "This is a simple note";
        if(self.isAdd) {
          var id = App.instance.router.dataset.length + 1; // Set dummy id based on max length
          App.instance.router.dataset.push({id : id, title : title, note : note}); 
        }
        else {
          App.instance.router.dataset.forEach(function (value, key) {
            if(value.id == id) {
              value.title = title;
              value.note = note;
            }
          });
        }
        App.instance.router.routes("main");
      },

      saveCancel : function () {
        App.instance.router.routes("main");
      }
  });

  //Error view
  App.services.ErrorService = Class({
      events : {},
      tagname : 'div',
      className : 'error',
      attributes : {},
      init : function () {
        var self = this;
        App.instances.httpService.LoadTemplate('/public/scripts/templates/error.html', 
          function (result) {
            $(self.Element).html(result);
          });
      },
      
      render : function () { return this; },
  });

})(App);
