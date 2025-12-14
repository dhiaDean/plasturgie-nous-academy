package com.plasturgie.app.model.enums;

/**
 * Enum defining status values for various entities like enrollment, payment, etc.
 */
public enum Status {
    // Enrollment statuses
    PENDING,
    ACTIVE,
    COMPLETED,
    DROPPED,
    
    // Payment statuses
    FAILED,
    REFUNDED,
    
    // Certification statuses
    EXPIRED,
    REVOKED
}
