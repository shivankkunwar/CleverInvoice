import { useState } from "react";
import { GiBrain } from "react-icons/gi";
import { Menu, X } from "lucide-react";
import classnames from "classnames";
import FileUpload from "./FileUpload";
import DatasetManager from "./DatasetManager"; // Import DatasetManager
import { addInvoices } from "@/redux/slices/invoicesSlice";
import { addProducts } from "@/redux/slices/productsSlice";
import { addCustomers } from "@/redux/slices/customersSlice";
import { extractDataFromFile } from "../utils/genAI";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { RootState } from "@/redux/store"; // Import RootState
import { useToast } from "@/hooks/use-toast";

const Sidebar = ({ activeTab, setActiveTab }:any) => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const activeDatasetName = useSelector((state: RootState) => state.ui.activeDatasetName); // Get activeDatasetName
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: any) => {
    if (!activeDatasetName) {
      toast({
        title: "No Active Dataset",
        description: "Please select or create a dataset before uploading a file.",
        variant: "warning",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await extractDataFromFile(file);
      console.log(data);
      // Pass datasetName to addInvoices
      if (data?.invoices && data.invoices.length > 0) {
        dispatch(addInvoices({ datasetName: activeDatasetName, invoices: data.invoices }));
      }
      // Products and Customers are not dataset-specific in this model, but if they were, you'd adapt here.
      if (data?.products && data.products.length > 0) {
        dispatch(addProducts(data.products));
      }
      if (data?.customers && data.customers.length > 0) {
        dispatch(addCustomers(data.customers));
      }
      toast({
        title: "Success",
        description: `Data extracted and added to dataset "${activeDatasetName}".`,
      });
    } catch (error) {
      console.error("Error extracting data:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while processing the file. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Invoices", tab: "invoices" },
    { name: "Products", tab: "products" },
    { name: "Customers", tab: "customers" },
  ];

  return (
    <>
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GiBrain className="text-2xl text-blue-500" />
          <h1 className="text-lg font-bold">Clever Invoice</h1>
        </div>
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <aside
        className={classnames(
          "bg-gray-900 text-white flex flex-col h-screen w-64 fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out transform",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
          },
          "md:translate-x-0 md:static"
        )}
      >
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-700 md:border-none">
          <GiBrain className="text-3xl text-blue-500" />
          <h1 className="text-xl font-bold">Clever Invoice</h1>
        </div>

        {/* Add DatasetManager here */}
        <div className="px-2 py-2 border-b border-gray-700">
          <DatasetManager />
        </div>

        <div className="px-6 py-4 border-b border-gray-700">
          <FileUpload onUpload={handleFileUpload} loading={loading} disabled={!activeDatasetName || loading} />
        </div>

        <nav className="flex-grow px-6 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.tab}>
                <button
                  className={classnames(
                    "w-full text-left py-2 px-4 rounded-lg transition-colors",
                    activeTab === item.tab
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  )}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setIsOpen(false);
                  }}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="px-6 py-4 border-t border-gray-700 text-sm text-gray-400">
          <p>
            Made with <span className="text-red-500">❤️</span> by{" "}
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
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
