
import HomePage from '../pages/home.f7';
import AboutPage from '../pages/about.f7';
import FormPage from '../pages/form.f7';
import CatalogPage from '../pages/catalog.f7';
import ProductPage from '../pages/product.f7';
import SettingsPage from '../pages/settings.f7';

import DynamicRoutePage from '../pages/dynamic-route.f7';
import RequestAndLoad from '../pages/request-and-load.f7';
import NotFoundPage from '../pages/404.f7';

import Productos from '../pages/productos.f7';
import Carrito from '../pages/carrito.f7';
import Pedidos from '../pages/pedidos.f7';
import PedidosDet from '../pages/pedidosdet.f7';
import Mesas from '../pages/mesas.f7';
import Perfil from '../pages/perfil.f7';


var routes = [
  {
    path: '/',    
    component: Productos,
  },
  {
    path: '/carrito',    
    component: Carrito,
  },
  {
    path: '/pedidos',
    component: Pedidos,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/product/:id/',
    component: ProductPage,
  },
  {
    path: '/settings/',
    component: Perfil,
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '/mesas',
    component: Mesas,
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = to.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad,
          },
          {
            props: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '/det/:idpedido/',
    async: function ({ router, to, resolve }) {
      
      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var idpedido = to.params.idpedido;
      var pedido=app.store.state.pedidos.find(c=>c.id==idpedido);

      fetch(urlrequest+'AjaxPedidosDetApp?pedido='+idpedido+'&idautologin='+app.store.state.usuario.id+'&imei='+app.store.state.usuario.imei)
      .then(res=>res.json())
      .then(json=>{            
        console.log(json);
        app.preloader.hide();
        if(json.status==1)
        {
          app.f7.dialog.alert(json.mensaje);
        }else{
          
            pedido.lista=json.data;
           // Resolve route to load page
              resolve(
                {
                  component: PedidosDet,
                },
                {
                  props: {
                    pedido: pedido,
                  }
                }
              );              
        }
      })
      .catch(function(error) { console.log(error);  console.log(app);   app.dialog.alert(error); })
      .finally(function() {
        app.preloader.hide();
      });
    },
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;