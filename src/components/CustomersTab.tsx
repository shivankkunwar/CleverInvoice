import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHeader,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Pencil, Save, ChevronDown, ChevronUp } from "lucide-react";
import { updateCustomer } from "@/redux/slices/customersSlice";
import { updateInvoicesForCustomer } from "@/redux/slices/invoicesSlice";
import { selectCustomers } from "@/redux/selectors";

const CustomersTab: React.FC = () => {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedCustomer, setEditedCustomer] = useState<any | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (customer: any) => {
    setEditingId(customer.id);
    setEditedCustomer({ ...customer });
  };

  const handleSave = () => {
    if (editedCustomer) {
      dispatch(updateCustomer(editedCustomer));
      if (
        editedCustomer.name !==
        customers.find((c) => c.id === editedCustomer.id)?.name
      ) {
        dispatch(
          updateInvoicesForCustomer({
            name: customers.find((c) => c.id === editedCustomer.id)?.name || "",
            updates: { customerName: editedCustomer.name },
          })
        );
      }
      setEditingId(null);
      setEditedCustomer(null);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    if (editedCustomer) {
      setEditedCustomer({ ...editedCustomer, [field]: value });
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hidden md:table-row">
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell className="font-medium">Phone Number</TableCell>
                  <TableCell className="font-medium">Company Name</TableCell>
                  <TableCell className="font-medium text-right">
                    Total Purchase Amount
                  </TableCell>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className="font-medium">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <React.Fragment key={customer.id}>
                    <TableRow
                      className="md:hidden"
                      onClick={() => toggleExpand(customer.id)}
                    >
                      <TableCell colSpan={2}>
                        <div className="flex justify-between items-center">
                          <span>{customer.name}</span>
                          {expandedId === customer.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      className={`md:table-row ${
                        expandedId === customer.id ? "table-row" : "hidden"
                      }`}
                    >
                      <TableCell className="md:hidden" colSpan={2}>
                        Phone: {customer?.phoneNumber}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Company: {customer?.companyName || "N/A"}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Total Purchase: $
                        {customer?.totalPurchaseAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Status: {customer?.status}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        {editingId === customer.id ? (
                          <Button
                            onClick={handleSave}
                            size="sm"
                            className="w-full"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEdit(customer)}
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hidden md:table-row">
                      <TableCell>
                        {editingId === customer.id ? (
                          <Input
                            value={editedCustomer?.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            className="w-full"
                          />
                        ) : (
                          customer.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === customer.id ? (
                          <Input
                            value={editedCustomer?.phoneNumber}
                            onChange={(e) =>
                              handleChange("phoneNumber", e.target.value)
                            }
                            className="w-full"
                          />
                        ) : (
                          customer.phoneNumber
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === customer.id ? (
                          <Input
                            value={editedCustomer?.companyName || ""}
                            onChange={(e) =>
                              handleChange("companyName", e.target.value)
                            }
                            className="w-full"
                          />
                        ) : (
                          customer.companyName || "N/A"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        ${customer.totalPurchaseAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{customer.status}</TableCell>
                      <TableCell>
                        {editingId === customer.id ? (
                          <Button
                            onClick={handleSave}
                            size="sm"
                            className="w-full"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleEdit(customer)}
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </TableCell>
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

export default CustomersTab;
