import axios from "axios";

const handlePayment = async (amount, name, email, contact, eventId, eventName, eventDesc) => {

    try {
        const keyData = await axios.get(`http://localhost:9192/api/booking/getKey`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        const key = keyData.data;

        const orderData = await axios.post(
          "http://localhost:9192/api/booking/order",
          {
            eventId,
            amount
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        const order = orderData.data;

        const options = {
            key,
            amount: amount * 100, 
            currency: 'INR',
            name,
            description: `${eventName}`,
            order_id: order.id, 
            callback_url: `http://localhost:9192/api/booking/verify`, 
            prefill: {
              name,
              email,
              contact
            },
        };

        const rzp = new Razorpay(options);
        rzp.open();
    
    } catch(e){
        console.log(e)
    }
}

export default handlePayment;