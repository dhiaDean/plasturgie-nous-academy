
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactFormFieldsProps {
  phone: string;
  formation: string;
  subject: string;
  message: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string) => void;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  phone,
  formation,
  subject,
  message,
  handleChange,
  handleSelectChange,
}: ContactFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <Input
            id="phone"
            name="phone"
            value={phone}
            onChange={handleChange}
            placeholder="Votre numéro de téléphone"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="formation" className="block text-sm font-medium text-gray-700 mb-1">
            Formation d'intérêt
          </label>
          <Select onValueChange={handleSelectChange} value={formation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une formation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="injection">Techniques d'injection plastique</SelectItem>
              <SelectItem value="extrusion">Extrusion et soufflage</SelectItem>
              <SelectItem value="maintenance">Maintenance industrielle</SelectItem>
              <SelectItem value="qualite">Gestion de la qualité</SelectItem>
              <SelectItem value="moules">Conception de moules</SelectItem>
              <SelectItem value="securite">Sécurité en milieu industriel</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Sujet *
        </label>
        <Input
          id="subject"
          name="subject"
          value={subject}
          onChange={handleChange}
          placeholder="Sujet de votre message"
          required
          className="w-full"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          value={message}
          onChange={handleChange}
          placeholder="Votre message"
          required
          className="w-full min-h-[120px]"
        />
      </div>
    </>
  );
};

export default ContactFormFields;
