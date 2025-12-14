import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ModuleAPI } from "@/services/api.service"; // Import ModuleAPI
// Assuming your api.services.ts exports ModuleAPI
 // Corrected import path if needed

interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModuleCreated: () => void;
  formationId: number | undefined; // This is the courseId
}

export const CreateModuleModal = ({
  isOpen,
  onClose,
  onModuleCreated,
  formationId,
}: CreateModuleModalProps) => {
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [moduleOrder, setModuleOrder] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setModuleTitle("");
    setModuleDescription("");
    setModuleOrder("");
    setPdfFile(null);
    setVideoFile(null);
    setError(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formationId) {
      setError("Formation ID is missing. Cannot create module.");
      console.error("Formation ID is missing, cannot create module.");
      return;
    }

    const order = parseInt(moduleOrder, 10);
    if (isNaN(order) || order < 0) {
      setError("Module Order must be a valid non-negative number.");
      return;
    }

    setIsLoading(true);

    try {
      // Use ModuleAPI.create with the correct arguments:
      // 1. courseId (which is formationId)
      // 2. moduleDetails object (title, description, moduleOrder)
      // 3. pdfFile
      // 4. videoFile
      await ModuleAPI.create( // Changed from just createModule
        formationId, // Pass formationId (courseId) as the first argument
        { // This is the Omit<ModuleCreationPayload, 'courseId'> object
          title: moduleTitle,
          description: moduleDescription,
          moduleOrder: order,
          // No courseId here, as it's passed as the first argument to ModuleAPI.create
        },
        pdfFile,
        videoFile
      );

      console.log("Module created successfully");
      resetForm();
      onModuleCreated(); // Notify parent component
      onClose(); // Close the modal

    } catch (err: any) {
      console.error("Error creating module:", err);
      setError(err.message || "An unexpected error occurred while creating the module.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
        </DialogHeader>
        {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Title Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="moduleTitle" className="text-right">
              Title
            </Label>
            <Input
              id="moduleTitle"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              className="col-span-3"
              required
              disabled={isLoading}
            />
          </div>

          {/* Order Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="moduleOrder" className="text-right">
              Order
            </Label>
            <Input
              id="moduleOrder"
              type="number"
              value={moduleOrder}
              onChange={(e) => setModuleOrder(e.target.value)}
              className="col-span-3"
              required
              disabled={isLoading}
              min="0"
            />
          </div>

          {/* Description Textarea */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="moduleDescription" className="text-right">
              Description
            </Label>
            <Textarea
              id="moduleDescription"
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              className="col-span-3"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* PDF File Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pdfFile" className="text-right">
              PDF (Optional)
            </Label>
            <Input
              id="pdfFile"
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setPdfFile(e.target.files ? e.target.files[0] : null)
              }
              className="col-span-3"
              disabled={isLoading}
            />
            {pdfFile && <span className="col-span-3 col-start-2 text-xs text-gray-500">{pdfFile.name}</span>}
          </div>

          {/* Video File Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="videoFile" className="text-right">
              Video (Optional)
            </Label>
            <Input
              id="videoFile"
              type="file"
              accept="video/*"
              onChange={(e) =>
                setVideoFile(e.target.files ? e.target.files[0] : null)
              }
              className="col-span-3"
              disabled={isLoading}
            />
            {videoFile && <span className="col-span-3 col-start-2 text-xs text-gray-500">{videoFile.name}</span>}
          </div>
          
          <DialogFooter className="sm:justify-start pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Module"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
