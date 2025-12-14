import { useAuth } from "@/context/AuthContext";
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  X,
  FileText,
  Building2,
  CalendarDays,
  Award,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Role } from "@/services/api.types";
import i18n from '@/i18n';
import { useState, useMemo } from 'react';

// Import Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  roles: Role[];
  badge?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  onClose: () => void;
}

// Custom hook for menu management
const useMenuItems = () => {
  const { t } = useTranslation();
  
  return useMemo((): MenuItem[] => [
    {
      name: t('sidebar.menu.dashboard'),
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: [Role.ADMIN, Role.INSTRUCTOR, Role.LEARNER, Role.COMPANY_REP],
    },
    {
      name: t('sidebar.menu.learning'),
      icon: BookOpen,
      path: "/dashboard/learning",
      roles: [Role.ADMIN, Role.INSTRUCTOR, Role.LEARNER],
      children: [
        {
          name: t('sidebar.menu.formations'),
          icon: BookOpen,
          path: "/dashboard/formations",
          roles: [Role.ADMIN, Role.INSTRUCTOR],
        },
        {
          name: t('sidebar.menu.certifications'),
          icon: Award,
          path: "/dashboard/certifications",
          roles: [Role.ADMIN, Role.INSTRUCTOR],
        },
        {
          name: t('sidebar.menu.practicalSessions'),
          icon: CalendarDays,
          path: "/dashboard/practical-sessions",
          roles: [Role.ADMIN, Role.INSTRUCTOR],
        },
      ]
    },
    {
      name: t('sidebar.menu.events'),
      icon: Calendar,
      path: "/dashboard/events",
      roles: [Role.ADMIN, Role.COMPANY_REP],
    },
    {
      name: t('sidebar.menu.actualites'),
      icon: FileText,
      path: "/dashboard/actualites",
      roles: [Role.ADMIN, Role.INSTRUCTOR],
    },
    {
      name: t('sidebar.menu.management'),
      icon: Users,
      path: "/dashboard/management",
      roles: [Role.ADMIN],
      children: [
        {
          name: t('sidebar.menu.instructors'),
          icon: Users,
          path: "/dashboard/instructors",
          roles: [Role.ADMIN],
        },
        {
          name: t('sidebar.menu.users'),
          icon: Users,
          path: "/dashboard/users",
          roles: [Role.ADMIN],
        },
        {
          name: t('sidebar.menu.companies'),
          icon: Building2,
          path: "/dashboard/companies",
          roles: [Role.ADMIN, Role.COMPANY_REP],
        },
      ]
    },
    {
      name: t('sidebar.menu.analytics'),
      icon: BarChart,
      path: "/dashboard/analytics",
      roles: [Role.ADMIN, Role.INSTRUCTOR],
    },
    {
      name: t('sidebar.menu.profile'),
      icon: User,
      path: "/dashboard/profile",
      roles: [Role.ADMIN, Role.INSTRUCTOR, Role.LEARNER, Role.COMPANY_REP],
    },
    {
      name: t('sidebar.menu.settings'),
      icon: Settings,
      path: "/dashboard/settings",
      roles: [Role.ADMIN, Role.INSTRUCTOR],
    },
  ], [t]);
};

// Menu Item Component
const MenuItemComponent: React.FC<{
  item: MenuItem;
  currentPath: string;
  onNavigate: (path: string) => void;
  hasPermission: boolean;
  level?: number;
}> = ({ item, currentPath, onNavigate, hasPermission, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!hasPermission) return null;

  const isActive = currentPath === item.path || 
    (item.children && item.children.some(child => currentPath === child.path));
  
  const isParentActive = item.children && item.children.some(child => currentPath === child.path);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (item.children) {
      setIsExpanded(!isExpanded);
    } else {
      onNavigate(item.path);
    }
  };

  return (
    <div>
      <a
        href={item.path}
        onClick={handleClick}
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-md group transition-all duration-200",
          level > 0 && "ml-4 py-2",
          isActive || isParentActive
            ? "bg-gradient-to-r from-brand-purple/10 to-brand-purple/5 text-brand-dark-purple border-r-2 border-brand-purple"
            : "text-gray-600 hover:bg-gray-50 hover:text-brand-purple hover:translate-x-1"
        )}
      >
        <item.icon
          size={level > 0 ? 16 : 20}
          className={cn(
            "mr-3 transition-colors",
            isActive || isParentActive
              ? "text-brand-purple"
              : "text-gray-400 group-hover:text-brand-purple"
          )}
        />
        <span className="flex-1">{item.name}</span>
        
        {item.badge && (
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-brand-purple text-white rounded-full">
            {item.badge}
          </span>
        )}
        
        {item.children && (
          <div className="ml-2">
            {isExpanded ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </div>
        )}
      </a>
      
      {item.children && isExpanded && (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => (
            <MenuItemComponent
              key={child.path}
              item={child}
              currentPath={currentPath}
              onNavigate={onNavigate}
              hasPermission={true} // Already filtered at parent level
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Language Selector Component
const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language || i18n.resolvedLanguage;

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="p-4 border-t border-gray-200">
      <Select onValueChange={handleLanguageChange} defaultValue={currentLanguage}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('language.select')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center">
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// User Profile Component
const UserProfile: React.FC<{
  user: any;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  const { t } = useTranslation();
  
  const displayName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || 
    t('sidebar.user.fallbackName');
  
  const displayRoles = user?.roles?.join(", ") || t('sidebar.user.fallbackRole');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50/50">
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-dark-purple flex items-center justify-center shadow-sm">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={displayName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {getInitials(displayName)}
              </span>
            )}
          </div>
        </div>
        <div className="ml-3 min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 capitalize truncate">
            {displayRoles}
          </p>
        </div>
      </div>
      
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 transition-all duration-200"
      >
        <LogOut size={16} className="mr-2" />
        {t('sidebar.button.signOut')}
      </button>
    </div>
  );
};

// Main Sidebar Component
export const Sidebar = ({ onClose }: SidebarProps) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = useMenuItems();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose(); // Close sidebar on mobile when clicking a link
  };

  // Filter menu items based on user roles
  const filteredMenuItems = useMemo(() => {
    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        if (!user?.roles) return false;
        
        const hasPermission = item.roles.some(role => user.roles?.includes(role));
        
        if (item.children) {
          const filteredChildren = filterItems(item.children);
          return hasPermission && filteredChildren.length > 0;
        }
        
        return hasPermission;
      }).map(item => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined
      }));
    };

    return filterItems(menuItems);
  }, [menuItems, user?.roles]);

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Close button - visible on mobile only */}
      <div className="lg:hidden absolute right-3 top-3 z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label={t('sidebar.button.close')}
        >
          <X size={18} />
        </button>
      </div>

      {/* Logo and brand */}
      <div className="p-6 flex items-center">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-dark-purple flex items-center justify-center mr-3 shadow-sm">
          <span className="text-white font-bold text-lg">P</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-xl text-gray-900 truncate">
            {t('sidebar.brand.name')}
          </h1>
          <p className="text-xs text-gray-500 truncate">
            {t('sidebar.brand.tagline')}
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      {/* Menu items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredMenuItems.map((item) => (
          <MenuItemComponent
            key={item.path}
            item={item}
            currentPath={location.pathname}
            onNavigate={handleNavigate}
            hasPermission={true} // Already filtered
          />
        ))}
      </nav>

      {/* Language Switcher */}
      <LanguageSelector />

      {/* User area */}
      <UserProfile user={user} onLogout={handleLogout} />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};
