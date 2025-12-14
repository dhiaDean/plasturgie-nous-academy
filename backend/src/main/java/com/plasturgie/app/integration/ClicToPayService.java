package com.plasturgie.app.integration;

import com.plasturgie.app.model.Payment;
import com.plasturgie.app.model.enums.Status;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ClicToPayService {
    
    private static final Logger logger = LoggerFactory.getLogger(ClicToPayService.class);
    
    @Value("${clictopay.api.url}")
    private String apiUrl;
    
    @Value("${clictopay.api.key}")
    private String apiKey;
    
    @Value("${clictopay.merchant.id}")
    private String merchantId;
    
    private final RestTemplate restTemplate;
    
    public ClicToPayService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Initiates a payment transaction with ClicToPay
     * 
     * @param amount The payment amount
     * @param currency The currency code (TND)
     * @param description Payment description
     * @return Payment token from ClicToPay
     */
    public String initiatePayment(BigDecimal amount, String currency, String description) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("amount", amount);
            requestBody.put("currency", currency);
            requestBody.put("merchantId", merchantId);
            requestBody.put("description", description);
            requestBody.put("transactionReference", generateTransactionReference());
            requestBody.put("returnUrl", "https://plasturgie-tunisie.com/payment/callback");
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl + "/payments/initiate", 
                    request, 
                    Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (String) response.getBody().get("token");
            } else {
                logger.error("Failed to initiate payment: {}", response);
                throw new RuntimeException("Failed to initiate payment");
            }
        } catch (Exception e) {
            logger.error("Error initiating payment with ClicToPay", e);
            throw new RuntimeException("Payment initiation failed", e);
        }
    }
    
    /**
     * Verifies the payment status with ClicToPay
     * 
     * @param paymentToken The token received from initiation
     * @return Payment status (COMPLETED, FAILED, etc.)
     */
    public Status verifyPayment(String paymentToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            
            HttpEntity<String> request = new HttpEntity<>(headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                    apiUrl + "/payments/verify/" + paymentToken,
                    org.springframework.http.HttpMethod.GET,
                    request,
                    Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String status = (String) response.getBody().get("status");
                
                switch (status.toLowerCase()) {
                    case "completed":
                        return Status.COMPLETED;
                    case "failed":
                        return Status.FAILED;
                    case "pending":
                        return Status.PENDING;
                    default:
                        return Status.FAILED;
                }
            } else {
                logger.error("Failed to verify payment: {}", response);
                return Status.FAILED;
            }
        } catch (Exception e) {
            logger.error("Error verifying payment with ClicToPay", e);
            return Status.FAILED;
        }
    }
    
    /**
     * Processes a payment refund
     * 
     * @param payment The payment to refund
     * @return true if refund was successful
     */
    public boolean refundPayment(Payment payment) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("transactionReference", payment.getTransactionReference());
            requestBody.put("amount", payment.getAmount());
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl + "/payments/refund", 
                    request, 
                    Map.class);
            
            return response.getStatusCode().is2xxSuccessful();
            
        } catch (Exception e) {
            logger.error("Error refunding payment with ClicToPay", e);
            return false;
        }
    }
    
    /**
     * Generates a unique transaction reference
     * 
     * @return A unique transaction reference string
     */
    private String generateTransactionReference() {
        return "PLT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
