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
import { updateProduct } from "@/redux/slices/productsSlice";
// Removed: import { updateInvoicesForProduct } from "@/redux/slices/invoicesSlice";
import { updateInvoice, Invoice } from "@/redux/slices/invoicesSlice"; // Added updateInvoice and Invoice type
import { selectProducts, selectInvoices } from "@/redux/selectors"; // Added selectInvoices
import { RootState } from "@/redux/store"; // Added RootState for activeDatasetName
import { useToast } from "@/hooks/use-toast"; // Added useToast

const ProductsTab: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const products = useSelector(selectProducts);
  const activeDatasetName = useSelector((state: RootState) => state.ui.activeDatasetName);
  // Memoize invoices for the active dataset to prevent unnecessary re-renders if selector logic is complex
  const invoicesForCurrentDataset = useSelector((state: RootState) =>
    activeDatasetName ? selectInvoices(state, activeDatasetName) : []
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<any | null>(null); // Consider using a proper type for product
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = () => {
    if (editedProduct) {
      const originalProduct = products.find((p) => p.id === editedProduct.id);
      const originalProductName = originalProduct?.name;

      dispatch(updateProduct(editedProduct)); // Update the product itself

      if (activeDatasetName && originalProductName && editedProduct.name !== originalProductName) {
        if (invoicesForCurrentDataset.length > 0) {
          let updatedInvoicesCount = 0;
          invoicesForCurrentDataset.forEach((invoice: Invoice) => {
            if (invoice.productName === originalProductName) {
              dispatch(
                updateInvoice({
                  datasetName: activeDatasetName,
                  id: invoice.id,
                  updates: { productName: editedProduct.name },
                })
              );
              updatedInvoicesCount++;
            }
          });
          if (updatedInvoicesCount > 0) {
            toast({
              title: "Invoices Updated",
              description: `${updatedInvoicesCount} invoice(s) in dataset '${activeDatasetName}' updated with new product name.`,
            });
          }
        }
      } else if (!activeDatasetName && originalProductName && editedProduct.name !== originalProductName) {
        toast({
          title: "Product Name Changed",
          description: "Product name updated, but no active dataset selected to update associated invoices.",
          variant: "destructive",
        });
      }

      toast({
        title: "Product Saved",
        description: `Product "${editedProduct.name}" has been saved.`,
      });
      setEditingId(null);
      setEditedProduct(null);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    if (editedProduct) {
      setEditedProduct({ ...editedProduct, [field]: value });
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
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hidden md:table-row">
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell className="font-medium text-center">
                    Total Quantity
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    Unit Price
                  </TableCell>
                  <TableCell className="font-medium text-right">
                    Discount
                  </TableCell>
                  <TableCell className="font-medium text-center">Tax</TableCell>
                  <TableCell className="font-medium text-right">
                    Price with Tax
                  </TableCell>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell className="font-medium">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <React.Fragment key={product.id}>
                    <TableRow
                      className="md:hidden"
                      onClick={() => toggleExpand(product.id)}
                    >
                      <TableCell colSpan={2}>
                        <div className="flex justify-between items-center">
                          <span>{product?.name}</span>
                          {expandedId === product.id ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      className={`md:table-row ${
                        expandedId === product.id ? "table-row" : "hidden"
                      }`}
                    >
                      <TableCell className="md:hidden" colSpan={2}>
                        Total Quantity: {product?.totalQuantity}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Unit Price: ${product?.unitPrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Discount: {product?.discount}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Tax: {product?.tax}%
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Price with Tax: ${product?.priceWithTax.toFixed(2)}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        Status: {product?.status}
                      </TableCell>
                      <TableCell className="md:hidden" colSpan={2}>
                        {editingId === product.id ? (
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
                            onClick={() => handleEdit(product)}
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
                        {editingId === product.id ? (
                          <Input
                            value={editedProduct?.name}
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            className="w-full"
                          />
                        ) : (
                          product.name
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.totalQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId === product.id ? (
                          <Input
                            type="number"
                            value={editedProduct?.unitPrice}
                            onChange={(e) =>
                              handleChange(
                                "unitPrice",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full text-right"
                          />
                        ) : (
                          `$${product.unitPrice.toFixed(2)}`
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.discount}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.tax + "%"}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.priceWithTax.toFixed(2)}
                      </TableCell>
                      <TableCell>{product.status}</TableCell>
                      <TableCell>
                        {editingId === product.id ? (
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
                            onClick={() => handleEdit(product)}
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

export default ProductsTab;
