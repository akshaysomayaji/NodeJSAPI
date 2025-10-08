module.exports = (db) => {
  const Product = db.Product;

  return {
    // Create product
    createProduct: async (req, res) => {
      try {
        const { productName, sku, price, quantity, description, imageUrl } = req.body;

        if (!productName || !sku) {
          return res.status(400).json({ message: "Product name and SKU are required." });
        }

        const existing = await Product.findOne({ where: { sku } });
        if (existing) {
          return res.status(409).json({ message: "A product with this SKU already exists." });
        }

        const product = await Product.create({
          productName,
          sku,
          price,
          quantity,
          description,
          imageUrl,
          productStatus: "Active",
        });

        return res.status(201).json({ message: "Product created successfully.", product });
      } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({ message: "Server error creating product." });
      }
    },

    // Get all products
    getAllProducts: async (req, res) => {
      try {
        const products = await Product.findAll({ where: { productStatus: "Active" } });
        res.json(products);
      } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error fetching products." });
      }
    },

    // Get single product by ID
    getProductById: async (req, res) => {
      try {
        const product = await Product.findByPk(req.params.id);
        if (!product || product.productStatus === "Deleted") {
          return res.status(404).json({ message: "Product not found." });
        }
        res.json(product);
      } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Server error fetching product." });
      }
    },

    // Delete permanently (actual delete)
    deleteProduct: async (req, res) => {
      try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
          return res.status(404).json({ message: "Product not found." });
        }

        await product.destroy();
        return res.json({ message: "Product deleted permanently." });
      } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Server error deleting product." });
      }
    },

    // Soft delete (mark as Deleted)
    softDeleteProduct: async (req, res) => {
      try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
          return res.status(404).json({ message: "Product not found." });
        }

        product.productStatus = "Deleted";
        await product.save();

        return res.json({ message: "Product marked as deleted." });
      } catch (err) {
        console.error("Error marking product deleted:", err);
        res.status(500).json({ message: "Server error." });
      }
    },
  };
};