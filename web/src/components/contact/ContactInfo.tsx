
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Linkedin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-tunisiaBlue-800 mb-6">
          Informations de contact
        </h3>
        
        <div className="space-y-5">
          <div className="flex items-start">
            <div className="bg-tunisiaBlue-50 p-3 rounded-full mr-4">
              <Phone className="h-6 w-6 text-tunisiaBlue-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Téléphone</h4>
              <a 
                href="tel:+21670123456" 
                className="text-tunisiaBlue-600 hover:text-tunisiaBlue-700"
              >
                +216 70 123 456
              </a>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-tunisiaBlue-50 p-3 rounded-full mr-4">
              <Mail className="h-6 w-6 text-tunisiaBlue-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Email</h4>
              <a 
                href="mailto:contact@tunisiaformation.com" 
                className="text-tunisiaBlue-600 hover:text-tunisiaBlue-700"
              >
                contact@tunisiaformation.com
              </a>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-tunisiaBlue-50 p-3 rounded-full mr-4">
              <MapPin className="h-6 w-6 text-tunisiaBlue-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Adresse</h4>
              <p className="text-gray-600">
                Rue de l'Innovation, Technopole El Ghazala, <br />
                Ariana, Tunisie
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-tunisiaBlue-50 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-tunisiaBlue-500" />
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Heures d'ouverture</h4>
              <p className="text-gray-600">
                Lundi - Vendredi: 8h00 - 18h00 <br />
                Samedi: 9h00 - 13h00
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-tunisiaBlue-800 mb-4">
          Suivez-nous
        </h3>
        <div className="flex space-x-4">
          <a 
            href="#" 
            className="bg-tunisiaBlue-50 p-3 rounded-full hover:bg-tunisiaBlue-100 transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-6 w-6 text-tunisiaBlue-500" />
          </a>
          <a 
            href="#" 
            className="bg-tunisiaBlue-50 p-3 rounded-full hover:bg-tunisiaBlue-100 transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-6 w-6 text-tunisiaBlue-500" />
          </a>
          <a 
            href="#" 
            className="bg-tunisiaBlue-50 p-3 rounded-full hover:bg-tunisiaBlue-100 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-6 w-6 text-tunisiaBlue-500" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
