// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Routes, Route, Navigate, Outlet } from "react-router-dom"; // Import Outlet
import DashboardLayout from "@/components/dashboard/DashboardLayout";
// Remove StatCard if AdminDashboard/InstructorDashboard define their own
// import { StatCard } from "@/components/dashboard/StatCard";
import FormationList from '@/components/dashboard/FormationList';
import { InstructorsList } from "@/components/dashboard/InstructorsList";
import { UsersList } from "@/components/dashboard/UsersList";
import { ProfileSettings } from "@/components/dashboard/ProfileSettings";
import CompanyPage from "@/components/dashboard/CompanyPage"; // Import CompanyPage
import CreateCompanyForm from "@/components/dashboard/CreateCompanyForm"; // Import CreateCompanyForm
import EditCompanyForm from "@/components/dashboard/EditCompanyForm"; // Import EditCompanyForm
import { InstructorAPI, DashboardAPI } from "@/services/api.service";
import {
  InstructorResponseDTO as Instructor,
  Role,
  AdminStatsResponse,
  InstructorStatsResponse
} from "@/services/api.types";
import { Card } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Users, BookOpen, DollarSign, User as UserIcon, Star, FileText } from "lucide-react"; // Aliased User to UserIcon

import CreateCertificationForm from "@/components/dashboard/CreateCertificationForm";
import CertificationPage from "@/components/dashboard/CertificationPage"; // Path adjusted to components/dashboard
import EventsPage from "@/components/dashboard/EventsPage";
 // Import EventsPage
import EventDetailsPage from "./EventDetailsPage"; // Import EventDetailsPage
import PracticalSessionPage from "@/components/dashboard/PracticalSessionPage"; // Import PracticalSessionPage
import CreatePracticalSessionForm from "@/components/dashboard/CreatePracticalSessionForm";
import DashboardActualites from "@/components/dashboard/Actualites"; // Import DashboardActualites

// --- AdminDashboard, InstructorDashboard, DefaultDashboard, DashboardHome ---
// These components should be defined or imported correctly.
// For brevity, assuming they are defined as in your previous example.

const AdminDashboard = () => { /* ... Your AdminDashboard implementation ... */
  const { t } = useTranslation();
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    DashboardAPI.getAdminStats()
      .then(res => setStats(res.data))
      .catch(err => setError(err.message || t('dashboard.admin.errorLoadingStats')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <p>{t('dashboard.admin.loadingStats')}</p>;
  if (error) return <p className="text-red-500">{t('dashboard.admin.errorPrefix')}{error}</p>; {/* Re-using error prefix key */}
  if (!stats) return <p>{t('dashboard.admin.noStats')}</p>;

  // Simplified render for brevity
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('dashboard.admin.title')}</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <p>{t('dashboard.admin.totalUsers')}{stats.totalUsers}</p>
        <p>{t('dashboard.admin.totalInstructors')}{stats.totalInstructors}</p>
        <p>{t('dashboard.admin.totalFormations')}{stats.totalFormations}</p>
        <p>{t('dashboard.admin.totalIncome')}{stats.totalIncome}</p>
      </div>
      {/* Add charts and other stat displays */}
    </div>
  );
};

const InstructorDashboard = () => { /* ... Your InstructorDashboard implementation ... */
  const { t } = useTranslation();
  const [stats, setStats] = useState<InstructorStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // To get instructorId

  useEffect(() => {
    if (user?.instructorProfile?.instructorId) { // Check if instructor profile has an ID
      const idToFetch = user.instructorProfile.instructorId;
      DashboardAPI.getInstructorStats(idToFetch)
        .then(res => setStats(res.data))
        .catch(err => setError(err.message || t('dashboard.instructor.errorLoadingStats')))
        .finally(() => setLoading(false));
    } else if (user && user.roles?.includes(Role.INSTRUCTOR)) {
        setError(t('dashboard.instructor.instructorIdNotFound'));
        setLoading(false);
    } else {
        setLoading(false); // Not an instructor or no user
    }
  }, [user, t]);

  if (loading) return <p>{t('dashboard.instructor.loadingStats')}</p>;
  if (error) return <p className="text-red-500">{t('dashboard.admin.errorPrefix')}{error}</p>; {/* Re-using error prefix key */}
  if (!stats) return <p>{t('dashboard.instructor.noStats')}</p>;
  // Simplified render
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('dashboard.instructor.title')}</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <p>{t('dashboard.instructor.totalStudents')}{stats.totalStudents}</p>
        <p>{t('dashboard.instructor.totalFormations')}{stats.totalFormations}</p>
      </div>
    </div>
  );
};

const DefaultDashboard = () => { /* ... Your DefaultDashboard implementation ... */
  const { t } = useTranslation();
  return <p>{t('dashboard.default.welcome')}</p>;
};

const DashboardHome = () => {
  const { t } = useTranslation(); // Add useTranslation here as well
  const { user } = useAuth();
  if (user?.roles?.includes(Role.ADMIN)) return <AdminDashboard />;
  if (user?.roles?.includes(Role.INSTRUCTOR)) return <InstructorDashboard />;
  return <DefaultDashboard />;
};
// --- End of dashboard inner components ---


const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth(); // Renamed isLoading to isAuthLoading
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || !user) {
    // No translation needed for loading spinner
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div> {/* Use a theme color */}
      </div>
    );
  }

  const isAdmin = user.roles?.includes(Role.ADMIN);
  const isInstructor = user.roles?.includes(Role.INSTRUCTOR);
  const isCompanyRep = user.roles?.includes(Role.COMPANY_REP); // Define isCompanyRep

  return (
    <DashboardLayout> {/* DashboardLayout should contain an <Outlet /> for these routes */}
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="events" element={<EventsPage />} /> {/* Add route for EventsPage */}
        <Route path="events/:id" element={<EventDetailsPage />} /> {/* Add route for EventDetailsPage */}
        <Route path="actualites" element={<DashboardActualites />} /> {/* Add route for ActualitesPage */}


        {/* Routes accessible to ADMIN or COMPANY_REP */}
        {(isAdmin || isCompanyRep) && (
          <>
            <Route path="companies" element={<CompanyPage />} />
            <Route path="companies/new" element={<CreateCompanyForm />} /> {/* Add route for new company form */}
            <Route path="companies/edit/:companyId" element={<EditCompanyForm />} /> {/* Add route for edit company form */}
          </>
        )}

        {/* Routes accessible to ADMIN or INSTRUCTOR */}
        {(isAdmin || isInstructor) && (
          <>
            <Route path="formations" element={<FormationList />} />
            <Route path="certifications" element={<CertificationPage />} /> {/* List user's own certs */}
            <Route path="practical-sessions" element={<PracticalSessionPage />} /> {/* Add route for Practical Sessions page */}
            <Route path="practical-sessions/create" element={<CreatePracticalSessionForm />} /> {/* Add route for Create Practical Session page */}

            {/* === MOVED HERE === */}
            <Route path="certifications/create" element={<CreateCertificationForm />} />
          </>
        )}

        {/* Routes accessible only to ADMIN */}
        {isAdmin && (
          <>
            {/* <Route path="certifications/create" element={<CreateCertificationForm />} />  Removed from here */}
            <Route path="instructors" element={<InstructorsList />} />
            <Route path="users" element={<UsersList />} />
            {/* Admin might also have a page to view ALL certifications */}
            {/* <Route path="admin/certifications-all" element={<AdminAllCertificationsPage />} /> */}
          </>
        )}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Outlet /> {/* This is where nested routes will render */}
    </DashboardLayout>
  );
};

export default Dashboard;
