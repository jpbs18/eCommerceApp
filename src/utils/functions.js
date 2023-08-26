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
};

export const ProductsService = {
  getProductById: (products, productId) =>
    products.find((prod) => prod.id === productId),
  fetchProducts: async () =>
    await fetch(`http://localhost:9000/products`, { method: "GET" }),
};
