import * as XLSX from "xlsx";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractDataFromFile(file:any) {
  const prompt = `Analyze this document and extract all information, organizing it into three distinct sections: Invoices, Products, and Customers. Parse all entries and maintain relationships between them. Provide the data in the following structured JSON format:

{
  "invoices": [
    {
      "id":"" //random unique id,
      "serialNumber": "",
      "customerName": "",
      "productName": "",
      "quantity": 0,
      "tax": 0, // return % if percentage is extract or check if unit like $, Rs., is there
      "totalAmount": 0, // amount paid including taxes
      "date": "",
      "status": "complete" // or "missing_fields" if any required field is empty
    }
  ],
  "products": [
    {"id":"" //random unique id,
      "name": "",
      "totalQuantity": 0, // Sum of quantities across all invoices
      "unitPrice": 0, // Calculate the total amount/price of the item that was before tax percentage and after discount
      "tax": 0, // if specific "Tax" column doesnt exist look of GST or IGST %
      "priceWithTax": 0,
      "discount":0(0%), // check of discount in the base price return with % or Rs, $ sign,
      "status": "complete" // or "missing_fields" if any required field is empty
    }
  ],
  "customers": [
    {"id":"" //random unique id,
      "name": "",
      "phoneNumber": "",
      "companyName": "",
      "totalPurchaseAmount": 0, // Sum of all invoice amounts for this customer
      "status": "complete" // or "missing_fields" if any required field is empty
    }
  ],
  "metadata": {
  "id":"" //random unique id,
    "totalInvoices": 0,
    "totalProducts": 0,
    "totalCustomers": 0,
    "missingFields": [
      {
        "type": "invoice|product|customer",
        "id": "",
        "fields": ["field1", "field2"]
      }
    ]
  }
}

Important Instructions:
1. Group all entries by products and customers to avoid duplicates
2. Calculate aggregated values like totalQuantity and totalPurchaseAmount
3. Identify and mark any missing required fields
4. Maintain relationships between invoices, products, and customers
5. For Excel files, process all rows and aggregate data accordingly
6. For PDFs/Images, extract all visible invoices and their details
7. Handle multiple entries in a single file
8. Calculate unit prices from price with tax and tax percentage
9. Ensure all amounts are in numerical format
10. Mark status as "missing_fields" if any required field is empty or cannot be extracted

Required Fields:
- Invoices: serialNumber, customerName, productName, quantity, tax, totalAmount, date
- Products: name, totalQuantity, unitPrice, tax, priceWithTax
- Customers: name, phoneNumber, companyName, totalPurchaseAmount`;
  try {
    const genAI = new GoogleGenerativeAI(
      import.meta.env.VITE_GEMINI_KEY
    );
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let content: string;
    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      content = await extractExcelContent(file);
    } else {
      content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const result = await model.generateContent([
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ? { text: `Excel file content:\n${content}` }
        : {
            inlineData: {
              data: content,
              mimeType: file.type,
            },
          },
      { text: prompt },
    ]);

    const parsedResult = cleanAndParseJSON(result.response.text());
    return {
      invoices: parsedResult.invoices,
      products: parsedResult.products,
      customers: parsedResult.customers,
    };
  } catch (error) {
    console.error("Error processing file:", error);
    
  }
}

const extractExcelContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      let content = "";
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        content += `Sheet: ${sheetName}\n`;
        content += XLSX.utils.sheet_to_csv(worksheet) + "\n\n";
      });
      resolve(content);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

function cleanAndParseJSON(response: any) {
  // First check if the response is already a JSON string
  try {
    return JSON.parse(response);
  } catch (e) {
    // Not a direct JSON string, continue with extraction
  }

  // Try to extract JSON from a response object with 'text' property
  try {
    if (typeof response === 'object' && response.text) {
      response = response.text;
    }
  } catch (e) {
    // Response is not an object with text property, continue with string processing
  }

  // Convert response to string if it isn't already
  const responseStr = String(response);

  // Regular expression to match JSON content within markdown code blocks
  // This handles both ```json and ``` markers
  const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
  
  // Try to extract JSON from markdown code blocks
  const match = responseStr.match(jsonRegex);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e:any) {
      throw new Error('Found JSON-like content in markdown but failed to parse: ' + e.message);
    }
  }

  // If we couldn't find markdown-wrapped JSON, try to find any JSON-like content
  const jsonContentRegex = /\{[\s\S]*\}/;
  const jsonMatch = responseStr.match(jsonContentRegex);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e:any) {
      throw new Error('Found JSON-like content but failed to parse: ' + e.message);
    }
  }

  throw new Error('No valid JSON content found in the response');
}
