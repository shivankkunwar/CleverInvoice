import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { GiBrain } from "react-icons/gi";
import { FiUploadCloud, FiGithub, FiBookOpen } from "react-icons/fi";

import { addInvoices } from "@/redux/slices/invoicesSlice.ts";
import { addProducts } from "@/redux/slices/productsSlice";
import { addCustomers } from "@/redux/slices/customersSlice";
import { extractDataFromFile } from "@/utils/genAI";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await extractDataFromFile(file);
      dispatch(addInvoices(data?.invoices));
      dispatch(addProducts(data?.products));
      dispatch(addCustomers(data?.customers));
      navigate("/dashboard");
    } catch (error) {
      console.error("Error extracting data:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while processing the file. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <nav className="absolute top-0 left-0 right-0 flex justify-between p-4 bg-gray-800 bg-opacity-75 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-4">
          <GiBrain className="text-3xl text-blue-500" />
          <span className="text-xl font-bold">Clever Invoice</span>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-slate-950 p-5 border-white/20 hover:bg-white/10"
          >
            <FiGithub className="mr-2" />
            GitHub
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-slate-950 p-5 border-white/20 hover:bg-white/10"
          >
            <FiBookOpen className="mr-2" />
            Docs
          </Button>
        </div>
      </nav>
      <nav className="absolute top-0 left-0 right-0 flex justify-between p-4 bg-gray-800   z-10">
        <div className="flex items-center space-x-2">
          <GiBrain className="text-2xl text-blue-500" />
          <span className="text-xl font-bold">Clever Invoice</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-slate-950 p-5 border-white/20 hover:bg-white/10 hover:text-white"
          >
            <FiGithub className="mr-2" />
            GitHub
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-white bg-slate-950 p-5 border-white/20 hover:bg-white/10 hover:text-white"
          >
            <FiBookOpen className="mr-2" />
            Docs
          </Button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between space-y-12 lg:space-y-0 lg:space-x-12 z-10">
        <div className="text-center lg:text-left lg:w-1/2">
          <motion.h1
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Clever Invoice
          </motion.h1>
          <motion.p
            className="text-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            AI-Powered Invoice Management
          </motion.p>
          <motion.ul
            className="text-sm text-gray-300 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <li>✓ Automated data extraction</li>
            <li>✓ Intelligent categorization</li>
            <li>✓ Real-time insights</li>
            <li>✓ Seamless integration</li>
          </motion.ul>
        </div>

        <div className="lg:w-1/2">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="mb-6">
              Upload your invoice and let our AI do the rest.
            </p>
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white/5 border-2 border-gray-300 border-dashed rounded-md appearance-none hover:border-gray-400 focus:outline-none">
                {isUploading ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="w-6 h-6 text-gray-300 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <FiUploadCloud className="w-6 h-6 text-gray-300" />
                    <span>Browse files to upload</span>
                  </span>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
              />
            </label>
          </motion.div>
          <footer className="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">
            <p>
              From concept to code ⚔️ by{" "}
              <a
                href="https://portfolio-shivank.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Shivank
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
