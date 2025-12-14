// src/components/formations/FormationModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CourseDetailResponseDTO as CourseDetail,
  Role,
  InstructorListDTO,
  CourseMode,
  SimpleInstructorDTO,
} from "@/services/api.types";
import { InstructorAPI } from "@/services/api.service";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { CourseAPI } from "@/services/api.service";
import { useToast } from "@/components/ui/use-toast";
import { CreateModuleModal } from "./CreateModuleModal";
import { ModuleManagementModal } from "./ModuleManagementModal";

interface FormationModalProps {
  formation: CourseDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    formationData: Partial<Omit<CourseDetail, 'duration' | 'courseId' > & { courseId?: number, durationHours?: number | null }> & { imageFile?: File | null }
  ) => void;
}

interface InstructorOption {
  id: number;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface FormStateValues {
  courseId?: number;
  title: string;
  description: string;
  price: number;
  category?: string;
  instructorsData: InstructorOption[];
  mode?: CourseMode;
  level: string;
  startDate: string;
  durationHours?: number | null;
  location: string;
  certificationEligible?: boolean;
}

export const FormationModal = ({
  formation,
  isOpen,
  onClose,
  onSave,
}: FormationModalProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role?.includes(Role.ADMIN);
  const isInstructorRole = user?.role?.includes(Role.INSTRUCTOR);

  const initialFormState: FormStateValues = {
    title: "",
    description: "",
    price: 0,
    category: undefined,
    instructorsData: [],
    mode: undefined,
    level: "",
    startDate: "",
    durationHours: undefined,
    location: "",
    certificationEligible: false,
  };

  const [formValues, setFormValues] = useState<FormStateValues>(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories] = useState<CategoryOption[]>([
    { id: "Technology", name: "Technology" },
    { id: "Business", name: "Business" },
    { id: "Arts", name: "Arts" },
  ].filter(cat => cat.id.trim() !== ""));

  const [allInstructorOptions, setAllInstructorOptions] = useState<InstructorOption[]>([]);
  const [rawInstructorData, setRawInstructorData] = useState<InstructorListDTO[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState<boolean>(false);
  const { toast } = useToast();
  const [isCreateModuleModalOpen, setIsCreateModuleModalOpen] = useState(false);
  const [isModuleManagementModalOpen, setIsModuleManagementModalOpen] = useState(false);

  useEffect(() => {
    const loadInstructorData = async () => {
      if (!isOpen || (!isAdmin && !isInstructorRole)) {
        setAllInstructorOptions([]);
        setRawInstructorData([]);
        setLoadingInstructors(false);
        return;
      }
      setLoadingInstructors(true);
      try {
        const response = await InstructorAPI.getAllInstructorsForList();
        const fetchedRawData: InstructorListDTO[] = response.data || [];
        setRawInstructorData(fetchedRawData);
        const validOptions = fetchedRawData
          .filter((dto): dto is InstructorListDTO =>
            dto && typeof dto.id === 'number' && typeof dto.name === 'string' && dto.name.trim() !== ""
          )
          .map((dto) => ({ id: dto.id, name: dto.name }));
        setAllInstructorOptions(validOptions);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setAllInstructorOptions([]);
        setRawInstructorData([]);
      } finally {
        setLoadingInstructors(false);
      }
    };
    if (isOpen) loadInstructorData();
  }, [isOpen, user, isAdmin, isInstructorRole]);

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null);
      return;
    }

