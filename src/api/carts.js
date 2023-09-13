const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');


const cartsFilePath = path.join(__dirname, '../data/carts.json');


function readCartsFromFile() {
  try {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; 
  }
}


function writeCartsToFile(carts) {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2), 'utf8');
}


router.post('/', (req, res) => {
  const newCart = {
    id: Date.now().toString(),
    products: [],
  };

  const carts = readCartsFromFile();
  carts.push(newCart);
  writeCartsToFile(carts);

  res.status(201).json(newCart);
});


router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const carts = readCartsFromFile();
  const cart = carts.find(c => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

router.post('/:cid/products/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = 1; 

  const carts = readCartsFromFile();
  const cart = carts.find(c => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  const existingProduct = cart.products.find(p => p.product === productId);

  if (existingProduct) {
    // Si el producto ya existe en el carrito, incrementa la cantidad
    existingProduct.quantity += quantity;
  } else {
    // Si el producto no existe en el carrito, agrégalo como un nuevo objeto
    cart.products.push({ product: productId, quantity });
  }

  writeCartsToFile(carts); // Actualiza el archivo JSON con los cambios

  res.status(201).json(cart.products);
});

module.exports = router;
