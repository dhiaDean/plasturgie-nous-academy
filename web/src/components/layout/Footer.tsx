
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-tunisiaBlue-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tunisia Formation</h3>
            <p className="text-gray-300 mb-4">
              Centre de formation spécialisé dans les domaines de la plasturgie et de l'industrie technique en Tunisie.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/formations" className="text-gray-300 hover:text-white transition-colors">
                  Formations
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-white transition-colors">
                  Ressources
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h3 className="text-xl font-bold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="text-gray-300 hover:text-white transition-colors">
                  Partenariats
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-300 hover:text-white transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contactez-nous</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-tunisiaTeal-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Rue de l'Innovation, Technopole El Ghazala, Ariana, Tunisie
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-tunisiaTeal-400" />
                <a href="tel:+21670123456" className="text-gray-300 hover:text-white">
                  +216 70 123 456
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-tunisiaTeal-400" />
                <a href="mailto:contact@tunisiaformation.com" className="text-gray-300 hover:text-white">
                  contact@tunisiaformation.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <div className="flex flex-col space-y-3">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="bg-tunisiaBlue-700 border-tunisiaBlue-600 text-white placeholder:text-gray-400"
                />
                <Button className="bg-tunisiaTeal-500 hover:bg-tunisiaTeal-600 text-white w-full">
                  S'inscrire
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-tunisiaBlue-700 mt-8 pt-8">
          <p className="text-center text-gray-400">
            © {currentYear} Tunisia Formation. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
