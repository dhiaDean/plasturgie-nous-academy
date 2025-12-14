package com.plasturgie.app.controller;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.Service;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CompanyService;
import com.plasturgie.app.service.ServiceService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;
    
    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Service> createService(
            @Valid @RequestBody Service service,
            @RequestParam Long companyId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Company company = companyService.getCompanyById(companyId);
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Service newService = serviceService.createService(service, companyId);
        return ResponseEntity.ok(newService);
    }

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Service service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }

    @GetMapping("/by-company/{companyId}")
    public ResponseEntity<List<Service>> getServicesByCompany(@PathVariable Long companyId) {
        Company company = companyService.getCompanyById(companyId);
        List<Service> services = serviceService.getServicesByCompany(company);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/by-category/{category}")
    public ResponseEntity<List<Service>> getServicesByCategory(@PathVariable String category) {
        List<Service> services = serviceService.getServicesByCategory(category);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String name) {
        List<Service> services = serviceService.searchServicesByName(name);
        return ResponseEntity.ok(services);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Service> updateService(
            @PathVariable Long id,
            @Valid @RequestBody Service serviceDetails,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Service existingService = serviceService.getServiceById(id);
        Company company = existingService.getCompany();
        
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Service updatedService = serviceService.updateService(id, serviceDetails);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the current user is the company representative or an admin
        Service service = serviceService.getServiceById(id);
        Company company = service.getCompany();
        
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !company.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        serviceService.deleteService(id);
        return ResponseEntity.ok().build();
    }
}
