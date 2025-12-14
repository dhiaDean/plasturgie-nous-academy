package com.plasturgie.app.model;

// REMOVE Lombok imports if they exist:
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Arrays; // Import for comparing byte arrays in equals()
import java.util.Objects; // Import for Objects.hash() and Objects.equals()

@Entity
@Table(name = "image_users")
// REMOVE Lombok annotations: @Data, @NoArgsConstructor, @AllArgsConstructor
@EntityListeners(AuditingEntityListener.class) // Keep this for JPA Auditing (@CreationTimestamp/@UpdateTimestamp)
public class ImageUser {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "image_user_seq_gen")
    @SequenceGenerator(name = "image_user_seq_gen", sequenceName = "image_user_seq", allocationSize = 1)
    private Long id;

    @Column(name = "filename")
    private String filename;

    @Column(name = "content_type")
    private String contentType;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image_data", nullable = false)
    private byte[] imageData;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp // Managed by JPA Auditing via @EntityListeners
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp // Managed by JPA Auditing via @EntityListeners
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // --- MANUALLY ADDED CODE (Equivalent of Lombok's work) ---

    // 1. Public No-Argument Constructor (REQUIRED by JPA)
    public ImageUser() {
    }

    // 2. Optional: Custom constructor (Keep if you use it)
    public ImageUser(String filename, String contentType, byte[] imageData, User user) {
        this.filename = filename;
        this.contentType = contentType;
        this.imageData = imageData;
        this.user = user;
        // Timestamps handled by Auditing
    }

    // 3. Getters (Keep your manually added ones)
    public Long getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public String getContentType() {
        return contentType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public User getUser() {
        return user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // 4. Setters (Keep your manually added ones)
    // Note: Usually no setters for id, createdAt, updatedAt if managed by JPA
    public void setId(Long id) {
        this.id = id;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Setters for timestamps might not be needed if using JPA Auditing
    public void setCreatedAt(LocalDateTime createdAt) {
         this.createdAt = createdAt;
     }

     public void setUpdatedAt(LocalDateTime updatedAt) {
         this.updatedAt = updatedAt;
     }

    // 5. equals() method (Essential for JPA Entities, typically based on ID)
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ImageUser imageUser = (ImageUser) o;
        // Use ID for comparison if it's not null (persistent entities)
        // Important: If ID is null (transient entities), they are only equal if they are the same object instance.
        return id != null && Objects.equals(id, imageUser.id);
    }

    // 6. hashCode() method (Essential for JPA Entities, based on the same field(s) as equals)
    @Override
    public int hashCode() {
        // Use ID for hash code if available, otherwise use default object hashcode for transient instances
        return id != null ? Objects.hash(id) : super.hashCode();
        // Alternatively, always hash the id (Objects.hash(null) is safe):
        // return Objects.hash(id);
    }

    // 7. toString() method (Useful for logging/debugging)
    @Override
    public String toString() {
        return "ImageUser{" +
                "id=" + id +
                ", filename='" + filename + '\'' +
                ", contentType='" + contentType + '\'' +
                // Avoid printing large byte array content
                ", imageData=" + (imageData != null ? "byte[" + imageData.length + "]" : "null") +
                // Avoid infinite recursion if User toString calls ImageUser toString
                ", userId=" + (user != null ? user.getUserId() : "null") +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    // Note: @PrePersist / @PreUpdate methods are not needed if using
    // @CreationTimestamp / @UpdateTimestamp with @EntityListeners(AuditingEntityListener.class)
}