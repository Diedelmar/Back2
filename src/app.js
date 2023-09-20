const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server);

const port = 8080;
const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('miPlantilla', { nombre: 'Usuario' });
});


app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
  
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
