package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Service;
import com.plasturgie.app.repository.ServiceRepository;
import com.plasturgie.app.service.CompanyService;
import com.plasturgie.app.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private CompanyService companyService;

    @Override
    @Transactional
    public Service createService(Service service, Long companyId) {
        Company company = companyService.getCompanyById(companyId);
        service.setCompany(company);
        
        return serviceRepository.save(service);
    }

    @Override
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
    }

    @Override
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @Override
    public List<Service> getServicesByCompany(Company company) {
        return serviceRepository.findByCompany(company);
    }

    @Override
    public List<Service> getServicesByCategory(String category) {
        return serviceRepository.findByCategory(category);
    }

    @Override
    public List<Service> searchServicesByName(String name) {
        return serviceRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    @Transactional
    public Service updateService(Long id, Service serviceDetails) {
        Service service = getServiceById(id);
        
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setCategory(serviceDetails.getCategory());
        service.setPriceRange(serviceDetails.getPriceRange());
        
        return serviceRepository.save(service);
    }

    @Override
    @Transactional
    public void deleteService(Long id) {
        Service service = getServiceById(id);
        serviceRepository.delete(service);
    }
}
