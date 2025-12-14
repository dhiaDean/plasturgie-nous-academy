package com.plasturgie.app.controller;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.User;
import com.plasturgie.app.security.UserPrincipal;
import com.plasturgie.app.service.CompanyService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;
    
    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Company> createCompany(
            @Valid @RequestBody Company company,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        Company newCompany = companyService.createCompany(company, currentUser.getId());
        return ResponseEntity.ok(newCompany);
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);
        return ResponseEntity.ok(company);
    }

    @GetMapping("/by-city/{city}")
    public ResponseEntity<List<Company>> getCompaniesByCity(@PathVariable String city) {
        List<Company> companies = companyService.getCompaniesByCity(city);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompanies(@RequestParam String name) {
        List<Company> companies = companyService.searchCompaniesByName(name);
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/my-company")
    @PreAuthorize("hasRole('COMPANY_REP')")
    public ResponseEntity<Company> getMyCompany(@AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userService.findById(currentUser.getId());
        Company company = companyService.getCompanyByRepresentative(user);
        return ResponseEntity.ok(company);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY_REP') or hasRole('ADMIN')")
    public ResponseEntity<Company> updateCompany(
            @PathVariable Long id, 
            @Valid @RequestBody Company companyDetails,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        // Check if the user is the company representative or admin
        Company existingCompany = companyService.getCompanyById(id);
        if (currentUser.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !existingCompany.getRepresentative().getUserId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        Company updatedCompany = companyService.updateCompany(id, companyDetails);
        return ResponseEntity.ok(updatedCompany);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok().build();
    }
}
