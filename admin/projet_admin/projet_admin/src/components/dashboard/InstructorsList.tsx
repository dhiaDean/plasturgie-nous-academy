import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { InstructorAPI } from "@/services/api.service";
// Remove 'Instructor' if it's not used directly in this component.
// If 'Instructor' refers to InstructorResponseDTO, and you only use InstructorListDTO here,
// then you only need InstructorListDTO.
import { InstructorListDTO } from "@/services/api.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Star } from "lucide-react"; // Star and Trash2 are not used in the provided snippet
import { useToast } from "@/components/ui/use-toast"; // useToast is imported but not used

export const InstructorsList = () => {
  const { t } = useTranslation();
  // const { toast } = useToast(); // 'toast' is declared but its value is never read.
  const [instructors, setInstructors] = useState<InstructorListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await InstructorAPI.getAllInstructorsForList();
      setInstructors(response.data || []);
    } catch (err: any) {
      console.error("Error fetching instructors:", err);
      setError(err?.response?.data?.message || err?.message || t('instructorsList.error.failedToLoad')); // More specific error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const filteredInstructors = searchTerm
    ? instructors.filter((instructor) =>
        // Use instructor.name
        instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (instructor.bio && instructor.bio.toLowerCase().includes(searchTerm.toLowerCase()))
        // expertise is not in InstructorListDTO, so remove search by expertise
      )
    : instructors;

  // Show loading skeleton only if it's the initial load and no instructors are yet set
  if (loading && instructors.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={`loading-skeleton-${i}`} className="p-6 animate-pulse"> {/* Changed key for clarity */}
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-300 h-12 w-12"></div> {/* Adjusted color */}
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">{t('dashboard.admin.errorPrefix')}</strong> {/* Re-using error prefix key */}
        <span className="block sm:inline">{error}</span>
        <Button variant="outline" className="mt-2 ml-auto block text-xs" size="sm" onClick={fetchInstructors}> {/* Adjusted styling */}
          {t('instructorsList.error.retry')}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"> {/* Responsive layout */}
        <h1 className="text-2xl font-bold">{t('instructorsList.title')}</h1>
        <div className="relative w-full sm:w-72"> {/* Responsive width */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder={t('instructorsList.placeholder.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500" // Adjusted focus color
          />
        </div>
      </div>

      {filteredInstructors.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md border">
          <Search size={48} className="mx-auto text-gray-300 mb-4" /> {/* Added icon */}
          <h3 className="text-lg font-semibold text-gray-600"> {/* Adjusted color */}
            {searchTerm ? t('instructorsList.emptyState.noMatch') : t('instructorsList.emptyState.notFound')}
          </h3>
          <p className="text-gray-500 text-sm mt-2"> {/* Adjusted color */}
            {searchTerm ? t('instructorsList.emptyState.adjustSearch') : t('instructorsList.emptyState.noRegistered')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Array.isArray(filteredInstructors) && filteredInstructors.map((instructor) => (
            // Use instructor.id for the key and check for existence
            instructor && instructor.id && instructor.name ? (
              <Card key={instructor.id} className="p-4 hover:shadow-lg transition-shadow duration-200 ease-in-out"> {/* Enhanced hover */}
                <div className="flex items-start space-x-4">
                  <div className="rounded-full bg-indigo-100 text-indigo-600 h-12 w-12 flex items-center justify-center font-semibold"> {/* Themed avatar */}
                    {/* Use instructor.name */}
                    {instructor.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0"> {/* Added min-w-0 for better text truncation if needed */}
                    {/* Use instructor.name */}
                    <h3 className="font-semibold text-lg text-gray-800 truncate">{instructor.name}</h3>
                    {/* expertise is not in InstructorListDTO, remove this block */}
                    {/* {instructor.expertise && (
                      <p className="text-xs text-indigo-500 font-medium mt-0.5">{instructor.expertise}</p>
                    )} */}
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {instructor.bio || t('instructorsList.card.noBio')}
                    </p>
                    {instructor.rating !== null && instructor.rating !== undefined && (
                      <div className="flex items-center mt-1.5">
                        <Star size={16} className="text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600 font-medium">{instructor.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"> {/* Responsive actions */}
                    {/* TODO: Implement view profile functionality, e.g., navigate to /instructors/:instructorId */}
                    <Button variant="outline" size="sm" className="flex items-center w-full sm:w-auto">
                      <Edit size={14} className="mr-1.5" /> {t('instructorsList.button.view')}
                    </Button>
                     {/* TODO: Implement edit/delete if admin */}
                    {/* <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </Button> */}
                  </div>
                </div>
              </Card>
            ) : null // Render nothing if instructor object is invalid
          ))}
        </div>
      )}
    </div>
  );
};
