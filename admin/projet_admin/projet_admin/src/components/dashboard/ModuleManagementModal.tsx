import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogFooter, // Not explicitly used for main actions, but DialogContent implies it
  // DialogClose, // Not explicitly used for main actions
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleAPI } from "@/services/api.service"; // Ensure this path is correct
import { Module as ApiModuleType } from "@/services/api.types"; // Import Module type from api.types.ts
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Edit, Trash2, Save, X, FileText, Video } from "lucide-react";

// Use the Module type imported from api.types.ts for consistency
// If there are slight differences for local state, you can extend or map it.
// For this example, we'll assume ApiModuleType is suitable.
// interface Module { // This local interface can be removed if ApiModuleType is sufficient
//   moduleId: number;
//   title: string;
//   description: string;
//   moduleOrder: number;
//   courseId: number;
//   pdfPath?: string;   // Assuming these might come from backend
//   videoPath?: string; // Assuming these might come from backend
//   pdfFilename?: string; // Add these if your ApiModuleType has them
//   videoFilename?: string;
//   hasPdf?: boolean;
//   hasVideo?: boolean;
// }

interface ModuleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  formationId: number | undefined; // This is the courseId
  formationTitle: string;
}

// State for the module being edited
interface EditingModuleState {
  moduleId: number;
  title: string;
  description: string;
  moduleOrder: string; // Keep as string for input, parse on save
  // courseId is not needed here as it's part of formationId
  pdfFile: File | null; // For new/updated PDF
  videoFile: File | null; // For new/updated video
}

