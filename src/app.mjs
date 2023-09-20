const express = require('express');
const app = express();
const http = require ('http')
const port = 8080;
const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');
const exphbs = require('express-handlebars');
import { Server } from 'soket.io';


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
  res.render('miPlantilla', { nombre: 'Usuario' });
});

app.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000');
});






app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  socket.on('productoAgregado', () => {
    
    const products = []; 
    io.emit('productosActualizados', products);
  });

  socket.on('productoEliminado', () => {
   
    const products = []; 
    io.emit('productosActualizados', products);
  });
});
