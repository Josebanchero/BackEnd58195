const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.autoIncrementId = 1;
    this.products = [];
  }

  async addProduct(product) {
    // Validar campos obligatorios
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    // Validar que no se repita el campo "code"
    if (this.products.some(p => p.code === product.code)) {
      console.error("El código ya está en uso. Por favor, elija otro.");
      return;
    }

    // Cargar productos existentes desde el archivo y actualizar this.products
    await this.loadProductsFromFile();

    // Asignar id autoincrementable y agregar el nuevo producto
    product.id = this.autoIncrementId++;
    product.status = true; // Status es true por defecto
    product.thumbnails = product.thumbnails || []; // Thumbnails es un array de strings

    this.products.push(product);

    // Guardar en el archivo
    await this.saveProductsToFile();

    console.log("Producto agregado correctamente:", product);
  }

  async getProducts(limit) {
    await this.loadProductsFromFile();

    if (limit) {
      return this.products.slice(0, limit);
    } else {
      return this.products;
    }
  }

  async getProductById(id) {
    await this.loadProductsFromFile();
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  async updateProduct(id, updatedProduct) {
    // Encontrar el índice del producto a actualizar
    const index = this.products.findIndex(p => p.id === id);

    if (index !== -1) {
      // Actualizar el producto sin cambiar su ID
      updatedProduct.id = id;
      this.products[index] = updatedProduct;

      // Guardar en el archivo
      await this.saveProductsToFile();

      console.log("Producto actualizado correctamente:", updatedProduct);
    } else {
      console.error("Producto no encontrado. ID:", id);
    }
  }

  async deleteProduct(id) {
    // Filtrar los productos para excluir el que se va a eliminar
    this.products = this.products.filter(p => p.id !== id);

    // Guardar en el archivo
    await this.saveProductsToFile();

    console.log("Producto eliminado correctamente. ID:", id);
  }

  async loadProductsFromFile() {
    try {
      // Intentar leer el archivo y parsear el contenido como JSON
      const fileContent = await fs.readFile(this.path, 'utf8');
      this.products = JSON.parse(fileContent) || [];
    } catch (error) {
      // Si hay un error (por ejemplo, si el archivo no existe), devolver un array vacío
      this.products = [];
    }
  }

  async saveProductsToFile() {
    // Convertir los productos a formato JSON y guardar en el archivo
    const jsonProducts = JSON.stringify(this.products, null, 2);
    await fs.writeFile(this.path, jsonProducts, 'utf8');
  }
}

module.exports = ProductManager;
