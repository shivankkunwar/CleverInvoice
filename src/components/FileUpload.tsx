import { Loader2 } from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";

interface FileUploadProps {
  onUpload: (file: File) => void;
  loading: boolean;
  disabled?: boolean; // Added disabled prop
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, loading, disabled }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUpload(event.target.files[0]);
    }
  };

  const isDisabled = loading || disabled; // Combine loading and disabled

  return (
    <div className={`bg-white shadow-md rounded-md p-6 flex justify-center items-center mb-8 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <label htmlFor="file-upload" className={`flex items-center ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
        {loading ? (
          <>
            <Loader2 className="text-primary mr-4 text-4xl animate-spin" />
            <span className="text-black font-medium whitespace-nowrap">
              Processing...
            </span>
          </>
        ) : (
          <>
            <FaCloudUploadAlt className="text-primary mr-4 text-4xl" />
            <span className="text-black font-medium whitespace-nowrap">
              {disabled ? "Select a dataset first" : "Upload Invoice"}
            </span>
          </>
        )}{" "}
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        disabled={isDisabled} // Use combined isDisabled
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
