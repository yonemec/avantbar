import { val } from 'dom7';
import { createStore } from 'framework7';
import { getAuth, signInWithPopup, GoogleAuthProvider , OAuthProvider, FacebookAuthProvider  } from "firebase/auth";


const store = createStore({
  state: {
    products: [
      {
        id: '1',
        title: 'Apple iPhone 8',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
      },
      {
        id: '2',
        title: 'Apple iPhone 8 Plus',
        description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
      },
      {
        id: '3',
        title: 'Apple iPhone X',
        description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
      },
    ],
    productos: [],
    productosloading: false,
    generandopedido:false, 
    pedidosloading:false,   
    gym:false,   
    pedidos:[],
    cancelandopedido:false,
    mesa:0,
    listamesas:[],
    usuarioloading:false,
    loginloading:false,
    usuario:{id:0, nombre:'', imei:0, uid:null},
  },
  getters: {
    products({ state }) {
      return state.products;
    },    
    mesa: ({ state }) => state.mesa,
    listamesas: ({ state }) => state.listamesas,
    pedidosloading: ({ state }) => state.pedidosloading,
    pedidos: ({ state }) => state.pedidos,
    cantpedidospendientes: ({ state }) => state.pedidos.filter(c=>c.estado.id==1).length,
    generandopedido: ({ state }) => state.generandopedido,
    productosloading: ({ state }) => state.productosloading,
    productos: ({ state }) => state.gym?state.productos.filter(c=>c.grupo.id==6): state.productos,    
    productospedidos: ({ state }) => state.productos.filter(c=>c.pedido>0),    
    cantpedida: ({state}) => state.productos.reduce(function(a, b) {  return a + b.pedido; }, 0),
    importepedida: ({state}) => state.productos.reduce(function(a, b) {  return a + (b.pedido*b.precio); }, 0),
    gym: ({ state }) => state.gym,    
    cancelandopedido: ({ state }) => state.cancelandopedido,
    usuario:({ state }) => state.usuario,
    usuarioloading: ({ state }) => state.usuarioloading,
    loginloading: ({ state }) => state.loginloading,
    
  },

  actions: {
    resetearcarrito({state}){
      state.productos.forEach(c=>c.pedido=0);
      state.productos=[...state.productos];
    },
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
    generarpedido({state,dispatch }){//https://stackoverflow.com/questions/29775797/fetch-post-json-data
      if(state.generandopedido)
      {
        return;
      }
      state.generandopedido=true;      
      fetch(urlrequest+'AjaxPedidosApp?mesa='+state.mesa+'&idautologin='+state.usuario.id+'&imei='+state.usuario.imei, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({operacion: 1, lista: state.productos.filter(c=>c.pedido>0).map(c=> { return  { id:c.id, cant:c.pedido };  } ) })
      })
      .then(res=>res.json())
      .then(json=>{
        if(json.status==1)
        {
          app.f7.dialog.alert(json.mensaje);
        }else{

          var notificationFull = app.f7.notification.create({
            icon: '<i class="icon f7-icons">checkmark_2</i>',
            title: 'AvantBar',
            titleRightText: "#"+json.data,
            subtitle: 'Su pedido fue creado con exito',
            text: '',
            closeTimeout: 3000,
          });                          
          notificationFull.open();
          dispatch('resetearcarrito'); 
          dispatch('getpedidos');         
          app.f7.views.main.router.navigate(`/`, {reloadCurrent: true});             
          //app.f7.views.main.router.back("/",{ force:true}); 
        }
      })
      .catch(function(error) {    app.f7.dialog.alert(error); })
      .finally(function() {
        state.generandopedido=false;
      });
    },
    setgym({ state }, valor){//https://forum.framework7.io/t/f7-react-store-getter-is-not-reactive-on-updating-an-object-of-array/13283/6
      state.gym=valor;      
    },
    setmesa({ state }, valor){
      console.log("setmesa:",valor);      
      state.mesa=valor;      
    },
    setproducto({ state }, e){
      const index = state.productos.findIndex(p => p.id === e.id);      
      if (index > -1) {
        state.productos[index] = e;
        state.productos = [...state.productos];
      }      
    },
    setusuario({ state,dispatch }, e){
        state.usuario=e;        
        dispatch('saludar');
    },
    crearcuenta({state,dispatch},user)
    {
     
          if(state.loginloading)
          {
            return;
          }
            console.log(user);
        
            state.loginloading=true;
            fetch(urlrequest+'AjaxUsuariosApp?operacion=1&idautologin='+state.usuario.id+'&imei='+state.usuario.imei, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({id: state.usuario.id, imei:state.usuario.imei, uid:user.uid, correo:user.email, nombre:user.displayName, imagen:user.photoURL  } )
            })
            .then(res=>res.json())
            .then(json=>{
              state.loginloading = false; 
              if(json.status==1)
              {
                app.f7.dialog.alert(json.mensaje);
              }else{
                  const user=json.data;
                  state.usuario=user;                                    
                  app.f7.form.storeFormData('#user', user);
                  var algo= app.f7.form.getFormData('#user');   
                  dispatch('saludar');
                  dispatch('getpedidos');
                 
              }
            })
            .catch(function(error) {   app.f7.dialog.alert(error); })
            .finally(function() {
              state.loginloading = false; 
            });

    },
    logingoogle({ state,dispatch }){
            const provider = new GoogleAuthProvider();
              provider.setCustomParameters({
              // Localize the Apple authentication screen in French.
              locale: 'es'
            });
            const auth = getAuth();
            auth.languageCode = 'es';
            signInWithPopup(auth, provider)
              .then((result) => {
                console.log(result);
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log(token);
                // The signed-in user info.
                const user = result.user;
                dispatch('crearcuenta',user);
                console.log(user);
                // ...
              }).catch((error) => {
                console.log(error);
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
              });
    },
   loginfacebook({ state,dispatch }){
                  const provider = new FacebookAuthProvider();
                    provider.setCustomParameters({
                    // Localize the Apple authentication screen in French.
                    locale: 'es'
                  });
                  const auth = getAuth();
                  auth.languageCode = 'es';
                  signInWithPopup(auth, provider)
                  .then((result) => {
                    // The signed-in user info.
                    const user = result.user;
                    dispatch('crearcuenta',user);
                    console.log(user);
                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    const credential = FacebookAuthProvider.credentialFromResult(result);
                    const accessToken = credential.accessToken;
                
                    // ...
                  })
                  .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = FacebookAuthProvider.credentialFromError(error);
                
                    // ...
                  });
    },
    loginapple({ state , dispatch }){
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      
      provider.setCustomParameters({
        // Localize the Apple authentication screen in French.
        locale: 'es'
      });
      const auth = getAuth();
      auth.languageCode = 'es';
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log(result);
           // The signed-in user info.
            console.log(result);
            const user = result.user;
            dispatch('crearcuenta',user);
            console.log(user);
            // Apple credential
            const credential = OAuthProvider.credentialFromResult(result);
            console.log(credential);
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
            console.log(accessToken);
            console.log(idToken);
          // ...
        }).catch((error) => {
          console.log(error);
                // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The credential that was used.
            const credential = OAuthProvider.credentialFromError(error);
          // ...
        });
  },
    salir({state,dispatch}){
        app.f7.form.storeFormData('#user', null);
        state.usuario={id:0, nombre:'',imei:0,uid:null};
        state.pedidos=[];
        state.productos.forEach(element => {
          element.pedido=0;                
        });             
        state.productos=[...state.productos];     
        dispatch('crearinvitado');  
    },
    saludar({ state }){


      console.log("saludar");
      var notificationFull = app.f7.notification.create({
        icon: '<i class="icon f7-icons">person_fill</i>',
        title: 'AvantBar',
        titleRightText: "",
        subtitle: 'Bienvenido  '+state.usuario.nombre,
        text: '',
        closeTimeout: 3000,
      });                          
      notificationFull.open();  
    },
    crearinvitado({ state,dispatch }){    //login o crear usuario  
      
        if(state.usuarioloading)
        {
          return;
        }
       
          state.usuarioloading=true;
          fetch(urlrequest+'AjaxUsuariosApp?idautologin='+state.usuario.id+'&imei='+state.usuario.imei)
          .then(res=>res.json())
          .then(json=>{
            state.usuarioloading = false; 
            if(json.status==1)
            {
              app.f7.dialog.alert(json.mensaje);
            }else{
                const user=json.data;
                state.usuario=user;
                app.f7.form.storeFormData('#user', user);
                var algo= app.f7.form.getFormData('#user');   
                dispatch('saludar');
            }
          })
          .catch(function(error) {   app.f7.dialog.alert(error); })
          .finally(function() {
            state.usuarioloading = false; 
          });

    },
    cancelarpedido({ state ,dispatch}, idpedido){

      if(state.cancelandopedido)
      {
        return;
      }
          state.cancelandopedido=true;
          fetch(urlrequest+'AjaxPedidosApp?operacion=99&pedido='+idpedido+'&idautologin='+state.usuario.id+'&imei='+state.usuario.imei)
          .then(res=>res.json())
          .then(json=>{
            state.cancelandopedido = false; 
            if(json.status==1)
            {
              app.f7.dialog.alert(json.mensaje);
            }else{
              //app.f7.views.main.router.back(`/`, {reloadCurrent: true});
              //app.f7.views[1].router.back("/pedidos",{ force:true, ignoreCache:true}); //posicion 2 de tab, main es principal
              app.f7.views[1].router.back(); //posicion 2 de tab, main es principal
              dispatch('getpedidos');
              var notificationFull = app.f7.notification.create({
                icon: '<i class="icon f7-icons">checkmark_2</i>',
                title: 'AvantBar',
                titleRightText: "",
                subtitle: 'Su pedido fue cancelado con exito',
                text: '',
                closeTimeout: 3000,
              });                          
              notificationFull.open();              
            }
                
          })
          .catch(function(error) {   app.f7.dialog.alert(error); })
          .finally(function() {
            state.cancelandopedido = false; 
          });
    },
    getitems({ state }) {
       state.productosloading = true;
       /*const response = await fetch('https://fakestoreapi.com/products/');
       const movies = await response.json();*/

      // fetch('https://fakestoreapi.com/products/')
      fetch(urlrequest+'AjaxItemsApp?idautologin='+state.usuario.id+'&imei='+state.usuario.imei)      
            .then(res=>res.json())
            .then(json=>{
              json.data.forEach(element => {
                element.pedido=0;                
              });             
              state.productos=json.data;      
              console.log(json.data);  

            })
            .catch(function(error) {   app.f7.dialog.alert(error); })
            .finally(function() {
              state.productosloading = false; 
             /* (async () => {
                const rawResponse = await fetch('http://localhost:8080/AvantBar/AjaxPedidosApp', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({operacion: 1, lista: state.productos.map(c=> { return  { id:c.id, cant:c.pedido };  } ) })
                });
                const content = await rawResponse.json();              
                console.log(content);
              })();*/
            });
    },
    getmesas({ state }) {
      app.f7.preloader.show();
      fetch(urlrequest+'AjaxMesas?operacion=0&estado=1&idautologin='+state.usuario.id+'&imei='+state.usuario.imei)
           .then(res=>res.json())
           .then(json=>{        
             app.f7.preloader.hide();    
                      
             if(json.status==1)
             {
               app.f7.dialog.alert(json.mensaje);
             }else{
              state.listamesas=json.data;
             }
           })
           .catch(function(error) {   app.f7.dialog.alert(error); })
           .finally(function() {
              app.f7.preloader.hide();
           });
    
   },
    getpedidos({ state }) {
      if(state.usuario.id>0)
      {
        state.pedidosloading = true;     
        fetch(urlrequest+'AjaxPedidosApp?idautologin='+state.usuario.id+'&imei='+state.usuario.imei)
             .then(res=>res.json())
             .then(json=>{                        
               state.pedidosloading = false;   
               if(json.status==1)
               {
                 app.f7.dialog.alert(json.mensaje);
               }else{
                state.pedidos=json.data;
               }                  
             })
             .catch(function(error) {   app.f7.dialog.alert(error); })
             .finally(function() {
              state.pedidosloading = false; 
             });
      }
     
    
   },
  },
})
export default store;
