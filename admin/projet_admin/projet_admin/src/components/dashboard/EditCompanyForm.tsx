import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyAPI } from '../../services/api.service';
import { CompanyDTO, CompanyCreateRequest } from '../../services/api.types';
import { useToast } from "@/components/ui/use-toast";

const EditCompanyForm: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CompanyCreateRequest>({
    name: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) {
        setError("Company ID is missing.");
        setLoading(false);
        return;
      }
      try {
        // Assuming a getCompanyById method exists in CompanyAPI
        const response = await CompanyAPI.getCompanyById(parseInt(companyId, 10)); // Convert ID to number
        const companyData = response.data;
        setFormData({
          name: companyData.name || '',
          address: companyData.address || '',
          city: companyData.city || '',
          phoneNumber: companyData.phoneNumber || '',
          website: companyData.website || '',
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch company data.');
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]); // Refetch if companyId changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) {
       toast({
        title: "Error",
        description: "Company ID is missing for update.",
        variant: "destructive",
      });
      return;
    }
    try {
      await CompanyAPI.updateCompany(parseInt(companyId, 10), formData); // Call updateCompany API
      toast({
        title: "Success",
        description: "Company updated successfully.",
      });
      navigate('/dashboard/companies'); // Navigate back to companies list
    } catch (error) {
      console.error("Failed to update company:", error);
      toast({
        title: "Error",
        description: "Failed to update company.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading company data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Company</h1>
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
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default EditCompanyForm;
