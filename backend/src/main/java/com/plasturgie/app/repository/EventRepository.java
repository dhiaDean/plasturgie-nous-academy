package com.plasturgie.app.repository;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import Query
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Custom query to fetch all events with their companies and company representatives
    // This helps avoid the N+1 problem if these are frequently needed together.
    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.company c LEFT JOIN FETCH c.representative")
    List<Event> findAllWithDetails(); 

    // If you only need the company, not necessarily the representative deeply fetched here:
    // @Query("SELECT e FROM Event e LEFT JOIN FETCH e.company")
    // List<Event> findAllWithCompany();

    List<Event> findByCompany(Company company);
    
    List<Event> findByEventDateAfter(LocalDateTime date);
    
    List<Event> findByRegistrationDeadlineAfter(LocalDateTime date);
    
    List<Event> findByTitleContainingIgnoreCase(String title);
    
    List<Event> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}