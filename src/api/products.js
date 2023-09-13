const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const productsFilePath = path.join(__dirname, '../data/products.json');


function readProductsFromFile() {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; 
  }
}



function writeProductsToFile(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
}


router.get('/', (req, res) => {
  const products = readProductsFromFile();
  res.json(products);
});


router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = readProductsFromFile();
  const product = products.find(p => p.id === productId);

  if (!product) {
    res.status(404).json({ error: 'Producto no encontrado' });
  } else {
    res.json(product);
  }
});

router.post('/', (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (!title || !code || !price || !stock || !category || !thumbnails) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newProduct = {
    id: uuidv4(), // Genera un ID único
    title,
    description,
    code,
    price,
    status: true, // Valor por defecto
    stock,
    category,
    thumbnails,
  };

  const products = readProductsFromFile();
  products.push(newProduct);
  writeProductsToFile(products);

  res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  } = req.body;

  const products = readProductsFromFile();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  
  products[productIndex] = {
    ...products[productIndex],
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  };

  writeProductsToFile(products);

  res.json(products[productIndex]);
});

// Ruta DELETE para eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;
  const products = readProductsFromFile();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  products.splice(productIndex, 1);
  writeProductsToFile(products);

  res.status(204).send();
});

module.exports = router;
