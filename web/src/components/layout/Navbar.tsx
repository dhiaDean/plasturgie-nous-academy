import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, ChevronDown, LogIn, LogOut, User,
  BookOpen, MessageSquare, HelpCircle, Star
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageUserAPI } from "@/services/api.service";
import { ProfileImage } from "@/pages/Profile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImageId, setProfileImageId] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Fetch profile image id if user is authenticated
  useEffect(() => {
    const fetchImage = async () => {
      if (user?.userId ?? user?.id) {
        const userId = user.userId ?? user.id;
        try {
          const imageResponse = await ImageUserAPI.getImagesForUser(userId);
          setProfileImageId(imageResponse.data?.[0]?.id ?? null);
        } catch {
          setProfileImageId(null);
        }
      } else {
        setProfileImageId(null);
      }
    };
    fetchImage();
  }, [user]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogin = () => navigate('/login');
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleQuoteRequest = () => navigate('/quote');

  const getUserInitials = () => {
    if (!user || !user.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-sm py-3"
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-tunisiaBlue-700 flex items-center">
            <span className="bg-gradient-to-r from-tunisiaBlue-500 to-tunisiaTeal-400 text-transparent bg-clip-text">
              Tunisia Formation
            </span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`font-medium transition-colors ${
              isActive('/') 
                ? "text-tunisiaBlue-600 border-b-2 border-tunisiaBlue-500" 
                : "text-gray-700 hover:text-tunisiaBlue-500"
            }`}
          >
            Accueil
          </Link>
          
          <div className="relative group">
            <button 
              className={`font-medium transition-colors flex items-center ${
                isActive('/formations') 
                  ? "text-tunisiaBlue-600 border-b-2 border-tunisiaBlue-500" 
                  : "text-gray-700 hover:text-tunisiaBlue-500"
              }`}
              aria-expanded={activeDropdown === 'formations'}
              aria-haspopup="true"
            >
              Formations <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-1 rounded-md bg-white">
                <Link to="/formations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-tunisiaBlue-50 hover:text-tunisiaBlue-600">Toutes les formations</Link>
                <Link to="/formations/plasturgie" className="block px-4 py-2 text-sm text-gray-700 hover:bg-tunisiaBlue-50 hover:text-tunisiaBlue-600">Plasturgie</Link>
                <Link to="/formations/technique" className="block px-4 py-2 text-sm text-gray-700 hover:bg-tunisiaBlue-50 hover:text-tunisiaBlue-600">Technique</Link>
                <Link to="/formations/gestion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-tunisiaBlue-50 hover:text-tunisiaBlue-600">Gestion</Link>
              </div>
            </div>
          </div>
          
       
          
          <Link 
            to="/testimonials" 
            className={`font-medium transition-colors ${
              isActive('/testimonials') 
                ? "text-tunisiaBlue-600 border-b-2 border-tunisiaBlue-500" 
                : "text-gray-700 hover:text-tunisiaBlue-500"
            }`}
          >
            Témoignages
          </Link>
          <Link 
            to="/blog" 
            className={`font-medium transition-colors ${
              isActive('/blog') 
                ? "text-tunisiaBlue-600 border-b-2 border-tunisiaBlue-500" 
                : "text-gray-700 hover:text-tunisiaBlue-500"
            }`}
          >
            Blog
          </Link>
          
          <Link 
            to="/faq" 
            className={`font-medium transition-colors ${
              isActive('/faq') 
                ? "text-tunisiaBlue-600 border-b-2 border-tunisiaBlue-500" 
                : "text-gray-700 hover:text-tunisiaBlue-500"
            }`}
          >
            FAQ
          </Link>
          
          <Link 
            to="/about" 
            className={`font-medium transition-colors ${
              isActive('/about') 
                ? "text-tunisiaBlue-600 border-b-2 border-tunisiaBlue-500" 
                : "text-gray-700 hover:text-tunisiaBlue-500"
            }`}
          >
            À propos
          </Link>
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Link to="/profile">
                  <div className="flex items-center gap-2 hover:bg-gray-100 rounded-full px-3 py-1 transition-colors">
                    <Avatar className="h-8 w-8 bg-tunisiaBlue-500 text-white cursor-pointer border-2 border-white shadow-sm" title={user?.username}>
                      {profileImageId ? (
                        <ProfileImage imageId={profileImageId} altText={user?.username + "'s profile picture"} />
                      ) : (
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Link>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1 rounded-md bg-white">
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-tunisiaBlue-50 hover:text-tunisiaBlue-600">
                      <User className="mr-2 h-4 w-4" />
                      Mon profil
                    </Link>
                    <Link to="/my-courses" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-tunisiaBlue-50 hover:text-tunisiaBlue-600">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Mes formations
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-tunisiaBlue-50 hover:text-tunisiaBlue-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogin}
              className="flex items-center border-tunisiaBlue-500 text-tunisiaBlue-600 hover:bg-tunisiaBlue-50"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Connexion
            </Button>
          )}
          <Button 
            className="bg-gradient-to-r from-tunisiaBlue-500 to-tunisiaTeal-400 hover:from-tunisiaBlue-600 hover:to-tunisiaTeal-500 text-white shadow-md hover:shadow-lg transition-all" 
            onClick={handleQuoteRequest}
          >
            Demander un devis
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-700 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg max-h-screen overflow-y-auto">
          <div className="px-4 py-5 space-y-4">
            <Link 
              to="/" 
              className={`block font-medium ${isActive('/') ? 'text-tunisiaBlue-600' : 'text-gray-700'}`}
            >
              Accueil
            </Link>
            
            <div>
              <button 
                className={`flex items-center justify-between w-full font-medium ${isActive('/formations') ? 'text-tunisiaBlue-600' : 'text-gray-700'}`}
                onClick={() => toggleDropdown('formations')}
                aria-expanded={activeDropdown === 'formations'}
              >
                Formations <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'formations' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'formations' && (
                <div className="mt-2 pl-4 space-y-2 border-l-2 border-tunisiaBlue-100">
                  <Link to="/formations" className="block text-sm text-gray-600 py-1 hover:text-tunisiaBlue-500">Toutes les formations</Link>
                  <Link to="/formations/plasturgie" className="block text-sm text-gray-600 py-1 hover:text-tunisiaBlue-500">Plasturgie</Link>
                  <Link to="/formations/technique" className="block text-sm text-gray-600 py-1 hover:text-tunisiaBlue-500">Technique</Link>
                  <Link to="/formations/gestion" className="block text-sm text-gray-600 py-1 hover:text-tunisiaBlue-500">Gestion</Link>
                </div>
              )}
            </div>
            
           
            
            <Link to="/testimonials" className={`block font-medium ${isActive('/testimonials') ? 'text-tunisiaBlue-600' : 'text-gray-700'}`}>
              <Star className="h-4 w-4 inline mr-2" /> Témoignages
            </Link>
            <Link to="/blog" className={`block font-medium ${isActive('/blog') ? 'text-tunisiaBlue-600' : 'text-gray-700'}`}>
              <BookOpen className="h-4 w-4 inline mr-2" /> Blog
            </Link>
            
            <Link to="/faq" className={`block font-medium ${isActive('/faq') ? 'text-tunisiaBlue-600' : 'text-gray-700'}`}>
              <HelpCircle className="h-4 w-4 inline mr-2" /> FAQ
            </Link>
            
            <Link to="/about" className={`block font-medium ${isActive('/about') ? 'text-tunisiaBlue-600' : 'text-gray-700'}`}>À propos</Link>
            
            <Link to="/contact" className={`block font-medium ${isActive('/contact') ? 'text-tunisiaBlue-600' : 'text-gray-700'}`}>
              <MessageSquare className="h-4 w-4 inline mr-2" /> Contact
            </Link>

            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link to="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100">
                    <Avatar className="h-10 w-10 bg-tunisiaBlue-500 text-white border-2 border-white shadow-sm">
                      {profileImageId ? (
                        <ProfileImage imageId={profileImageId} altText={user?.username + "'s profile picture"} />
                      ) : (
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <span className="block font-medium text-gray-800">{user?.username}</span>
                      <span className="text-xs text-gray-500">Voir mon profil</span>
                    </div>
                  </Link>
                  
                  <Link to="/my-courses" className="flex items-center w-full p-2 text-gray-700 rounded-md hover:bg-gray-100">
                    <BookOpen className="mr-2 h-5 w-5 text-tunisiaBlue-500" />
                    <span>Mes formations</span>
                  </Link>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-gray-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5 text-gray-500" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-white border border-tunisiaBlue-500 text-tunisiaBlue-600 hover:bg-tunisiaBlue-50" 
                  onClick={handleLogin}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Connexion
                </Button>
              )}

              <Button 
                className="w-full mt-3 bg-gradient-to-r from-tunisiaBlue-500 to-tunisiaTeal-400 hover:from-tunisiaBlue-600 hover:to-tunisiaTeal-500 text-white shadow-md" 
                onClick={handleQuoteRequest}
              >
                Demander un devis
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;