
import { createStore } from 'framework7';
import Framework7 from 'framework7/bundle';

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
    generandopedido:false
  },
  getters: {
    products({ state }) {
      return state.products;
    },
    generandopedido: ({ state }) => state.generandopedido,
    productosloading: ({ state }) => state.productosloading,
    productos: ({ state }) => state.productos,    
    productospedidos: ({ state }) => state.productos.filter(c=>c.pedido>0),    
    //cantpedida: ({state}) => state.productos.reduce((a, b) => a.pedido + b.pedido, 0),
    cantpedida: ({state}) => state.productos.reduce(function(a, b) {  return a + b.pedido; }, 0),
    importepedida: ({state}) => state.productos.reduce(function(a, b) {  return a + (b.pedido*b.price); }, 0),
    
  },
  actions: {
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
    generarpedido({state}){//https://stackoverflow.com/questions/29775797/fetch-post-json-data
    
        console.log(state.productos.filter(c=>c.pedido>0).map(c=> { return  { id:c.id, cant:c.pedido };  }));

          let algo=JSON.stringify(state.productos.filter(c=>c.pedido>0).map(c=> { return  { id:c.id, cant:c.pedido };  }));
        Framework7.request.json('http://localhost:8080/AvantBar/AjaxPedidosApp?')
        .then(function (res) {         
          console.log(res);         
        });

        /*Framework7.request.postJSON('http://localhost:8080/AvantBar/AjaxPedidosApp', state.productos.filter(c=>c.pedido>0).map(c=> { return  { id:c.id, cant:c.pedido };  }))
        .then(function (res) {
          console.log(res.data);
        });*/
        
    },
    setproducto({ state }, e){//https://forum.framework7.io/t/f7-react-store-getter-is-not-reactive-on-updating-an-object-of-array/13283/6
      
      const index = state.productos.findIndex(p => p.id === e.id);      
      if (index > -1) {
        state.productos[index] = e;
        state.productos = [...state.productos];
      }      
    },
   
   
    getproductos({ state }) {
       state.productosloading = true;      
        
       /*const response = await fetch('https://fakestoreapi.com/products/');
       const movies = await response.json();*/

       fetch('https://fakestoreapi.com/products/')
            .then(res=>res.json())
            .then(json=>{
              console.log(json);   
              json.forEach(element => {
                element.stock=10;
                element.pedido=0;                
              });
              console.log(json);           
              state.productos=json;
              state.productosloading = false;      
            })
      
      /*Framework7.request.json('https://fakestoreapi.com/products/', { operacion: 0})
      .then(function (res) {
        state.productos=res.data;
        console.log(res);
        state.productosloading = false;      
      });*/


    },
  },
})
export default store;
