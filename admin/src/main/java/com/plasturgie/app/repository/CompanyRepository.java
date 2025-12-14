package com.plasturgie.app.repository;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByCity(String city);
    
    Optional<Company> findByRepresentative(User representative);
    
    List<Company> findByNameContainingIgnoreCase(String name);
}
