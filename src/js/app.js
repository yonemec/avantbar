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
      console.log(theme);
      var formData = {
        'name': 'John',
        'email': 'john@doe.com',
        'gender': 'female',
        'toggle': ['yes'],
      }
      this.form.storeFormData('#carrito', formData);
      const algo=  this.form.getFormData('#carrito', formData);     
      var query = this.utils.parseUrlQuery(window.location.href);
      f7.store.dispatch('setgym', query.gym=='1'?true:false);

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
