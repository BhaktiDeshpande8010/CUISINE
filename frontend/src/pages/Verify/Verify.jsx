import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const razorpay_payment_id = searchParams.get("razorpay_payment_id");
  const razorpay_order_id = searchParams.get("razorpay_order_id");
  const razorpay_signature = searchParams.get("razorpay_signature");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    
    try {
      // Only verify if the required parameters exist
      if (success === "true" && razorpay_payment_id && razorpay_order_id && razorpay_signature) {
        const response = await axios.post(url + "/api/order/verify", {
          success,
          orderId,
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });

        if (response.data.success) {
          navigate("/myorders");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // Run once when the component mounts

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
