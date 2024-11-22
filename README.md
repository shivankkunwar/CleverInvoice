# Clever Invoice : AI-Powered Invoice Management

Your go-to solution for effortless invoice extraction and organization powered by generative AI




https://github.com/user-attachments/assets/fe88412b-ff09-4b75-b39a-85525c7bae2c

## Features

### AI-Powered Data Extraction
- Automated extraction of invoice data using Google's Gemini AI
- Support for multiple file formats (PDF, Excel, Images)
- Intelligent parsing of customer details, product information, and invoice metadata
- Real-time validation and error detection

### Interactive Dashboard
- Modern, responsive interface built with React.js, shadCN and Tailwind CSS
- Real-time data synchronization across all components
- Mobile-first design with collapsible tables and adaptive layouts
- Professional loading animations and transitions

### Data Management
- Centralized state management using Redux Toolkit
- Automatic updates across interconnected data (Invoices, Products, Customers)
- Edit capabilities in Products and Customers tabs
- Real-time reflection of changes in the Invoices view

## Technical Implementation

### Frontend Architecture
```typescript
// Component Structure
├── pages/
│   ├── LandingPage.tsx         # Landing page
│   └── dashboard.tsx     # Dashboard page
├── components/
│   ├── LandingPage.tsx   # File upload and processing
│   ├── Dashboard.tsx     # Main application layout
│   ├── InvoicesTab.tsx   # Read-only invoice display
│   ├── ProductsTab.tsx   # Product management
│   └── CustomersTab.tsx  # Customer management
├── redux/
│   ├── store.ts          # Redux store configuration
│   ├── slices/
│   │   ├── invoicesSlice.ts
│   │   ├── productsSlice.ts
│   │   └── customersSlice.ts
│   └── selectors.ts      # Memoized selectors
└── utils/
└── genAi.ts   # AI data extraction logic

```


### Key Components

1. **LandingPage**: Handles file upload with animated progress indicator.
2. **Dashboard**: Main container for tabs and global layout.
3. **InvoicesTab**: Displays read-only invoice data with responsive design.
4. **ProductsTab**: Manages product data with edit capabilities.
5. **CustomersTab**: Manages customer data with edit capabilities.

### State Management

- Utilizes Redux Toolkit for centralized state management.
- Normalized store structure for efficient updates and queries.
- Slice structure:
  - `invoicesSlice`: Manages invoice data and updates.
  - `productsSlice`: Handles product information and edits.
  - `customersSlice`: Manages customer details and edits.

### AI Data Extraction

- Integrates with Google's Gemini AI for document processing.
- Supports multiple file formats (PDF, Excel, Images).
- Extracts and structures data into the following format:

```typescript
{
  invoices: Invoice[],
  products: Product[],
  customers: Customer[]
}
```
### Data Flow

1. User uploads file on LandingPage.
2. File is processed by AI extraction utility.
3. Extracted data is dispatched to Redux store.
4. Dashboard components fetch and display data from store.
5. User edits in ProductsTab or CustomersTab update store.
6. Changes are reflected in real-time across all components.


## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`


## Tech Stack

- Frontend: React.js, TypeScript, Tailwind CSS
- State Management: Redux Toolkit
- UI Components: shadcn/ui
- Animations: Framer Motion
- AI Integration: Google Gemini API


## AI Data Extraction Feature

The Invoice Management System leverages Google's Generative AI (Gemini) to automate the extraction of data from various document formats, including PDFs, images, and Excel files.

### Key Components:

1. **File Processing**: 
   - Supports multiple file formats (PDF, Excel, Images)
   - Extracts content using appropriate methods for each file type

2. **AI Integration**:
   - Utilizes Google's Generative AI (Gemini 1.5 Flash model)
   - Processes extracted content with a custom prompt

3. **Data Structuring**:
   - Organizes extracted data into Invoices, Products, and Customers
   - Maintains relationships between entities
   - Calculates aggregated values (e.g., totalQuantity, totalPurchaseAmount)

4. **Error Handling and Validation**:
   - Identifies missing required fields
   - Marks entries with incomplete data

### Workflow:

1. User uploads a document (PDF, Image, or Excel file)
2. System extracts text content from the file
3. Extracted content is sent to Gemini AI with a specialized prompt
4. AI processes the content and returns structured data
5. System parses the AI response and organizes it into the application's data model

### Key Features:

- Automated extraction of complex document structures
- Intelligent parsing of customer details, product information, and invoice metadata
- Real-time data validation and error detection
- Handling of multiple entries and relationships within a single file
- Calculation of derived values (e.g., unit prices, total amounts)

This AI-powered extraction significantly reduces manual data entry, improves accuracy, and enables rapid processing of large volumes of invoice data.

### Development Insights

To gain a deeper understanding of the Gemini AI integration and its capabilities, a separate application was developed:

- **Project**: [Gemini Document Processor](https://github.com/shivankkunwar/Gemini-Document-processor)
- **Live Demo**: [https://gemini-document-processor.vercel.app/](https://gemini-document-processor.vercel.app/)

This standalone application served as a learning tool and prototype, allowing for experimentation with various document types and AI prompts. The insights gained from this project directly informed the implementation of the AI extraction feature in the main Invoice Management System.

