import $ from 'dom7';
import Framework7 from 'framework7/bundle';



// Import F7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';


// Import Routes
import routes from './routes.js';
// Import Store
import store from './store.js';

// Import main app component
import App from '../app.f7';


var app = new Framework7({
 
  name: 'AvantBar', // App name
  theme: 'auto', // Automatic theme detection
  el: '#app', // App root element
  component: App, // App main component
 
  // App store
  store: store,
  // App routes
  routes: routes,
  // Register service worker (only on production build)
  serviceWorker: process.env.NODE_ENV ==='production' ? {
    path: '/service-worker.js',
  } : {},
  on: {
    init: function () {
      var f7 = this;      
      var theme = this.theme;
      const useractual=  this.form.getFormData('#user');     
      console.log(useractual);
      if(window.location.search.length>0)
      {
        var query = this.utils.parseUrlQuery(window.location.href);
        if(query.gym)
          {
            f7.store.dispatch('setgym', query.gym=='1'?true:false);
          }
          if(query.m)
          {
            f7.store.dispatch('setmesa', query.m);  
          }
      }
      if(useractual)
      {
          f7.store.dispatch('setusuario', useractual);                      
      }
      f7.store.dispatch('autologin');    

/*
      if (theme == "ios") {
          this.data.soversion = 2;          
      }  
      else{
          this.data.soversion = 1;          
      }   */    
      
      ///this.methods.autoLogin(null); 
      
      
    },
  },
});
