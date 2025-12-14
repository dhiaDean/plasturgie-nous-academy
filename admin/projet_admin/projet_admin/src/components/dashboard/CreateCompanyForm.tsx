import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyAPI } from '../../services/api.service'; // Import CompanyAPI
import { CompanyCreateRequest } from '../../services/api.types'; // Import CompanyCreateRequest
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useToast } from "@/components/ui/use-toast"; // Import useToast

const CreateCompanyForm: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { toast } = useToast(); // Initialize useToast

  const [formData, setFormData] = useState<CompanyCreateRequest>({ // Use CompanyCreateRequest type
    name: '',
    address: '',
    city: '',
    phoneNumber: '', // Use phoneNumber to match CompanyDTO
    email: '',
    website: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CompanyAPI.createCompany(formData);
      toast({
        title: "Success",
        description: "Company created successfully.",
      });
      navigate('/dashboard/companies'); // Navigate back to companies list
    } catch (error) {
      console.error("Failed to create company:", error);
      toast({
        title: "Error",
        description: "Failed to create company.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Company</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Company Name</Label>
          <Input id="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" value={formData.city} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" value={formData.website} onChange={handleInputChange} />
        </div>
        <Button type="submit">Create Company</Button>
      </form>
    </div>
  );
};

export default CreateCompanyForm;
