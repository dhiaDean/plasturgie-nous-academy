import React, { useEffect, useState } from 'react';
import { CompanyAPI } from '../../services/api.service'; // Use real API
import { CompanyDTO } from '../../services/api.types'; // Use real type
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom'; // Use real hook
import { Search, Building2, Phone, Globe, MapPin, Plus, Edit3, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

import { useTranslation } from 'react-i18next'; // Import useTranslation

import { useToast } from "@/components/ui/use-toast"; // Import useToast

const CompanyPage: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { toast } = useToast(); // Initialize useToast hook
  const [companies, setCompanies] = useState<CompanyDTO[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retrying, setRetrying] = useState(false);

  const fetchCompanies = async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
        setError(null);
      } else {
        setLoading(true); // Ensure loading is true for initial fetch
      }

      const response = await CompanyAPI.getAllCompanies();
      setCompanies(response.data);
      setFilteredCompanies(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch companies';
      setError(errorMessage);
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const filtered = companies.filter(company =>
      (company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.city && company.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.address && company.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  const handleEdit = (companyId: number) => {
    navigate(`/dashboard/companies/edit/${companyId}`);
  };

  const handleDelete = async (companyId: number, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete "${companyName}"?`)) {
      try {
        await CompanyAPI.deleteCompany(companyId);
        const updatedCompanies = companies.filter(c => c.id !== companyId);
        setCompanies(updatedCompanies);
        // setFilteredCompanies will update via useEffect on 'companies'
        toast({
          title: "Success",
          description: `Company "${companyName}" deleted successfully.`,
        });
      } catch (err) {
        console.error('Error deleting company:', err);
        toast({
          title: "Error",
          description: `Failed to delete company "${companyName}".`,
          variant: "destructive",
        });
      }
    }
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">{t('companyPage.loading')}</span>
    </div>
  );

  const ErrorState = () => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">{t('companyPage.errorState.heading')}</h3>
      <p className="text-red-600 mb-4">{t('companyPage.errorState.text', { error })}</p>
      <Button
        onClick={() => fetchCompanies(true)}
        disabled={retrying}
        className="bg-red-600 hover:bg-red-700 text-white" // Added text-white for better contrast on red button
      >
        {retrying ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            {t('companyPage.button.retrying')}
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('companyPage.button.tryAgain')}
          </>
        )}
      </Button>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(searchTerm ? 'companyPage.emptyState.noMatch.heading' : 'companyPage.emptyState.noCompanies.heading')}</h3>
      <p className="text-gray-600 mb-6">
        {searchTerm ? t('companyPage.emptyState.noMatch.text', { searchTerm }) : t('companyPage.emptyState.noCompanies.text')}
      </p>
      {!searchTerm && (
        <Button onClick={() => navigate('/dashboard/companies/new')} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          {t('companyPage.button.addFirst')}
        </Button>
      )}
    </div>
  );

  if (loading && companies.length === 0) { // Show loader only if no companies are loaded yet
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && companies.length === 0) { // Show full page error only if no companies could be loaded
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('companyPage.title')}</h1>
          <p className="text-gray-600">{t('companyPage.subtitle')}</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard/companies/new')}
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white" // Added text-white for consistency
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('companyPage.button.addNew')}
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-grow sm:flex-grow-0 sm:max-w-md"> {/* Ensure search doesn't grow excessively */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={t('companyPage.placeholder.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('companyPage.placeholder.search')}
            />
          </div>
          <div className="text-sm text-gray-600 text-right sm:text-left"> {/* Adjusted text alignment for consistency */}
            {t('companyPage.text.companyCount', { filteredCount: filteredCompanies.length, totalCount: companies.length })}
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      { (companies.length === 0 && !loading) ? ( // If originally no companies, show empty state (even if error occurred before on first load)
          <EmptyState />
      ) : filteredCompanies.length === 0 && searchTerm ? ( // If search yields no results
          <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id} // Added unique key
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 flex flex-col" // Added flex flex-col
            >
              <div className="p-6 flex-grow"> {/* Added flex-grow to push footer down */}
                {/* Company Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center min-w-0"> {/* Added min-w-0 for better truncation */}
                    <div className="bg-blue-100 p-3 rounded-lg mr-3 flex-shrink-0"> {/* Slightly larger padding, added margin */}
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="min-w-0"> {/* Added min-w-0 here too */}
                      <h3
                        className="text-lg font-semibold text-gray-900 truncate"
                        dir="auto" // Added dir="auto" for robust LTR/RTL handling
                        title={company.name} // Add title for full name on hover if truncated
                      >
                        {company.name}
                      </h3>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-1 flex-shrink-0 ml-2"> {/* Added ml-2 for spacing */}
                    <button
                      onClick={() => handleEdit(company.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title={`Edit ${company.name}`}
                      aria-label={`Edit company ${company.name}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id, company.name)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title={`Delete ${company.name}`}
                      aria-label={`Delete company ${company.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Company Details */}
                <div className="space-y-3">
                  {(company.address || company.city) && (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" /> {/* Adjusted color and mt */}
                      <div className="ml-2 text-sm text-gray-700"> {/* Adjusted color */}
                        {company.address && <div dir="auto">{company.address}</div>}
                        {company.city && <div dir="auto">{company.city}</div>}
                      </div>
                    </div>
                  )}

                  {company.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="ml-2 text-sm text-gray-700" dir="auto">
                        {company.phoneNumber}
                      </span>
                    </div>
                  )}

                  {company.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <a
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`} // Ensure protocol
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-blue-600 hover:text-blue-800 truncate"
                        dir="auto"
                        title={company.website}
                      >
                        {company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg mt-auto"> {/* Added mt-auto and adjusted padding */}
                <button
                  onClick={() => navigate(`/dashboard/companies/view/${company.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  aria-label={`View details for ${company.name}`}
                >
                  View Details <span aria-hidden="true" className="ml-1">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyPage;
