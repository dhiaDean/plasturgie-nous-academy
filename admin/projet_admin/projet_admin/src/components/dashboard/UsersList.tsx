// File: src/components/admin/UsersList.tsx (or wherever it is)
import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { UserAPI } from "@/services/api.service";
import { UserResponseDTO, Role, UserRoleUpdateRequestDTO } from "@/services/api.types"; // <<< IMPORT UserRoleUpdateRequestDTO
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, UserPlus, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

export const UsersList = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user: currentUser } = useAuth(); // auth context user
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Consider using UserAPI.getAllUsersForList if it returns all necessary fields (like role)
      // If UserListDTO doesn't have 'role', then UserResponseDTO is needed here.
      const response = await UserAPI.getAllUsers_DEPRECATED(); // Assuming this returns role
      setUsers(response.data || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err?.message || t('usersList.error.failedToLoad'));
      toast({ // Add toast for fetch error
        title: t('usersList.error.fetchErrorTitle'),
        description: err?.message || t('usersList.error.failedToLoad'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [t]); // Added t to dependencies if translations might change loading messages

  const filteredUsers = searchTerm
    ? users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : users;

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "bg-red-100 text-red-800";
      case Role.INSTRUCTOR:
        return "bg-blue-100 text-blue-800";
      case Role.COMPANY_REP:
        return "bg-green-100 text-green-800";
      case Role.LEARNER:
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditClick = (user: UserResponseDTO) => {
    setEditingUserId(user.userId);
    setEditingRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingRole(null);
  };

  // --- MODIFIED handleSaveEdit ---
  const handleSaveEdit = async (userId: number) => {
    if (!editingRole) {
      toast({
        title: t('usersList.error.validationErrorTitle'),
        description: t('usersList.error.roleRequired'),
        variant: "destructive",
      });
      return;
    }

    // Construct the DTO specifically for role update
    const roleUpdateData: UserRoleUpdateRequestDTO = {
      role: editingRole,
    };

    try {
      // Call the new dedicated API endpoint
      await UserAPI.updateUserRole(userId, roleUpdateData);
      toast({
        title: t('usersList.success.updateTitle'),
        description: t('usersList.success.roleUpdated'),
      });
      fetchUsers(); // Refetch users to show the updated role
      setEditingUserId(null);
      setEditingRole(null);
    } catch (error: any) {
      console.error("Error updating user role (UsersList.tsx):", error); // More specific console log
      const apiErrorMessage = error?.message || error?.error || "Unknown error"; // error.response.data.message is typical for AxiosError
      toast({
        title: t('usersList.error.updateErrorTitle'),
        description: `${t('usersList.error.failedToUpdateRole')}: ${apiErrorMessage}`,
        variant: "destructive",
      });
    }
  };
  // --- END OF MODIFIED handleSaveEdit ---

  // Add handleDeleteUser function
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(t('usersList.confirm.deleteUser'))) {
      return;
    }
    try {
      // Assuming UserAPI has a deleteUser function
      await UserAPI.deleteUser(userId);
      toast({
        title: t('usersList.success.deleteTitle'),
        description: t('usersList.success.userDeleted'),
      });
      fetchUsers(); // Refetch users after deletion
    } catch (error: any) {
      console.error("Error deleting user (UsersList.tsx):", error);
      const apiErrorMessage = error?.message || error?.error || "Unknown error";
      toast({
        title: t('usersList.error.deleteErrorTitle'),
        description: `${t('usersList.error.failedToDeleteUser')}: ${apiErrorMessage}`,
        variant: "destructive",
      });
    }
  };

  // ... (rest of your component: loading skeleton, error display, JSX) ...

  // Ensure your JSX for user mapping uses `user.userId` correctly
  // and that the Select component correctly updates `editingRole`.

  // (Loading skeleton and error display can remain the same)

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('usersList.title')}</h1>
        <div className="flex space-x-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder={t('usersList.placeholder.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:ring-brand-purple focus:border-brand-purple"
            />
          </div>
          <Button className="bg-brand-purple hover:bg-brand-dark-purple flex items-center">
            <UserPlus size={16} className="mr-2" /> {t('usersList.button.addUser')}
          </Button>
        </div>
      </div>

      {loading && users.length === 0 ? (
         <div className="space-y-4">
         {[1, 2, 3].map((i) => (
           <Card key={`loading-${i}`} className="p-6 animate-pulse">
             <div className="flex items-center space-x-4">
               <div className="rounded-full bg-gray-200 h-12 w-12"></div>
               <div className="flex-1">
                 <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/3"></div>
               </div>
               <div className="h-6 bg-gray-200 rounded-full w-16"></div>
             </div>
           </Card>
         ))}
       </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('dashboard.admin.errorPrefix')}</strong>
          <span className="block sm:inline">{error}</span>
          <Button variant="outline" className="mt-2 ml-4 text-xs" size="sm" onClick={fetchUsers}>
            {t('usersList.error.retry')}
          </Button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-md border">
          <h3 className="text-lg font-semibold text-gray-500">{t('usersList.emptyState.noUsersFound')}</h3>
          <p className="text-gray-400 text-sm mt-2">
            {searchTerm ? t('usersList.emptyState.adjustSearch') : t('usersList.emptyState.noRegisteredUsers')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={`user-${user.userId ?? user.email}`} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12 flex items-center justify-center text-gray-500">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username}
                  </h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                {editingUserId === user.userId ? (
                  <div className="flex items-center space-x-2">
                    <Select
                      value={editingRole || undefined} // Ensure `editingRole` is string if SelectItem values are strings
                      onValueChange={(value) => setEditingRole(value as Role)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('usersList.select.selectRole')} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Role).map((roleValue) => ( // Changed `role` to `roleValue` to avoid scope collision
                          <SelectItem key={roleValue} value={roleValue}> {/* Changed `role` to `roleValue` */}
                            {t(`roles.${roleValue.toLowerCase()}`, roleValue)} {/* For translation if needed */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveEdit(user.userId)} // Ensure userId is passed
                      className="text-green-600 hover:text-green-800"
                      disabled={!editingRole} // Disable save if no role selected
                    >
                      <Save size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge className={`${getRoleBadgeColor(user.role)} px-3 py-1 rounded-full text-xs`}>
                      {t(`roles.${user.role.toLowerCase()}`, user.role)}
                    </Badge>
                    {currentUser?.roles?.includes(Role.ADMIN) && ( // Check if current authenticated user is ADMIN
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit size={16} className="mr-1" /> {t('usersList.button.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user.userId)} // Implement delete if needed
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
