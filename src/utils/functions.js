export const OrdersService = {
  payedOrders: (orders) => orders.filter((order) => order.isPaymentCompleted),

  notPayedOrders: (orders) =>
    orders.filter((order) => !order.isPaymentCompleted),

  fetchOrdersByUserId: async (id) =>
    await fetch(`http://localhost:9000/orders?userId=${id}`, { method: "GET" }),

  updateOrder: async (id, data) =>
    await fetch(`http://localhost:9000/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),

  cancelOrder: async (id) =>
    await fetch(`http://localhost:9000/orders/${id}`, { method: "DELETE" }),

  postOrder: async (data) =>
    await fetch("http://localhost:9000/orders", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }),
};

export const ProductsService = {
  getProductById: (products, productId) =>
    products.find((prod) => prod.id === productId),

  fetchProducts: async () =>
    await fetch(`http://localhost:9000/products`, { method: "GET" }),
};

export const CategoriesService = {
  fetchCategories: async () =>
    await fetch("http://localhost:9000/categories", { method: "GET" }),
  getCategoryByCategoryId: (categories, id) =>
    categories.find((category) => category.id === id),
};

export const BrandService = {
  fetchBrands: async () =>
    await fetch("http://localhost:9000/brands", { method: "GET" }),
  getBrandByBrandId: (brands, id) => brands.find((brand) => brand.id === id),
};
