const Product = require('../models/product');
const Cart = require('../models/cart');
exports.getAddProduct = (_, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, _) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, _) => {
  const editMode = req.query.edit;

  if (editMode !== 'true') {
    return res.redirect('/');
  }
  const ID = req.params.productId;
  Product.findByID(ID, (product) => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing: editMode,
      product,
    });
  });
};
exports.postEditProduct = (req, res, _) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.id;
  const editedProduct = new Product(title, imageUrl, description, price, id);
  editedProduct.save();
  res.redirect(`/admin/products`);
};
exports.getProducts = (_, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
    });
  });
};
exports.deleteProduct = (req, res, _) => {
  const ID = req.body.id;
  const price = +req.body.price;
  Product.delete(ID);
  Cart.deleteProduct(ID, price);
  res.redirect(`/admin/products`);
};
