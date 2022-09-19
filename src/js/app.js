import $ from 'dom7';
import Framework7 from 'framework7/bundle';
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLXDM6rLFUK1s3k9WFw2XDXsNEFTuBJCY",
  authDomain: "avantbar-4d6b3.firebaseapp.com",
  projectId: "avantbar-4d6b3",
  storageBucket: "avantbar-4d6b3.appspot.com",
  messagingSenderId: "751703153517",
  appId: "1:751703153517:web:d2bc61ed49f6ff676f9864",
  measurementId: "G-SDW9J19GLW"
};


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
      console.log("desde appjs,",useractual);
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
      }else{
         f7.store.dispatch('crearinvitado');  
      }
      
      try{
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const auth = getAuth(app);
      }catch(error)
      {
        console.log(error);
      }
      

      ///f7.store.dispatch('loginfacebook');  

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
