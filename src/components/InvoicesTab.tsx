import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { selectInvoices } from "@/redux/selectors";

const InvoicesTab: React.FC = () => {
  const invoices = useSelector(selectInvoices);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  {
    console.log(invoices);
  }
  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hidden md:table-row">
                  <TableCell className="font-medium">Serial Number</TableCell>
                  <TableCell className="font-medium">Customer Name</TableCell>
                  <TableCell className="font-medium">Product Name</TableCell>
                  <TableCell className="font-medium text-center">
                    Quantity
                  </TableCell>
                  <TableCell className="font-medium text-center">Tax</TableCell>
                  <TableCell className="font-medium text-right">
                    Total Amount
                  </TableCell>
                  <TableCell className="font-medium">Date</TableCell>
                  <TableCell className="font-medium">Status</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invoices.map((invoice) => (
                  <React.Fragment key={invoice.id}>
                    <TableRow
                      className="md:hidden"
                      onClick={() => toggleExpand(invoice.id)}
                    >
                      <TableCell colSpan={2}>
                        <div className="flex justify-between items-center">
                          <span>{invoice.serialNumber}</span>
                          {expandedId === invoice.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      className={`md:table-row ${
                        expandedId === invoice.id ? "table-row" : "hidden"
                      }`}
                    >
                      <TableCell className="md:hidden" colSpan={2}>
                        Customer: {invoice?.customerName}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Product: {invoice?.productName}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Quantity: {invoice?.quantity}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Tax: {invoice?.tax}%
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Total: ${invoice?.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Date: {invoice?.date}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Status: {invoice?.status}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hidden md:table-row">
                      <TableCell>{invoice?.serialNumber}</TableCell>
                      <TableCell>{invoice?.customerName}</TableCell>
                      <TableCell>{invoice?.productName}</TableCell>
                      <TableCell className="text-center">
                        {invoice?.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        {invoice?.tax}%
                      </TableCell>
                      <TableCell className="text-right">
                        ${invoice?.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{invoice?.date}</TableCell>
                      <TableCell>{invoice?.status}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvoicesTab;
