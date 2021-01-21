const Product = require('../models/product');
const Cart = require('../models/cart');
const fixedNum = require('../util/fixedNum');

exports.getProducts = (_, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
    });
  });
};
exports.getProduct = (req, res, _) => {
  const productId = req.params.productId;
  Product.findByID(productId, (product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products',
    });
  });
};
exports.getIndex = (_, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (_, res) => {
  Cart.getCart((cart) => {
    const cartProducts = [];
    if (!cart) {
      return res.render('shop/cart', {
        cartProducts,
        path: '/cart',
        pageTitle: 'Your Cart',
      });
    }
    Product.fetchAll((products) => {
      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        cartProducts,
        path: '/cart',
        pageTitle: 'Your Cart',
      });
    });
  });
};

exports.postCart = (req, res) => {
  const ID = req.body.productId;
  Product.findByID(ID, (product) => {
    Cart.adProduct(ID, fixedNum(product.price));
  });
  res.redirect('/products');
};

exports.postCardDeleteProduct = (req, res) => {
  const ID = req.body.id;
  const price = req.body.price;
  Cart.deleteProduct(ID, price);
  res.redirect('/cart');
};

exports.getOrders = (_, res) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (_, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
