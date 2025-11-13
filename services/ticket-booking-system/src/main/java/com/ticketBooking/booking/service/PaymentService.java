package com.ticketBooking.booking.service;

import com.razorpay.Order;
import com.razorpay.Refund;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
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

    /**
     * Refund a payment (full or partial).
     * @param paymentId razorpay payment id
     * @param amountPaise amount in paise to refund; pass null to refund full amount
     * @throws RazorpayException if refund API fails
     */
    public void refundPayment(String paymentId, Integer amountPaise) throws RazorpayException {
    RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    JSONObject refundRequest = new JSONObject();
    if (amountPaise != null) refundRequest.put("amount", amountPaise);
    refundRequest.put("speed", "normal");

    // Call refund on Payments (capital P)
    Refund refund = razorpayClient.payments.refund(paymentId, refundRequest);
    // optional: log refund.get("id")
}

}
