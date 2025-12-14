package com.plasturgie.app.service;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Service;

import java.util.List;

/**
 * Service interface for managing company services
 */
public interface ServiceService {
    /**
     * Create a new service for a company
     * 
     * @param service The service to create
     * @param companyId The ID of the company the service belongs to
     * @return The created service
     */
    Service createService(Service service, Long companyId);
    
    /**
     * Get a service by its ID
     * 
     * @param id The service ID
     * @return The service with the given ID
     */
    Service getServiceById(Long id);
    
    /**
     * Get all services
     * 
     * @return List of all services
     */
    List<Service> getAllServices();
    
    /**
     * Get services by company
     * 
     * @param company The company
     * @return List of services for the given company
     */
    List<Service> getServicesByCompany(Company company);
    
    /**
     * Get services by category
     * 
     * @param category The service category
     * @return List of services in the given category
     */
    List<Service> getServicesByCategory(String category);
    
    /**
     * Search services by name
     * 
     * @param name The service name to search for
     * @return List of services matching the search criteria
     */
    List<Service> searchServicesByName(String name);
    
    /**
     * Update a service
     * 
     * @param id The ID of the service to update
     * @param serviceDetails The updated service details
     * @return The updated service
     */
    Service updateService(Long id, Service serviceDetails);
    
    /**
     * Delete a service
     * 
     * @param id The ID of the service to delete
     */
    void deleteService(Long id);
}
