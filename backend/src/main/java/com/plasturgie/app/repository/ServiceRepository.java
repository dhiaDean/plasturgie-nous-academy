package com.plasturgie.app.repository;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByCompany(Company company);
    
    List<Service> findByCategory(String category);
    
    List<Service> findByNameContainingIgnoreCase(String name);
}
