import React, { useState, useEffect, ChangeEvent, FormEvent, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path if needed
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2, Camera, Shield, Award } from "lucide-react"; // Added Shield, Award
import Navbar from "@/components/layout/Navbar"; // Adjust path if needed
import Footer from "@/components/layout/Footer"; // Adjust path if needed
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import { UserAPI, ImageUserAPI } from "@/services/api.service"; // API services

// =============================================
// Helper Component: ProfileImage
// =============================================
export const ProfileImage = React.memo(({ imageId, altText = 'Profile' }: { imageId: number | null | undefined, altText?: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    const fetchImg = async (id: number) => {
      setLoading(true);
      setError(false);
      setImageUrl(null);
      try {
        const response = await ImageUserAPI.getImageData(id);
        if (response.data.size > 0) {
          objectUrl = URL.createObjectURL(response.data);
          setImageUrl(objectUrl);
        } else {
          console.warn(`[ProfileImage] Received empty blob for image ID: ${id}`);
          setError(true);
        }
      } catch (err) {
        console.error("[ProfileImage] Failed to load profile image blob", err);
        setError(true);
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (imageId) {
      fetchImg(imageId);
    } else {
      setImageUrl(null);
      setLoading(false);
      setError(false);
    }

    // Cleanup
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageId]);

  if (loading) return <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded-full"><Loader2 className="h-6 w-6 animate-spin text-gray-500" /></div>;
  if (error) return <div className="h-full w-full flex items-center justify-center bg-red-100 rounded-full text-red-500 text-xs" title="Erreur chargement image">!</div>;
  if (imageUrl) return <img src={imageUrl} alt={altText} className="h-full w-full rounded-full object-cover" />;
  return null;
});
ProfileImage.displayName = 'ProfileImage';

// =============================================
// Helper Component: ProfilePictureUpload
// =============================================
const ProfilePictureUpload = ({ userId, profileImageId, onUploadSuccess }: { userId: number, profileImageId: number | null, onUploadSuccess: (newImageId: number) => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleButtonClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChangeAndUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Validation (Example)
      const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        const errorMsg = "Type de fichier non supporté (PNG, JPG, GIF, WebP).";
        setError(errorMsg);
        toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        const errorMsg = "Le fichier est trop volumineux (max 5MB).";
        setError(errorMsg);
        toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        // 1. Delete the old image if it exists
        if (profileImageId) {
          await ImageUserAPI.deleteImage(profileImageId);
        }
        // 2. Upload the new image
        const response = await ImageUserAPI.uploadImage(file, userId);
        const locationHeader = response.headers['location'];
        let newImageId: number | null = null;

        if (locationHeader) {
          try {
            const idStr = locationHeader.split('/').pop();
            if (idStr && !isNaN(parseInt(idStr, 10))) {
              newImageId = parseInt(idStr, 10);
            }
          } catch (parseError) {
            console.error("Error parsing Location header:", parseError);
          }
        }

        toast({ title: "Succès", description: "Image de profil mise à jour." });
        onUploadSuccess(newImageId ?? -1); // Send -1 if ID couldn't be parsed

      } catch (err: any) {
        console.error("Profile Picture Upload Error:", err);
        const errorMsg = err?.response?.data?.message || err?.message || "Échec du téléchargement.";
        setError(errorMsg);
        toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-xs mx-auto">
      <Input
        ref={fileInputRef}
        id="profilePictureInput"
        type="file"
        accept="image/png, image/jpeg, image/gif, image/webp"
        onChange={handleFileChangeAndUpload}
        className="hidden"
        disabled={isUploading}
      />
      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        aria-label="Changer l'image de profil"
      >
        {isUploading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Téléchargement...</>
        ) : (
          <><Camera className="h-4 w-4" /> Changer l'image</>
        )}
      </Button>
      {error && <p className="text-xs text-red-500 mt-1 text-center">{error}</p>}
    </div>
  );
};
ProfilePictureUpload.displayName = 'ProfilePictureUpload';

