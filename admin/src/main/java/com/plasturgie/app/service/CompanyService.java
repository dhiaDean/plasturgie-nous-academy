package com.plasturgie.app.service;

import com.plasturgie.app.model.Company;
import com.plasturgie.app.model.User;

import java.util.List;

public interface CompanyService {
    Company createCompany(Company company, Long representativeId);
    
    Company getCompanyById(Long id);
    
    Company getCompanyByRepresentative(User representative);
    
    List<Company> getAllCompanies();
    
    List<Company> getCompaniesByCity(String city);
    
    List<Company> searchCompaniesByName(String name);
    
    Company updateCompany(Long id, Company companyDetails);
    
    void deleteCompany(Long id);
}
