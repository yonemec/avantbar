
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

    loading: false,
    productos: [],

  },
  getters: {
    products({ state }) {
      return state.products;
    },
    loading({ state }) {
      return state.loading;
    },
    productos({ state }) {
      return state.productos;
    },
  },
  actions: {
    getProductos({ state }) {
      console.log("getProductos");
      state.loading = true;
      let objeto={};
      objeto.operacion=0;

      fetch('http://localhost:8080/AvantBar/AjaxItemsApp')
      .then((res) => res.json())
      .then((productos) => {
        console.log(productos);
        state.productos = productos;
      })

      /*app.request.postJSON('http://localhost:8080/AvantBar/AjaxItemsApp', { user:'foo', password: 'bar' })
      .then(function (res) {
        console.log(res.data);
      });*/

      /*  app.request.json('http://localhost:8080/AvantBar/AjaxItemsApp', "", function (data) {
          app.preloader.hide();
          if (data.status == 1) {
              app.dialog.alert(data.mensaje);
          } else {
              app.methods.mensaje("Correo enviado");
              app.views.main.router.back();
          }
      }, function (xhr, status) {
          
          app.preloader.hide();
          app.dialog.alert("Conexi&oacute;n perdida!");
      });*/
    },
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
  },
})
export default store;
