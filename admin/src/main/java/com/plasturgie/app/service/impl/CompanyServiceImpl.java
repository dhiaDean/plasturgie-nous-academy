package com.plasturgie.app.service.impl;

import com.plasturgie.app.exception.ResourceNotFoundException;
import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.User;
import com.plasturgie.app.repository.CompanyRepository;
import com.plasturgie.app.service.CompanyService;
import com.plasturgie.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public Company createCompany(Company company, Long representativeId) {
        User representative = userService.findById(representativeId);
        company.setRepresentative(representative);
        
        return companyRepository.save(company);
    }

    @Override
    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
    }

    @Override
    public Company getCompanyByRepresentative(User representative) {
        return companyRepository.findByRepresentative(representative)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "representative", representative.getUserId()));
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    public List<Company> getCompaniesByCity(String city) {
        return companyRepository.findByCity(city);
    }

    @Override
    public List<Company> searchCompaniesByName(String name) {
        return companyRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    @Transactional
    public Company updateCompany(Long id, Company companyDetails) {
        Company company = getCompanyById(id);
        
        if (companyDetails.getName() != null) {
            company.setName(companyDetails.getName());
        }
        if (companyDetails.getDescription() != null) {
            company.setDescription(companyDetails.getDescription());
        }
        if (companyDetails.getAddress() != null) {
            company.setAddress(companyDetails.getAddress());
        }
        if (companyDetails.getCity() != null) {
            company.setCity(companyDetails.getCity());
        }
        if (companyDetails.getPhone() != null) {
            company.setPhone(companyDetails.getPhone());
        }
        if (companyDetails.getEmail() != null) {
            company.setEmail(companyDetails.getEmail());
        }
        if (companyDetails.getWebsite() != null) {
            company.setWebsite(companyDetails.getWebsite());
        }
        
        return companyRepository.save(company);
    }

    @Override
    @Transactional
    public void deleteCompany(Long id) {
        Company company = getCompanyById(id);
        companyRepository.delete(company);
    }
}
