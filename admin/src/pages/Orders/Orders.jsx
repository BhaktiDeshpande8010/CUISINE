import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]); // Ensure orders starts as an array

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data || []); // Ensure orders is always an array
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("API Request Failed");
      console.error("Error fetching orders:", error);
    }
  }

  const statusHandler = async (event,orderId) => {
    const response = await axios.post(url+"/api/order/status",{
      orderId,
      status:event.target.value
    })
    if (response.data.success) {
      await fetchAllOrders();
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className='order-item-food'>
                  {order.items.map((item, idx) => {
                    return idx === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `;
                  })}
                </p>
                <p className="order-item-name"> {order.address.firstName + " " + order.address.lastName}</p>
                <div className="order-item-address">
                  <p>{order.address.street+","}</p>
                  <p>{order.address.city+","+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>               
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>${order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} >
                <option value="Food Processing">Food Processing</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Deliverd">Deliverd</option>
              </select>
            </div>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
