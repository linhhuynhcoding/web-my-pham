import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "@/api/admin";
import { UploadFileRequest } from "@/api/types";

/**
 * Custom hook to provide a mutation for uploading a file.
 * @returns The result of the react-query useMutation hook.
 */
export const useUploadFile = () => {
  return useMutation({
    mutationFn: (data: UploadFileRequest) => uploadFile(data),
    // onSuccess can be used here to handle successful uploads,
    // e.g., invalidating queries or showing a notification.
    onSuccess: (data) => {
      console.log("File uploaded successfully:", data);
    },
  });
};