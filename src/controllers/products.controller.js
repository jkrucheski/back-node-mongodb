import Product from "../models/Product";

export const createProduct = async (req, res) => {
  const { name, category, price, imgURL } = req.body;
  const newProduct = new Product({ name, category, price, imgURL });
  const productSaved = await newProduct.save();
  res.status(201).json(productSaved);
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

export const getProductById = async (req, res) => {
  const { productId } = req.params;

  const products = await Product.findById(productId);
  res.status(200).json(products);
};

export const updateProductById = async (req, res) => {
  const { productId } = req.params;

  const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
  });
  res.status(204).json(updatedProduct);
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.params;
  await Product.findByIdAndDelete(productId);
  res.status(204).json();
};
