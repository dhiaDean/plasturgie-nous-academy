"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Role, PracticalSessionDTO } from '@/services/api.types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  Search, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  Clock, 
  BookOpen, 
  User, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { PracticalSessionAPI } from '@/services/api.service';

// Custom hook for practical sessions data
const usePracticalSessions = (user: any, isAuthLoading: boolean) => {
  const [sessions, setSessions] = useState<PracticalSessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchSessions = useCallback(async () => {
    if (isAuthLoading) return;

    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (user?.roles?.includes(Role.INSTRUCTOR)) {
        response = await PracticalSessionAPI.getPracticalSessionsForInstructorDashboard();
      } else if (user?.roles?.includes(Role.LEARNER) || user?.roles?.includes(Role.COMPANY_REP)) {
        response = await PracticalSessionAPI.getUpcomingPracticalSessionsForUser();
      } else if (user?.roles?.includes(Role.ADMIN)) {
        // Consider implementing a dedicated admin endpoint
        response = await PracticalSessionAPI.getUpcomingPracticalSessionsForUser();
      } else {
        setSessions([]);
        setLoading(false);
        return;
      }

      setSessions(response.data || []);
    } catch (err: any) {
      console.error("Error fetching practical sessions:", err);
      const errMsg = err?.response?.data?.message || err?.message || t('practicalSessionPage.error.failedToLoad');
      setError(errMsg);
      toast({
        title: t('practicalSessionPage.toast.loadingErrorTitle'),
        description: errMsg,
        variant: "destructive",
      });
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthLoading, toast, t]);

  const deleteSession = useCallback(async (sessionId: number, sessionTitle: string) => {
    try {
      await PracticalSessionAPI.deletePracticalSession(sessionId);
      toast({
        title: t('practicalSessionPage.toast.deleteSuccessTitle'),
        description: t('practicalSessionPage.toast.deleteSuccessDescription', { title: sessionTitle }),
      });
      await fetchSessions(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error("Error deleting practical session:", err);
      const errMsg = err?.response?.data?.message || err?.message || t('practicalSessionPage.error.failedToDelete');
      toast({
        title: t('practicalSessionPage.toast.deleteErrorTitle'),
        description: `${t('practicalSessionPage.toast.deleteErrorPrefix')}${errMsg}`,
        variant: "destructive",
      });
      return false;
    }
  }, [toast, t, fetchSessions]);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    deleteSession
  };
};

// Session Card Component
const SessionCard: React.FC<{
  session: PracticalSessionDTO;
  canManage: boolean;
  onDelete: (id: number, title: string) => Promise<boolean>;
}> = ({ session, canManage, onDelete }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(t('practicalSessionPage.confirm.delete', { title: session.title }))) {
      return;
    }
    
    setIsDeleting(true);
    await onDelete(session.id, session.title || t('practicalSessionPage.card.untitledSession'));
    setIsDeleting(false);
  };

  const formatDateTime = (dateTime: string) => {
    try {
      return session.sessionDateTimeFormatted || format(new Date(dateTime), 'PPP p');
    } catch {
      return t('practicalSessionPage.card.invalidDate');
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {session.title || t('practicalSessionPage.card.untitledSession')}
        </CardTitle>
        <div className="flex flex-wrap gap-1 mt-1">
          {session.status && (
            <Badge 
              variant={session.status.toLowerCase() === 'active' ? 'default' : 'secondary'} 
              className="capitalize"
            >
              {session.status.toLowerCase()}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pt-1 pb-3 text-sm text-gray-600 space-y-3">
        {session.sessionDateTime && (
          <div className="flex items-start gap-2">
            <Calendar size={16} className="mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="break-words">{formatDateTime(session.sessionDateTime)}</span>
          </div>
        )}
        
        {session.location && (
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="break-words">{session.location}</span>
          </div>
        )}
        
        {session.durationMinutes != null && (
          <div className="flex items-center gap-2">
            <Clock size={16} className="mr-1 text-gray-500 flex-shrink-0" />
            <span>{t('practicalSessionPage.card.duration', { minutes: session.durationMinutes })}</span>
          </div>
        )}
        
        {session.courseTitle && (
          <div className="flex items-start gap-2">
            <BookOpen size={16} className="mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="break-words">
              {session.courseTitle}
              {session.courseSubTitle && ` - ${session.courseSubTitle}`}
            </span>
          </div>
        )}
        
        {session.conductingInstructorName && (
          <div className="flex items-start gap-2">
            <User size={16} className="mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="break-words">
              {t('practicalSessionPage.card.instructor', { name: session.conductingInstructorName })}
            </span>
          </div>
        )}
        
        {session.description && (
          <p className="text-xs text-gray-500 mt-3 line-clamp-3 leading-relaxed">
            {session.description}
          </p>
        )}
      </CardContent>
      
      {canManage && (
        <CardFooter className="border-t p-3 flex justify-end space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/practical-sessions/edit/${session.id}`}>
              <Edit3 size={16} className="mr-1" /> 
              {t('practicalSessionPage.button.edit')}
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-800 hover:bg-red-50" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 size={16} className="mr-1 animate-spin" />
            ) : (
              <Trash2 size={16} className="mr-1" />
            )}
            {t('practicalSessionPage.button.delete')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// Main component
const PracticalSessionPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const canManageSessions = useMemo(() => {
    if (!user) return false;
    return user.roles?.includes(Role.INSTRUCTOR) || user.roles?.includes(Role.ADMIN);
  }, [user]);

  const {
    sessions,
    loading,
    error,
    fetchSessions,
    deleteSession
  } = usePracticalSessions(user, isAuthLoading);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filteredSessions = useMemo(() => {
    if (!searchTerm) return sessions;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return sessions.filter(session => 
      [
        session.title,
        session.description,
        session.location,
        session.courseTitle,
        session.courseSubTitle,
        session.conductingInstructorName
      ].some(field => field?.toLowerCase().includes(lowerSearchTerm))
    );
  }, [sessions, searchTerm]);

  // Loading state
  if (isAuthLoading || loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-xl text-gray-700">
            {isAuthLoading ? t('loading.authenticating') : t('practicalSessionPage.loading')}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              {t('practicalSessionPage.error.somethingWentWrong')}
            </h3>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button 
              variant="destructive" 
              onClick={fetchSessions} 
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('practicalSessionPage.button.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {t('practicalSessionPage.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('practicalSessionPage.subtitle', { count: filteredSessions.length })}
          </p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('practicalSessionPage.placeholder.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchSessions}
            disabled={loading}
            className="flex-shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          {canManageSessions && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap flex-shrink-0">
              <Link to="/dashboard/practical-sessions/create">
                <PlusCircle size={18} className="mr-2" />
                {t('practicalSessionPage.button.createSession')}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {filteredSessions.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm 
                ? t('practicalSessionPage.emptyState.noMatch') 
                : t('practicalSessionPage.emptyState.noSessions')
              }
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm 
                ? t('practicalSessionPage.emptyState.tryDifferentSearch')
                : canManageSessions 
                  ? t('practicalSessionPage.emptyState.getStarted')
                  : t('practicalSessionPage.emptyState.checkBackLater')
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
                className="mt-4"
              >
                {t('practicalSessionPage.button.clearSearch')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              canManage={canManageSessions}
              onDelete={deleteSession}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticalSessionPage;
