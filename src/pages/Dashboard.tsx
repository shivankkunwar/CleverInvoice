import { useState } from "react";

import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import InvoicesTab from "../components/InvoicesTab";
import ProductsTab from "../components/ProductsTab";
import CustomersTab from "../components/CustomersTab";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("invoices");

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen text-white overflow-hidden">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <motion.div
        className="flex-1 p-4 md:p-8 overflow-auto mt-16 md:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === "invoices" && <InvoicesTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "customers" && <CustomersTab />}
      </motion.div>
    </div>
  );
};

export default Dashboard;
