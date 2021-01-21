const fs = require('fs');
const path = require('path');
const fixedNum = require('../util/fixedNum');
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static adProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };
      // check cart.json existing
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // checking current product is exsiting in Cart.json
      if (existingProduct) {
        updatedProduct = { ...existingProduct };

        updatedProduct.qty++;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = fixedNum(cart.totalPrice + productPrice);
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log('Cart---', err);
      });
    });
  }
  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.log(err);
        return;
      }
      const cart = JSON.parse(fileContent);
      const product = cart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const productQuantity = product.qty;
      const updatedProducts = cart.products.filter((prod) => prod.id !== id);
      cart.products = updatedProducts;
      cart.totalPrice = fixedNum(
        cart.totalPrice - productQuantity * productPrice
      );
      fs.writeFile(p, JSON.stringify(cart), (error) => {
        console.log('Cart---delete--', error);
      });
    });
  }
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        // console.log('get cart---', err);
        return cb(null);
      }
      const cart = JSON.parse(fileContent);
      cb(cart);
    });
  }
};
