import { val } from 'dom7';
import { createStore } from 'framework7';

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
  },
  getters: {
    products({ state }) {
      return state.products;
    },
    
    
    pedidosloading: ({ state }) => state.pedidosloading,
    pedidos: ({ state }) => state.pedidos,
    cantpedidospendientes: ({ state }) => state.pedidos.filter(c=>c.estado.id==1).length,
    generandopedido: ({ state }) => state.generandopedido,
    productosloading: ({ state }) => state.productosloading,
    productos: ({ state }) => state.productos,    
    productospedidos: ({ state }) => state.productos.filter(c=>c.pedido>0),    
    cantpedida: ({state}) => state.productos.reduce(function(a, b) {  return a + b.pedido; }, 0),
    importepedida: ({state}) => state.productos.reduce(function(a, b) {  return a + (b.pedido*b.price); }, 0),
    gym: ({ state }) => state.gym,    
    cancelandopedido: ({ state }) => state.cancelandopedido,
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

      if(state.generandopedido.value)
      {
        return;
      }
      state.generandopedido=true;
      fetch('http://localhost:8080/AvantBar/AjaxPedidosApp', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({operacion: 1, lista: state.productos.filter(c=>c.pedido>0).map(c=> { return  { id:c.id, cant:c.pedido };  } ) })
      })
      .then(res=>res.json())
      .then(json=>{
        console.log(json);

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
          app.f7.views.main.router.back(`/`, {reloadCurrent: true});    
          //app.f7.views.main.router.back("/",{ force:true}); 
        }
      })
      .catch(function(error) { console.log(error);    app.f7.dialog.alert(error); })
      .finally(function() {
        state.generandopedido=false;
      });
    },
    setgym({ state }, valor){//https://forum.framework7.io/t/f7-react-store-getter-is-not-reactive-on-updating-an-object-of-array/13283/6
      state.gym=valor;      
    },
    setproducto({ state }, e){//https://forum.framework7.io/t/f7-react-store-getter-is-not-reactive-on-updating-an-object-of-array/13283/6
      const index = state.productos.findIndex(p => p.id === e.id);      
      if (index > -1) {
        state.productos[index] = e;
        state.productos = [...state.productos];
      }      
    },
    cancelarpedido({ state ,dispatch}, idpedido){

      if(state.cancelandopedido.value)
      {
        return;
      }
          state.cancelandopedido=true;
          fetch('http://localhost:8080/AvantBar/AjaxPedidosApp?operacion=99&pedido='+idpedido)
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
            }
            state.productosloading = false;  
                
          })
          .catch(function(error) { console.log(error);   app.f7.dialog.alert(error); })
          .finally(function() {
            state.cancelandopedido = false; 
          });

    },
    
    getproductos({ state }) {
       state.productosloading = true;
       /*const response = await fetch('https://fakestoreapi.com/products/');
       const movies = await response.json();*/

       fetch('https://fakestoreapi.com/products/')
            .then(res=>res.json())
            .then(json=>{
              json.forEach(element => {
                element.stock=10;
                element.pedido=0;                
              });
              console.log(json);           
              state.productos=json;
              state.productosloading = false;      
            })
            .catch(function(error) { console.log(error);   app.f7.dialog.alert(error); })
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
    getpedidos({ state }) {
      state.pedidosloading = true;
     
      fetch('http://localhost:8080/AvantBar/AjaxPedidosApp')
           .then(res=>res.json())
           .then(json=>{            
             console.log(json);
             state.pedidosloading = false;   
             if(json.status==1)
             {
               app.f7.dialog.alert(json.mensaje);
             }else{
              state.pedidos=json.data;
             }
                  
           })
           .catch(function(error) { console.log(error);   app.f7.dialog.alert(error); })
           .finally(function() {
            state.pedidosloading = false; 
           });
    
   },
  },
})
export default store;