export const ModuleManagementModal = ({
  isOpen,
  onClose,
  formationId,
  formationTitle,
}: ModuleManagementModalProps) => {
  const [modules, setModules] = useState<ApiModuleType[]>([]); // Use imported ApiModuleType
  const [loading, setLoading] = useState(false);
  const [editingModule, setEditingModule] = useState<EditingModuleState | null>(null);
  const [updatingModuleId, setUpdatingModuleId] = useState<number | null>(null); // ID of module being updated
  const [deletingModuleId, setDeletingModuleId] = useState<number | null>(null); // ID of module being deleted
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && formationId !== undefined) {
      loadModules(formationId);
    } else if (!isOpen) {
      // Reset state when modal is closed
      setModules([]);
      setEditingModule(null);
      setUpdatingModuleId(null);
      setDeletingModuleId(null);
    }
  }, [isOpen, formationId]);

  const loadModules = async (currentFormationId: number) => {
    console.log("ModuleManagementModal: Loading modules for formationId:", currentFormationId);
    setLoading(true);
    try {
      const fetchedModules = await ModuleAPI.getAllByCourseId(currentFormationId);
      setModules(fetchedModules || []);
    } catch (error: any) {
      console.error("Error fetching modules:", error);
      toast({
        title: "Error Loading Modules",
        description: error.message || "Failed to load modules for this formation.",
        variant: "destructive",
      });
      setModules([]); // Clear modules on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (module: ApiModuleType) => {
    setEditingModule({
      moduleId: module.moduleId,
      title: module.title,
      description: module.description || "", // Ensure description is a string
      moduleOrder: module.moduleOrder.toString(),
      pdfFile: null,
      videoFile: null,
    });
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
  };

  const handleSaveEdit = async () => {
    if (!editingModule || formationId === undefined) {
      toast({
        title: "Error",
        description: "Cannot save: Missing module data or formation ID.",
        variant: "destructive",
      });
      return;
    }

    const order = parseInt(editingModule.moduleOrder, 10);
    if (isNaN(order) || order < 0) {
      toast({
        title: "Error",
        description: "Module Order must be a valid non-negative number.",
        variant: "destructive",
      });
      return;
    }

    setUpdatingModuleId(editingModule.moduleId);
    try {
      // Pass formationId (courseId) as the FIRST argument to ModuleAPI.update
      await ModuleAPI.update(
        formationId, // courseId
        editingModule.moduleId,
        { // Module details (Omit<ModuleCreationPayload, 'courseId'>)
          title: editingModule.title,
          description: editingModule.description,
          moduleOrder: order,
        },
        editingModule.pdfFile,
        editingModule.videoFile
      );

      toast({
        title: "Success",
        description: `Module "${editingModule.title}" updated successfully.`,
      });

      setEditingModule(null);
      if (formationId !== undefined) {
        await loadModules(formationId); // Refresh the module list
      }
    } catch (error: any) {
      console.error("Error updating module:", error);
      toast({
        title: "Error Updating Module",
        description: error.message || "Failed to update module.",
        variant: "destructive",
      });
    } finally {
      setUpdatingModuleId(null);
    }
  };

  const handleDelete = async (moduleToDelete: ApiModuleType) => {
    if (formationId === undefined) {
      toast({
        title: "Error",
        description: "Cannot delete: Formation ID is missing.",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete module "${moduleToDelete.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingModuleId(moduleToDelete.moduleId);
    try {
      // Pass formationId (courseId) as the FIRST argument to ModuleAPI.delete
      await ModuleAPI.delete(
        formationId, // courseId
        moduleToDelete.moduleId
      );
      toast({
        title: "Success",
        description: `Module "${moduleToDelete.title}" deleted successfully.`,
      });
      if (formationId !== undefined) {
        await loadModules(formationId); // Refresh the module list
      }
    } catch (error: any) {
      console.error("Error deleting module:", error);
      toast({
        title: "Error Deleting Module",
        description: error.message || "Failed to delete module.",
        variant: "destructive",
      });
    } finally {
      setDeletingModuleId(null);
    }
  };

  const handleEditInputChange = (
    field: keyof EditingModuleState,
    value: string | File | null
  ) => {
    if (!editingModule) return;
    setEditingModule(prev => prev ? { ...prev, [field]: value } : null);
  };


  const handleModalClose = () => {
    // This function will be called by Dialog's onOpenChange when it's closed
    // from outside (e.g., overlay click, Esc key)
    setEditingModule(null); // Reset editing state
    onClose(); // Call the original onClose prop
  };


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl sm:text-2xl">Manage Modules for: {formationTitle}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10 text-lg">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            Loading modules...
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No modules found for this formation. You can add new modules using the "Create Module" button on the formation details page.
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.moduleId} className="w-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0"> {/* Added min-w-0 for better truncation handling */}
                      <CardTitle className="text-lg leading-tight">
                        {editingModule?.moduleId === module.moduleId ? (
                          <Input
                            value={editingModule.title}
                            onChange={(e) => handleEditInputChange('title', e.target.value)}
                            className="text-lg font-semibold h-9"
                            disabled={updatingModuleId === module.moduleId}
                            placeholder="Module Title"
                          />
                        ) : (
                          <span className="truncate" title={module.title}>Module {module.moduleOrder}: {module.title}</span>
                        )}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                        {(module.pdfFilename || module.hasPdf) && ( // Check both new and old flags
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            <span>{module.pdfFilename || "PDF"}</span>
                          </div>
                        )}
                        {(module.videoFilename || module.hasVideo) && ( // Check both new and old flags
                          <div className="flex items-center">
                            <Video className="h-3 w-3 mr-1" />
                            <span>{module.videoFilename || "Video"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                      {editingModule?.moduleId === module.moduleId ? (
                        <>
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={updatingModuleId === module.moduleId}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3"
                          >
                            {updatingModuleId === module.moduleId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            <span className="ml-1 hidden sm:inline">Save</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={updatingModuleId === module.moduleId}
                            className="px-2 sm:px-3"
                          >
                            <X className="h-4 w-4" />
                            <span className="ml-1 hidden sm:inline">Cancel</span>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(module)}
                            disabled={editingModule !== null || deletingModuleId === module.moduleId}
                            className="px-2 sm:px-3"
                          >
                            <Edit className="h-4 w-4" />
                             <span className="ml-1 hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(module)}
                            disabled={editingModule !== null || deletingModuleId === module.moduleId}
                            className="px-2 sm:px-3"
                          >
                            {deletingModuleId === module.moduleId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                             <span className="ml-1 hidden sm:inline">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 sm:pt-3">
                  {editingModule?.moduleId === module.moduleId ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`order-${module.moduleId}`} className="text-xs">Module Order</Label>
                        <Input
                          id={`order-${module.moduleId}`}
                          type="number"
                          min="0"
                          value={editingModule.moduleOrder}
                          onChange={(e) => handleEditInputChange('moduleOrder', e.target.value)}
                          disabled={updatingModuleId === module.moduleId}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`desc-${module.moduleId}`} className="text-xs">Description</Label>
                        <Textarea
                          id={`desc-${module.moduleId}`}
                          value={editingModule.description}
                          onChange={(e) => handleEditInputChange('description', e.target.value)}
                          rows={3}
                          disabled={updatingModuleId === module.moduleId}
                          placeholder="Module description..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`pdf-${module.moduleId}`} className="text-xs">Update PDF (Optional)</Label>
                          <Input
                            id={`pdf-${module.moduleId}`}
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleEditInputChange('pdfFile', e.target.files?.[0] || null)}
                            disabled={updatingModuleId === module.moduleId}
                            className="h-9 text-xs"
                          />
                           {editingModule.pdfFile && <p className="text-xs mt-1 text-gray-500 truncate">{editingModule.pdfFile.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor={`video-${module.moduleId}`} className="text-xs">Update Video (Optional)</Label>
                          <Input
                            id={`video-${module.moduleId}`}
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleEditInputChange('videoFile', e.target.files?.[0] || null)}
                            disabled={updatingModuleId === module.moduleId}
                            className="h-9 text-xs"
                          />
                          {editingModule.videoFile && <p className="text-xs mt-1 text-gray-500 truncate">{editingModule.videoFile.name}</p>}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{module.description || "No description provided."}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="pt-6 flex justify-end sticky bottom-0 bg-white dark:bg-slate-900 pb-1 -mb-1"> {/* Made footer sticky for scroll */}
          <Button onClick={handleModalClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};