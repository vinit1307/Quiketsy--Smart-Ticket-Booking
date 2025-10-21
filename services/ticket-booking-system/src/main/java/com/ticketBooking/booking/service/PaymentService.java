package com.ticketBooking.booking.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${RZP_KEY_ID}")
    private String razorpayKeyId;
    
    @Value("${RZP_KEY_SECRET}")
    private String razorpayKeySecret;
    

    public Order createOrder(int amount) throws Exception {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); // amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("payment_capture", 1);

        return razorpayClient.orders.create(orderRequest);
    }
}