// =============================================
// Main Component: Profile Page
// =============================================
const Profile = () => {
  const { user: authUser, reloadUser } = useAuth(); // Use directly from context
  const navigate = useNavigate(); // Added useNavigate hook
  const { toast } = useToast();

  // Component-specific state
  const [profileImageId, setProfileImageId] = useState<number | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [infoFormError, setInfoFormError] = useState<string | null>(null);
  const [passwordFormError, setPasswordFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // Form state - initialized/updated via useEffect based on authUser
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  // --- Fetch Image Metadata ---
  const fetchUserImageMetadata = useCallback(async (userId: number) => {
    setIsLoadingImage(true);
    setImageError(null);
    try {
      const imageResponse = await ImageUserAPI.getImagesForUser(userId);
      setProfileImageId(imageResponse.data?.[0]?.id ?? null); // Use optional chaining and nullish coalescing
    } catch (imgError: any) {
      console.warn("Could not fetch profile image metadata:", imgError);
      setImageError("Erreur lors du chargement de l'image.");
      setProfileImageId(null);
    } finally {
       setIsLoadingImage(false);
    }
  }, []);

  // --- Effect to Sync Form Data and Fetch Image ---
  useEffect(() => {
    if (authUser?.userId) {
        setFormData({
            firstName: authUser.firstName || '',
            lastName: authUser.lastName || '',
        });
        fetchUserImageMetadata(authUser.userId);
    }
    // No cleanup needed here for data setting/fetching
  }, [authUser?.userId, authUser?.firstName, authUser?.lastName, fetchUserImageMetadata]);

  // --- Input Handlers ---
  const handleInfoInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setInfoFormError(null);
  };

  const handlePasswordInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordFormError(null);
  };

  // Utility to safely extract error messages
  function getErrorMessage(err: any, fallback = "Une erreur est survenue.") {
    if (err?.response?.data?.message) return err.response.data.message;
    if (err?.message) return err.message;
    if (typeof err === "string") return err;
    if (err && typeof err.toString === "function") return err.toString();
    try {
      return JSON.stringify(err);
    } catch {
      return fallback;
    }
  }

  // --- Form Submit Handlers ---
  const handleInfoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authUser?.userId) return;

    setIsSavingInfo(true);
    setInfoFormError(null);
    try {
      await UserAPI.updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
      }, authUser);
      await reloadUser(); // Reload user data in context
      toast({ title: "Succès", description: "Informations personnelles mises à jour." });
    } catch (err: any) {
      console.error("Profile Info Submit Error:", err);
      const errorMsg = getErrorMessage(err, "Échec de la mise à jour.");
      setInfoFormError(errorMsg);
      toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
    } finally {
      setIsSavingInfo(false);
    }
  };

   const handlePasswordSubmit = async (e: FormEvent) => {
     e.preventDefault();
     setPasswordFormError(null);

     if (passwordData.newPassword !== passwordData.confirmPassword) { setPasswordFormError("Les mots de passe ne correspondent pas."); return; }
     if (!passwordData.oldPassword || !passwordData.newPassword) { setPasswordFormError("Veuillez remplir tous les champs."); return; }
     if (passwordData.newPassword.length < 8) { setPasswordFormError("Mot de passe trop court (min 8 caractères)."); return; }

     setIsSavingPassword(true);
     try {
       await UserAPI.changePassword({
         oldPassword: passwordData.oldPassword,
         newPassword: passwordData.newPassword,
       });
       setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
       toast({ title: "Succès", description: "Mot de passe mis à jour." });
     } catch (err: any) {
       console.error("Profile Password Submit Error:", err);
       const errorMsg = getErrorMessage(err, "Échec de la mise à jour.");
       setPasswordFormError(errorMsg);
       toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
     } finally {
       setIsSavingPassword(false);
     }
   };

  // --- Image Action Handlers ---
  const handleImageUploadSuccess = useCallback((newImageId: number) => {
    if (newImageId > 0) {
      setProfileImageId(newImageId); // Update directly
    } else if (newImageId === -1 && authUser?.userId) {
      fetchUserImageMetadata(authUser.userId); // Refetch as fallback
    }
  }, [authUser?.userId, fetchUserImageMetadata]);

  const handleDeleteImage = async () => {
    if (!profileImageId) return;
    setIsDeletingImage(true);
    try {
      await ImageUserAPI.deleteImage(profileImageId);
      toast({ title: "Succès", description: "Image de profil supprimée." });
      setProfileImageId(null);
    } catch (err: any) {
      console.error("Profile Delete Image Error:", err);
      const errorMsg = getErrorMessage(err, "Échec de la suppression.");
      setImageError(errorMsg); // Set image specific error
      toast({ title: "Erreur", description: errorMsg, variant: "destructive" });
    } finally {
      setIsDeletingImage(false);
    }
  };

  // --- Utility ---
  const getUserInitials = () => {
    const firstName = authUser?.firstName || '';
    const lastName = authUser?.lastName || '';
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    if (lastName) return lastName[0].toUpperCase();
    return authUser?.username?.[0]?.toUpperCase() || '?';
  };

  // --- Render Logic ---
  // ProtectedRoute ensures authUser is available before rendering this component.
  // If somehow authUser is null here, it indicates a problem upstream (ProtectedRoute/AuthContext).
  if (!authUser) {
    return (
       <div className="min-h-screen flex flex-col">
           <Navbar />
           <main className="flex-grow flex items-center justify-center">
               <p className="text-red-500 font-semibold">Erreur critique : Données utilisateur non disponibles.</p>
               {/* Optional: Button to attempt logout/redirect */}
           </main>
           <Footer />
       </div>
    );
  }

  const actualUserId = authUser.userId ?? authUser.id;

  // Main Profile Render
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Mon Profil</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Sidebar */}
            <Card className="lg:col-span-1 shadow-sm">
              <CardContent className="p-6 flex flex-col items-center">
                {/* Image Display & Actions */}
                <div className="relative group mb-4">
                    {isLoadingImage ? (
                         <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-gray-200 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : (
                        <>
                            <Avatar className="h-24 w-24 md:h-28 md:w-28 bg-blue-600 text-white text-3xl ring-2 ring-offset-2 ring-blue-200">
                                <ProfileImage imageId={profileImageId} altText={`${authUser.username}'s profile picture`} />
                                <AvatarFallback>{getUserInitials()}</AvatarFallback>
                            </Avatar>
                            {profileImageId && !imageError && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" className="absolute -top-1 -right-1 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity" disabled={isDeletingImage} title="Supprimer l'image">
                                            {isDeletingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Voulez-vous vraiment supprimer votre image de profil ?</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={isDeletingImage}>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteImage} disabled={isDeletingImage} className="bg-red-600 hover:bg-red-700">{isDeletingImage ? "Suppression..." : "Supprimer"}</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </>
                    )}
                    {imageError && !isLoadingImage && <p className="text-xs text-red-500 mt-1 text-center">{imageError}</p>}
                 </div>

                {/* User Info */}
                <h2 className="text-xl font-semibold text-center text-gray-800">{authUser.username}</h2>
                <p className="text-gray-500 text-sm text-center mb-4">{authUser.email}</p>

                {/* Image Upload Component */}
                {typeof actualUserId === "number" && !isNaN(actualUserId) && (
                  <ProfilePictureUpload userId={actualUserId} profileImageId={profileImageId} onUploadSuccess={handleImageUploadSuccess} />
                )}

                {/* Optional Sidebar Links */}
                <div className="mt-8 space-y-1 w-full border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/certification')}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Mes Certifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="personal" onValueChange={() => { setInfoFormError(null); setPasswordFormError(null); }}>
                <TabsList className="mb-6 grid w-full grid-cols-2 rounded-md p-1 bg-gray-100">
                  <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700">Information Personnelle</TabsTrigger>
                  <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700">Sécurité</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal">
                  <Card className="shadow-sm">
                    <form onSubmit={handleInfoSubmit}>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-800">Information Personnelle</CardTitle>
                        <CardDescription>Mettez à jour vos informations ici.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        {infoFormError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{infoFormError}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label><Input id="username" value={authUser.username} disabled className="bg-gray-100 cursor-not-allowed" /></div>
                          <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label><Input id="email" value={authUser.email} disabled className="bg-gray-100 cursor-not-allowed" /></div>
                          <div><label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label><Input id="firstName" name="firstName" placeholder="Votre prénom" value={formData.firstName} onChange={handleInfoInputChange} disabled={isSavingInfo} /></div>
                          <div><label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label><Input id="lastName" name="lastName" placeholder="Votre nom" value={formData.lastName} onChange={handleInfoInputChange} disabled={isSavingInfo} /></div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" disabled={isSavingInfo} className="bg-blue-600 hover:bg-blue-700">{isSavingInfo ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sauvegarde...</> : "Enregistrer"}</Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                  {/* Password Change Card */}
                  <Card className="shadow-sm">
                    <form onSubmit={handlePasswordSubmit}>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-800">Changer le mot de passe</CardTitle>
                        <CardDescription>Utilisez un mot de passe fort (min. 8 caractères).</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        {passwordFormError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{passwordFormError}</p>}
                        <div><label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label><Input id="oldPassword" name="oldPassword" type="password" placeholder="********" value={passwordData.oldPassword} onChange={handlePasswordInputChange} disabled={isSavingPassword} required /></div>
                        <div><label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label><Input id="newPassword" name="newPassword" type="password" placeholder="Nouveau (min. 8 caractères)" value={passwordData.newPassword} onChange={handlePasswordInputChange} disabled={isSavingPassword} required minLength={8} /></div>
                        <div><label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau</label><Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirmer" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} disabled={isSavingPassword} required /></div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" disabled={isSavingPassword} className="bg-blue-600 hover:bg-blue-700">{isSavingPassword ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mise à jour...</> : "Mettre à jour le mot de passe"}</Button>
                      </CardFooter>
                    </form>
                  </Card>

                  {/* 2FA Placeholder Card */}
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium text-gray-800">Authentification à deux facteurs (2FA)</CardTitle>
                      <CardDescription>Renforcez la sécurité (Fonctionnalité à venir).</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 border rounded-md bg-gray-50">
                        <div className="flex items-center gap-3"><Shield className="h-6 w-6 text-yellow-600" /><div><p className="font-medium text-gray-800">Status 2FA</p><p className="text-sm text-gray-500">Désactivé.</p></div></div>
                        <Button variant="outline" disabled>Configurer 2FA</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
