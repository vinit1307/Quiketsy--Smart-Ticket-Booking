import axios from "axios";

const handlePayment = async (amount, name, email, contact, eventId, eventName) => {
  try {
    // Step 1: Get Razorpay Key
    const keyRes = await axios.get("http://localhost:9192/api/booking/getKey", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const key = keyRes.data;

    // Step 2: Create Order
    const orderRes = await axios.post(
      "http://localhost:9192/api/booking/order",
      { eventId, amount },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const order = orderRes.data;

    console.log("Order Created ✅", order);

    // Step 3: Open Razorpay Checkout
    const options = {
      key: key,
      amount: order.amount, // amount in paise from backend
      currency: "INR",
      name: name,
      description: eventName,
      order_id: order.id || order.orderId, // depends on backend field name
      prefill: {
        name,
        email,
        contact,
      },
      handler: async function (response) {
        // Step 4: Verify Payment manually after successful checkout
        try {
          const verifyRes = await axios.post(
            "http://localhost:9192/api/booking/verify",
            null,
            {
              params: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              },
            }
          );

          setTimeout(() => {
            window.location.href = `/payment-success?bookingId=${verifyRes.data.bookingId}`;
          }, 2500);
          alert("✅ Payment Verified and Booking Confirmed!");
          console.log("Verification Response", verifyRes.data);
        } catch (err) {
          console.error("Verification Failed ❌", err);
          alert("Payment completed but verification failed!");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();

    razor.on("payment.failed", function (response) {
      alert("Payment Failed ❌");
      console.log(response.error);
    });
  } catch (error) {
    console.error("Payment Error:", error);
  }
};

export default handlePayment;
