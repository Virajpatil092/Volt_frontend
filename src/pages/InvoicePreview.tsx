import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { RootState } from '../store';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoicePreview: React.FC = () => {
  const navigate = useNavigate();
  const { currentReceipt } = useSelector((state: RootState) => state.receipt);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice-${currentReceipt?.receiptNumber}`,
  });

  const handleDownloadPDF = async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${currentReceipt?.receiptNumber}.pdf`);
    }
  };

  if (!currentReceipt) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No receipt found</h2>
          <p className="text-gray-600 mb-6">Please generate a receipt first</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Invoice Preview</h1>
              <p className="text-gray-600">Review and download your invoice</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg">
        <div ref={componentRef} className="bg-white" style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          padding: '10mm',
          fontFamily: 'Arial, sans-serif',
          fontSize: '11px',
          lineHeight: '1.2',
          color: '#000'
        }}>
          
          {/* Main Invoice Table */}
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            border: '2px solid #000'
          }}>
            {/* Header Row */}
            <tr>
              <td colSpan={6} style={{ 
                border: '1px solid #000', 
                padding: '8px',
                backgroundColor: '#4a90a4',
                color: 'white',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bolder'
              }}>
                TAX INVOICE
              </td>
            </tr>
            
            {/* MO Number Row */}
            <tr>
              <td colSpan={4} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                MO : 7066775755
              </td>
              
              <td colSpan={4} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                width: '100%'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 16px' }}>
                  <span>STATE</span>
                  <span style={{ fontWeight: 'bold' }}>{currentReceipt.state}</span>
                  <span>CODE</span>
                  <span style={{ fontWeight: 'bold' }}>{currentReceipt.code}</span>
                </div>
              </td>
            </tr>

            {/* Company Name Row */}
            <tr>
              <td colSpan={6} style={{ 
                border: '1px solid #000', 
                padding: '8px',
                backgroundColor: '#4a90a4',
                color: 'white',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: 'bolder'
              }}>
                VOLTS PLUS PRIVATE LIMITED
              </td>
            </tr>

            {/* Company Address Row */}
            <tr>
              <td colSpan={6} style={{ 
                border: '1px solid #000', 
                padding: '6px 8px',
                textAlign: 'center',
                fontSize: '10px'
              }}>
                SHOP NO. 2, SHYAM ICON, RASBIHARI LINK ROAD, NEAR RAJMATA MANGAL KARYALAY,<br />
                PANCHVATI, NASHIK, 422004, MAHARASHTRA, INDIA
              </td>
            </tr>

            {/* Customer Details Section */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                width: '15%'
              }}>
                NAME :
              </td>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '35%'
              }}>
                {currentReceipt.customerName}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                width: '15%'
              }}>
                INVOICE NO :
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '35%'
              }}>
                {currentReceipt.receiptNumber}
              </td>
            </tr>

            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                ADDRESS:
              </td>
              <td colSpan={5} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                {currentReceipt.address}
              </td>
            </tr>

            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                CITY :
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                {currentReceipt.city}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                STATE :
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {currentReceipt.state}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                DATE :
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {currentReceipt.date}
              </td>
            </tr>

            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                GST NO :
              </td>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                {currentReceipt.gstin || ''}
              </td>
            </tr>

            {/* Product Details Header */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '8%'
              }}>
                SR NO.
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '35%'
              }}>
                PARTICULARS
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '12%'
              }}>
                HSN CODE
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '8%'
              }}>
                QTY.
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '15%'
              }}>
                RATE
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                textAlign: 'center',
                width: '15%'
              }}>
                TOTAL AMOUNT
              </td>
            </tr>

            {/* Product Details Row */}
            {currentReceipt.items.map((item, index) => (
              <tr key={index}>
                <td style={{ 
                  border: '1px solid #000', 
                  padding: '4px 8px',
                  fontSize: '10px',
                  textAlign: 'center',
                  verticalAlign: 'top'
                }}>
                  {index + 1}
                </td>
                <td style={{ 
                  border: '1px solid #000', 
                  padding: '4px 8px',
                  fontSize: '10px',
                  verticalAlign: 'top'
                }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>MODEL :</strong> {item.model.name}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>CHASSIS:</strong> {item.chassisNumber}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>BATTERY:</strong> {item.battery.name}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>BATTERY NO:</strong> {item.batteryNumber}
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>CHARGER NO :</strong> {item.chargerNumber}
                  </div>
                  <div>
                    <strong>COLOUR :</strong> {item.color}
                  </div>
                </td>
                <td style={{ 
                  border: '1px solid #000', 
                  padding: '4px 8px',
                  fontSize: '10px',
                  textAlign: 'center',
                  verticalAlign: 'top'
                }}>
                  {item.hsnCode}
                </td>
                <td style={{ 
                  border: '1px solid #000', 
                  padding: '4px 8px',
                  fontSize: '10px',
                  textAlign: 'center',
                  verticalAlign: 'top'
                }}>
                  {item.quantity}
                </td>
                <td style={{ 
                  border: '1px solid #000', 
                  padding: '4px 8px',
                  fontSize: '10px',
                  textAlign: 'center',
                  verticalAlign: 'top'
                }}>
                  {item.rate.toLocaleString()}
                </td>
                <td style={{ 
                  border: '1px solid #000', 
                  padding: '4px 8px',
                  fontSize: '10px',
                  textAlign: 'center',
                  verticalAlign: 'top'
                }}>
                  {item.amount.toLocaleString()}
                </td>
              </tr>
            ))}

            {/* GSTIN Row */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                GSTIN :
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                27AALCV0044P1ZV
              </td>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                TOTAL AMOUNT
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                {currentReceipt.subtotal.toLocaleString()}
              </td>
            </tr>

            {/* Amount in Words Row */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                RS. IN WORDS :
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                Rupees {currentReceipt.totalAmount.toLocaleString()} Only
              </td>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                SGST......9%
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                textAlign: 'center'
              }}>
                {currentReceipt.sgst.toLocaleString()}
              </td>
            </tr>

            {/* CGST Row */}
            <tr>
              <td colSpan={2} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px'
              }}></td>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                CGST......9%
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                textAlign: 'center'
              }}>
                {currentReceipt.cgst.toLocaleString()}
              </td>
            </tr>

            {/* Grand Total Row */}
            <tr>
              <td colSpan={2} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px'
              }}></td>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                GRAND TOTAL
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                {currentReceipt.totalAmount.toLocaleString()}
              </td>
            </tr>

            {/* Bank Details Section */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                backgroundColor: '#f0f0f0'
              }}>
                BANK DETAILS
              </td>
              <td colSpan={5} style={{ 
                border: '1px solid #000', 
                padding: '4px 8px'
              }}></td>
            </tr>

            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                BANK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                BANK OF MAHARASHTRA
              </td>
            </tr>

            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                A/C. NO. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                60535248084
              </td>
            </tr>

            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                IFSC &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                MAHB0002578
              </td>
            </tr>

            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px'
              }}>
                BRANCH &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                MHASRUL
              </td>
            </tr>

            {/* Terms and Conditions */}
            <tr>
              <td colSpan={6} style={{ 
                border: '1px solid #000', 
                padding: '8px',
                fontSize: '9px',
                lineHeight: '1.3'
              }}>
                <div style={{ marginBottom: '2px' }}>1. GOODS ONCE SOLD WILL NOT BE TAKEN BACK.</div>
                <div style={{ marginBottom: '2px' }}>2. INTEREST AT THE 18% WILL BE CHANGED ON A/C. NUMBER</div>
                <div style={{ marginBottom: '2px' }}>&nbsp;&nbsp;&nbsp;TO YOUR REMAINING UNPAID DAYS OF DELIVERY.</div>
                <div style={{ marginBottom: '2px' }}>3. COMPLAIN IF ANY SHOULD BE MADE WITHIN 3 DAYS OF RECIPT GOODS.</div>
                <div style={{ marginBottom: '2px' }}>4. SUBJECT TO NASHIK JURISDICTION.</div>
                <div>5. OUR RISK AND RESPONSIBILITY CEASES ONCE GOODS LEAVES OUR PREMISES.</div>
              </td>
            </tr>

            {/* Signature Section */}
            <tr>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '40px 8px 8px 8px',
                fontSize: '10px',
                verticalAlign: 'bottom'
              }}>
                RECEIVERS SIGNATURE
              </td>
              <td colSpan={3} style={{ 
                border: '1px solid #000', 
                padding: '8px',
                fontSize: '10px',
                textAlign: 'right',
                verticalAlign: 'bottom'
              }}>
                <div style={{ marginBottom: '20px' }}>AUTHORISED DEALER</div>
                <div style={{ fontWeight: 'bold' }}>VOLTS PLUS PVT LTD.</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;