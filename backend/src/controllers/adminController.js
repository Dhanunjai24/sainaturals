const storeModel = require('../models/storeModel');
const { query, repo } = require('../db');

async function getDashboard(req, res) {
  try {
    const stats = await storeModel.getAdminDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getOrders(req, res) {
  try {
    const { status, search } = req.query;
    const orders = await storeModel.getAllOrders({ status, search });
    res.json({ count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Order status is required.' });
    }

    if (status === 'cancelled') {
      const result = await storeModel.cancelOrderWithStockRestoration(req.params.id, 'Cancelled by Store Admin');
      return res.json(result);
    }

    const order = await storeModel.updateOrderStatus(req.params.id, status);
    res.json({ message: 'Order status updated successfully.', order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getCustomers(req, res) {
  try {
    const customers = await storeModel.getAllCustomers();
    res.json({ count: customers.length, customers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getInventory(req, res) {
  try {
    const { lowStock } = req.query;
    const products = await storeModel.getProducts({});
    let items = products;
    if (lowStock === 'true') {
      items = items.filter(p => p.stock_quantity <= 10);
    }
    res.json({
      count: items.length,
      lowStockCount: products.filter(p => p.stock_quantity <= 10).length,
      inventory: items
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getSalesReport(req, res) {
  try {
    const orders = await storeModel.getAllOrders({ status: 'all' });
    const completed = orders.filter(o => o.order_status !== 'cancelled');

    const totalRevenue = completed.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const codTotal = completed.filter(o => o.payment_method === 'cod').reduce((sum, o) => sum + Number(o.total_amount), 0);
    const upiTotal = completed.filter(o => o.payment_method === 'upi').reduce((sum, o) => sum + Number(o.total_amount), 0);

    // Group by day for last 7 days
    const daily = {};
    completed.forEach(o => {
      const day = o.created_at.slice(0, 10);
      daily[day] = (daily[day] || 0) + Number(o.total_amount);
    });

    res.json({
      totalRevenue,
      totalOrders: completed.length,
      averageOrderValue: completed.length ? Math.round(totalRevenue / completed.length) : 0,
      paymentSplit: { cod: codTotal, upi: upiTotal },
      dailySales: Object.keys(daily).map(date => ({ date, amount: daily[date] }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getDashboard,
  getOrders,
  updateOrderStatus,
  getCustomers,
  getInventory,
  getSalesReport
};
