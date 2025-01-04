import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaBoxOpen, FaClipboardList, FaShoppingCart, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lastProduct, setLastProduct] = useState({});
  const [lowStock, setLowStock] = useState([]);
  
  useEffect(() => {
    // Fetch dashboard stats
    axios.get('/api/stats').then((res) => setStats(res.data));
    
    // Fetch recent orders
    axios.get('/api/orders').then((res) => setRecentOrders(res.data));
    
    // Fetch last added product
    axios.get('/api/products/last').then((res) => setLastProduct(res.data));
    
    // Fetch low stock items
    axios.get('/api/stock/low').then((res) => setLowStock(res.data));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <h1 className="text-2xl font-bold p-4 border-b border-gray-700">🛒 Admin Panel</h1>
        <ul className="p-4 space-y-3 flex-1">
          <li className="p-2 rounded-md hover:bg-gray-700 cursor-pointer flex items-center">
            <FaClipboardList className="mr-3" /> Dashboard
          </li>
          <li className="p-2 rounded-md hover:bg-gray-700 cursor-pointer flex items-center">
            <FaShoppingCart className="mr-3" /> Orders
          </li>
          <li className="p-2 rounded-md hover:bg-gray-700 cursor-pointer flex items-center">
            <FaBoxOpen className="mr-3" /> Products
          </li>
          <li className="p-2 rounded-md hover:bg-gray-700 cursor-pointer flex items-center">
            ⚙️ Settings
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto bg-gray-50">
        {/* Top Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Order Management */}
          <div className="bg-white shadow-md rounded-md p-4 flex items-center">
            <FaShoppingCart className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Pending Orders</p>
              <h3 className="text-xl font-bold">{stats.pendingOrders || 0}</h3>
            </div>
          </div>
          {/* Last Product Added */}
          <div className="bg-white shadow-md rounded-md p-4 flex items-center">
            <FaBoxOpen className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Last Product Added</p>
              <h3 className="text-lg font-bold">{lastProduct.name || 'Loading...'}</h3>
            </div>
          </div>
          {/* Low Stock Alert */}
          <div className="bg-white shadow-md rounded-md p-4 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Low Stock Items</p>
              <h3 className="text-xl font-bold">{lowStock.length || 0}</h3>
            </div>
          </div>
          {/* Completed Orders */}
          <div className="bg-white shadow-md rounded-md p-4 flex items-center">
            <FaCheckCircle className="text-green-600 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Completed Orders</p>
              <h3 className="text-xl font-bold">{stats.completedOrders || 0}</h3>
            </div>
          </div>
        </section>

        {/* Sales Chart */}
        <section className="bg-white shadow-md rounded-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales Overview</h3>
          <Bar
            data={{
              labels: stats.salesLabels || [],
              datasets: [
                {
                  label: 'Sales ($)',
                  data: stats.salesData || [],
                  backgroundColor: '#4F46E5',
                },
              ],
            }}
          />
        </section>

        {/* Recent Orders */}
        <section className="bg-white shadow-md rounded-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-gray-600 py-2 border-b">Order ID</th>
                <th className="text-left text-gray-600 py-2 border-b">Customer</th>
                <th className="text-left text-gray-600 py-2 border-b">Status</th>
                <th className="text-left text-gray-600 py-2 border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 border-b">{order.id}</td>
                  <td className="py-2 border-b">{order.customer}</td>
                  <td className="py-2 border-b">{order.status}</td>
                  <td className="py-2 border-b">${order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