    if (formation) {
      let hours: number | undefined = undefined;
      if (formation.duration) {
        const match = formation.duration.match(/(\d+)\s*hours?/i);
        if (match && match[1]) {
          hours = parseInt(match[1], 10);
        }
      } else if ((formation as any).durationHours !== undefined) {
          hours = (formation as any).durationHours;
      }

      setFormValues({
        courseId: formation.courseId,
        title: formation.title ?? "",
        description: formation.description ?? "",
        price: formation.price ?? 0,
        category: formation.category ?? undefined,
        instructorsData: formation.instructors?.map((inst: SimpleInstructorDTO) => ({
          id: inst.instructorId,
          name: inst.fullName,
        })) || [],
        mode: formation.mode as CourseMode ?? undefined,
        level: formation.level ?? "",
        startDate: formation.startDate ? formation.startDate.split('T')[0] : "",
        durationHours: hours,
        location: formation.location ?? "",
        certificationEligible: formation.certificationEligible ?? false,
      });
      setImageFile(null);
    } else {
      let initialInstructors: InstructorOption[] = [];
      if (isInstructorRole && !isAdmin && user?.userId && rawInstructorData.length > 0) {
        const selfAsInstructorDTO = rawInstructorData.find(dto => dto.userId === user.userId);
        if (selfAsInstructorDTO?.id != null && selfAsInstructorDTO.name != null) {
          initialInstructors = [{ id: selfAsInstructorDTO.id, name: selfAsInstructorDTO.name }];
        }
      }
      setFormValues({...initialFormState, instructorsData: initialInstructors});
      setImageFile(null);
    }
  }, [formation, isOpen, isInstructorRole, isAdmin, user?.userId, rawInstructorData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setImageFile(files && files.length > 0 ? files[0] : null);
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: (name === "price" || name === "durationHours")
                  ? (value === "" ? undefined : parseFloat(value) || (name === "price" ? 0 : undefined))
                  : value,
      }));
    }
  };

  const handleFormSelectChange = (
    fieldName: keyof FormStateValues,
    value: string | number | undefined | CourseMode | boolean
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value === "" ? undefined : value,
    }));
  };

  const handleAdminInstructorSelectChange = (value: string | undefined) => {
    if (value === undefined || value === "") {
      setFormValues((prev) => ({ ...prev, instructorsData: [] }));
      return;
    }
    const instructorIdNum = parseInt(value, 10);
    if (isNaN(instructorIdNum)) return;
    const selectedOption = allInstructorOptions.find((opt) => opt.id === instructorIdNum);
    setFormValues((prev) => ({
      ...prev,
      instructorsData: selectedOption ? [selectedOption] : [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToPassToParent = {
      courseId: formValues.courseId,
      title: formValues.title,
      description: formValues.description,
      price: formValues.price,
      category: formValues.category,
      mode: formValues.mode,
      level: formValues.level,
      startDate: formValues.startDate,
      durationHours: formValues.durationHours,
      location: formValues.location,
      certificationEligible: formValues.certificationEligible,
      instructors: formValues.instructorsData?.map(opt => ({
        instructorId: opt.id,
        fullName: opt.name,
        instructorRating: undefined,
      })) as SimpleInstructorDTO[],
      imageFile: imageFile,
    };
    
    const cleanedData = Object.fromEntries(
        Object.entries(dataToPassToParent).filter(([_, v]) => v !== undefined)
    );

    onSave(cleanedData as any);
  };

  const handleDeleteFormation = async () => {
    if (!formation?.courseId) {
      toast({
        title: "Error",
        description: "Cannot delete formation: ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      await CourseAPI.delete(formation.courseId);
      toast({
        title: "Success",
        description: "Formation deleted successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Error deleting formation:", error);
      toast({
        title: "Error",
        description: "Failed to delete formation.",
        variant: "destructive",
      });
    }
  };

  const handleCreateModule = () => {
    if (!formation?.courseId) {
       console.error("Cannot create module: Formation ID is missing.");
       toast({
        title: "Error",
        description: "Cannot create module: Formation ID is missing.",
        variant: "destructive",
      });
      return;
    }
    setIsCreateModuleModalOpen(true);
  };

  const handleViewModules = () => {
    if (!formation?.courseId) {
       console.error("Cannot view modules: Formation ID is missing.");
       toast({
        title: "Error",
        description: "Cannot view modules: Formation ID is missing.",
        variant: "destructive",
      });
      return;
    }
    setIsModuleManagementModalOpen(true);
  };

  const handleModuleCreated = () => {
    console.log("Module created, refreshing list (placeholder)");
  };

  const handleCloseCreateModuleModal = () => {
    setIsCreateModuleModalOpen(false);
  };

  const handleCloseModuleManagementModal = () => {
    setIsModuleManagementModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle>{formation ? "Edit Formation" : "Create New Formation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div><Label htmlFor="title">Title</Label><Input id="title" name="title" value={formValues.title} onChange={handleInputChange} required /></div>
          <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formValues.description} onChange={handleInputChange} required /></div>
          <div><Label htmlFor="price">Price ($)</Label><Input id="price" name="price" type="number" min="0" step="0.01" value={formValues.price} onChange={handleInputChange} required /></div>
          <div><Label htmlFor="category">Category</Label><Select onValueChange={(val) => handleFormSelectChange("category", val)} value={formValues.category ?? ""}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label htmlFor="mode">Mode</Label><Select onValueChange={(val) => handleFormSelectChange("mode", val as CourseMode)} value={formValues.mode ?? ""}><SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger><SelectContent>{Object.values(CourseMode).map(mVal => <SelectItem key={mVal} value={mVal}>{mVal.replace(/_/g, ' ')}</SelectItem>)}</SelectContent></Select></div>
          <div><Label htmlFor="level">Level</Label><Input id="level" name="level" value={formValues.level} onChange={handleInputChange} /></div>
          <div><Label htmlFor="startDate">Start Date</Label><Input id="startDate" name="startDate" type="date" value={formValues.startDate} onChange={handleInputChange} /></div>
          <div>
            <Label htmlFor="durationHours">Duration (Hours)</Label>
            <Input id="durationHours" name="durationHours" type="number" min="0" step="1" value={formValues.durationHours ?? ""} onChange={handleInputChange} placeholder="e.g., 40" />
          </div>
          <div><Label htmlFor="location">Location</Label><Input id="location" name="location" value={formValues.location} onChange={handleInputChange} /></div>
          <div><Label htmlFor="imageFile">Course Image</Label><Input id="imageFile" name="imageFile" type="file" accept="image/*" onChange={handleInputChange} /></div>
          {isAdmin && (
            <div>
              <Label htmlFor="adminInstructorSelect">Instructor</Label>
              <Select onValueChange={handleAdminInstructorSelectChange} value={formValues.instructorsData?.[0]?.id.toString() ?? ""} disabled={loadingInstructors}>
                <SelectTrigger id="adminInstructorSelect"><SelectValue placeholder={loadingInstructors ? "Loading..." : "Select an instructor"} /></SelectTrigger>
                <SelectContent>{allInstructorOptions.map((inst) => (<SelectItem key={inst.id} value={inst.id.toString()}>{inst.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
          )}
          {isInstructorRole && !isAdmin && formValues.instructorsData.length > 0 && (
            <div>
              <Label>Instructor</Label>
              <Input value={formValues.instructorsData[0]?.name ?? (loadingInstructors ? "Loading..." : "N/A")} disabled readOnly />
            </div>
          )}
          <div className="pt-4 flex flex-col space-y-2">
            {formation && (
              <>
                <Button
                  type="button"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={handleViewModules}
                >
                  View & Manage Modules
                </Button>
                <Button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCreateModule}
                >
                  Create Module
                </Button>
                <Button
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteFormation}
                >
                  Delete Formation
                </Button>
              </>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loadingInstructors}>
              {loadingInstructors ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" /> : null}
              {loadingInstructors ? "Saving..." : (formation ? "Update Formation" : "Create Formation")}
            </Button>
          </div>
        </form>
      </DialogContent>
      
      <CreateModuleModal
        isOpen={isCreateModuleModalOpen}
        onClose={handleCloseCreateModuleModal}
        onModuleCreated={handleModuleCreated}
        formationId={formation?.courseId}
      />
      
      <ModuleManagementModal
        isOpen={isModuleManagementModalOpen}
        onClose={handleCloseModuleManagementModal}
        formationId={formation?.courseId}
        formationTitle={formation?.title || "Unknown Formation"}
      />
    </Dialog>
  );
};