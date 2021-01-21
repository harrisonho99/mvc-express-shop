const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');
const fixedNum = require('../util/fixedNum');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = fixedNum(price);
    this.id = id;
  }

  save() {
    getProductsFromFile((products) => {
      // if has no id mean edting product
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log('Product---', err);
        });
      } else {
        // add new Product
        this.id = nanoid.customAlphabet(
          '1234567890abcdefghijklmnopqrstuvwxyz',
          40
        )();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log('Product---', err);
        });
      }
    });
  }
  static delete(id) {
    getProductsFromFile((products) => {
      //filter product
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        console.log('Product---delete---', err);
        if (!err) {
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static findByID(id, cb) {
    getProductsFromFile((allProducts) => {
      const productFound = allProducts.find((product) => product.id === id);
      cb(productFound);
    });
  }
};
