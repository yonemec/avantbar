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
      

      
      var ws_monitor=null;

      "use strict";
      var Chat = {};
      Chat.socket = null;
      Chat.connect = (function(host) {
          if ('WebSocket' in window) {
              Chat.socket = new WebSocket(host);
          } else if ('MozWebSocket' in window) {
              Chat.socket = new MozWebSocket(host);
          } else {
              Console.log('Error:las conexiones web chat no estan soportados en este navegador.');
              return;
          }
          Chat.socket.onopen = function () {
            $("#ws_estado").attr("title","CONECTADO").css("color","green");
            if(ws_monitor!=null)
          {
           clearInterval(ws_monitor);
          }
            
              Console.log('Info: conexion abierta');
          };
          Chat.socket.onclose = function () {
            $("#ws_estado").attr("title","DESCONECTADO").css("color","red");
            if(ws_monitor!=null)
              {
               clearInterval(ws_monitor);
              }
            ws_monitor= setInterval(function (){
              console.log("conectando");
              $("#ws_estado").attr("title","CONECTANDO...").css("color","orange");
              console.log(Chat.socket.readyState);
              Chat.initialize();
            }, 3000);
              Console.log('Info: conexion cerrada.');
          };
          Chat.socket.onmessage = function (message) {
            //http://django-websocket-redis.readthedocs.io/en/latest/heartbeats.html
            missed_heartbeats = 0;
            $("#ws_estado").attr("title","CONECTADO").css("color","green");
            
            console.log(message);
              //var data= jQuery.parseJSON(message.data);
             
            var data= JSON.parse(message.data);
              Console.log(message.data);
              switch (data.tipo) {
                   case 1:
                    AjaxPedidosMesas();
                    if(data.subtipo==1)
                    {
                  UIkit.notify("Nuevo pedido creado", {status:'success'});	
                }
                else if(data.subtipo==2)
                    {
                  UIkit.notify("Pedido eliminado", {status:'danger'});	
                }
                  break;
            default:
              break;
          }    	
          };
      });
      
      
      Chat.initialize = function() {	
          if (window.location.protocol == 'http:') {
             Chat.connect('ws://app.avantbar.com.ar:11232/websocket/chat');     	     	 
          } else {
              Chat.connect('wss://app.avantbar.com.ar:11231/websocket/chat');
          }
      };
      
      Chat.sendMessage = (function() {
          var message = document.getElementById('chat').value;
          if (message != '') {
              Chat.socket.send(message);
              document.getElementById('chat').value = '';
          }
      });
      var Console = {};
      Console.log = (function(message) {
        
        //console.log(message);
        
        /*  var console = document.getElementById('console');
          var p = document.createElement('p');
          p.style.wordWrap = 'break-word';
          p.innerHTML = message;
          console.appendChild(p);
          while (console.childNodes.length > 125) {
              console.removeChild(console.firstChild);
          }
          console.scrollTop = console.scrollHeight;*/
      });
      
      Chat.initialize();








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
