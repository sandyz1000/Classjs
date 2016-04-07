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
        App.instances.router.routes("add"); 
      },

      onBack : function (e) {
        App.instances.router.back(); 
      }
  });
  
  //Main View
  App.services.MainService = Class({
      tagname : 'div',
      className : 'row',
      dataset : [],
      gridTpl : null,
      init : function (dataset) {
        var self = this;
        this.dataset = dataset;

        App.instances.httpService.LoadTemplate('/public/scripts/templates/grid.html', 
          function (result) {
            self.gridTpl = result; 
            App.lib.event.emit("gridTemplateLoaded");
        });
        
        App.lib.event.on("deleteGridElement", function (id) {
          self.destroy(id);
        });

        App.lib.event.on("gridTemplateLoaded", function () {
          self.renderGrid();
        });
      },
      
      renderGrid : function () {
        var self = this;
        var counter = 0;
        for(var i =0; i< this.dataset.length; i++) {
          var gridView = new App.services.GridService(self.gridTpl);
          var node = gridView.render(this.dataset[i]).Element;
          this.Element.appendChild(node);
          if(i == this.dataset.length -1 ) {
            App.lib.event.emit("mainTemplateLoaded");
          }
        }
      },
      
      render : function () {
        return this;
      },

      destroy : function (id) {
        var isDestroyed = false;
        for(var index in this.dataset) {
          if(this.dataset[index].id == id) {
            this.dataset.splice(index, 1);
            isDestroyed = true;
            break;
          }
        }

        if(isDestroyed) this.renderGrid();
      },
  });

  //Grid View
  App.services.GridService = Class({
      events : {"#edit|^|click" : "onClickEdit", "#delete|^|click" : "onClickDelete" },
      tagname : 'div',
      className : 'col-md-12',
      attributes : {"style" : "border:1px solid #CCC;"},
      tpl : null,
      dataset : null,
      init : function (tpl) {
        this.tpl = tpl;
      },

      render : function (dataset) { 
        this.dataset = dataset;
        var _template = Handlebars.compile(this.tpl); 
        var _html = _template(dataset);
        $(this.Element).html(_html);
        return this; 
      },

      onClickEdit : function (evt) {
        var context = this.context;
        App.instances.router.routes("edit", {id : context.dataset.id });
      },

      onClickDelete : function (evt) {
        var context = this.context;
        App.lib.event.emit("deleteGridElement", context.dataset.id);
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
