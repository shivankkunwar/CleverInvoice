import { Loader2 } from "lucide-react";
import { FaCloudUploadAlt } from "react-icons/fa";

const FileUpload = ({ onUpload, loading } : any) => {
  const handleFileChange = (event:any) => {
    onUpload(event.target.files[0]);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6 flex justify-center items-center mb-8">
      <label htmlFor="file-upload" className="cursor-pointer flex items-center">
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
              Upload Invoice
            </span>
          </>
        )}{" "}
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        disabled={loading}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
