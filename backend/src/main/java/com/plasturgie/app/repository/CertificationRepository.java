package com.plasturgie.app.repository;

import com.plasturgie.app.model.Certification;
import com.plasturgie.app.model.Course;
import com.plasturgie.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    List<Certification> findByUser(User user);
    
    List<Certification> findByCourse(Course course);
    
    Optional<Certification> findByCertificateCode(String certificateCode);
    
    List<Certification> findByStatus(String status);
    
    Optional<Certification> findByUserAndCourse(User user, Course course);
}
