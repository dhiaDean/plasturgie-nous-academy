import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";

export const ProfileSettings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formValues, setFormValues] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    avatarUrl: user?.avatarUrl || "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast({
      title: t('profileSettings.toast.notImplementedTitle'),
      description: t('profileSettings.toast.notImplementedDescription'),
      variant: "destructive",
    });
    setIsSubmitting(false);
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('profileSettings.title')}</h2>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex-shrink-0">
              {formValues.avatarUrl ? (
                <img
                  src={formValues.avatarUrl}
                  alt={`${formValues.firstName} ${formValues.lastName}`.trim()}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">{`${formValues.firstName} ${formValues.lastName}`.trim()}</h3>
              <p className="text-sm text-gray-500 capitalize">{user?.roles?.join(", ")}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">{t('profileSettings.label.firstName')}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  placeholder={t('profileSettings.placeholder.firstName')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">{t('profileSettings.label.lastName')}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  placeholder={t('profileSettings.placeholder.lastName')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">{t('profileSettings.label.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  placeholder={t('profileSettings.placeholder.email')}
                  required
                />
              </div>
              
             
            </div>
            
          
          </form>
        </div>
      </Card>
    </div>
  );
};
