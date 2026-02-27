import { Order } from "@/lib/types";
import { format } from "date-fns";
import { Download, Printer, Mail, CheckCircle, Package, Calendar, CreditCard, User, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

interface InvoiceViewProps {
  order: Order;
  onClose: () => void;
}

export default function InvoiceView({ order, onClose }: InvoiceViewProps) {
  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to download invoice");
      return;
    }

    const invoiceHTML = generateInvoiceHTML(order);
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Please allow popups to print invoice");
      return;
    }

    const invoiceHTML = generateInvoiceHTML(order);
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Invoice</h2>
            <p className="text-gray-400 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors" title="Print">
              <Printer size={20} className="text-white" />
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF3B30] to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white font-bold transition-all shadow-lg">
              <Download size={20} />
              Download
            </button>
            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white font-bold">
              ✕
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div id="invoice-content">
            {/* Company Header */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                    <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-gray-900">NRX Store</h1>
                    <p className="text-sm text-gray-600 font-semibold">Premium Diamond Shop</p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2"><Mail size={14} /> support@nrxstore.com</p>
                  <p className="flex items-center gap-2"><Phone size={14} /> +8801883800356</p>
                  <p className="flex items-center gap-2"><MapPin size={14} /> Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-block px-4 py-2 rounded-xl font-bold text-sm mb-3 ${
                  order.status === 'completed' ? 'bg-green-100 text-green-700' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {order.status.toUpperCase()}
                </div>
                <p className="text-sm text-gray-600 mb-1">Invoice Date</p>
                <p className="text-lg font-bold text-gray-900">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
              </div>
            </div>

            {/* Customer & Order Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-sm font-bold text-blue-700 uppercase mb-3 flex items-center gap-2">
                  <User size={16} />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-900 font-bold">{order.userName || order.user_name || order.display_name || 'Unknown User'}</p>
                  <p className="text-sm text-gray-600">{order.userEmail}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone size={14} />
                    {order.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-sm font-bold text-purple-700 uppercase mb-3 flex items-center gap-2">
                  <Package size={16} />
                  Order Details
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-gray-900 font-bold font-mono">{order.id.slice(0, 16).toUpperCase()}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={14} />
                    {format(new Date(order.createdAt), "MMM dd, yyyy • HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mb-8">
              <h3 className="text-lg font-black text-gray-900 mb-4">Product Details</h3>
              <div className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                    <tr>
                      <th className="text-left px-6 py-4 font-bold">Product</th>
                      <th className="text-center px-6 py-4 font-bold">Game ID</th>
                      <th className="text-center px-6 py-4 font-bold">Diamonds</th>
                      <th className="text-right px-6 py-4 font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{order.productName}</p>
                        <p className="text-sm text-gray-600">Digital Product</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="font-mono font-bold text-gray-900">{order.gameId}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="font-bold text-gray-900">{order.diamonds.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xl font-black text-gray-900">৳{order.price.toLocaleString()}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-sm font-bold text-green-700 uppercase mb-3 flex items-center gap-2">
                  <CreditCard size={16} />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Method</span>
                    <span className="font-bold text-gray-900">{order.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transaction ID</span>
                    <span className="font-mono font-bold text-gray-900 text-sm">{order.transactionId}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Total Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">৳{order.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span className="font-bold">৳0</span>
                  </div>
                  <div className="pt-3 border-t-2 border-gray-300 flex justify-between">
                    <span className="text-lg font-black text-gray-900">Total</span>
                    <span className="text-2xl font-black text-[#FF3B30]">৳{order.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            {order.adminNotes && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 mb-8">
                <h3 className="text-sm font-bold text-blue-700 uppercase mb-2 flex items-center gap-2">
                  <CheckCircle size={16} />
                  Admin Notes
                </h3>
                <p className="text-gray-900">{order.adminNotes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-6 border-t-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Thank you for your business!</p>
              <p className="text-xs text-gray-500">This is a computer-generated invoice. No signature required.</p>
              <p className="text-xs text-gray-500 mt-2">For support, contact us at support@nrxstore.com or +8801883800356</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateInvoiceHTML(order: Order): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${order.id.slice(0, 8).toUpperCase()}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
        .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #FF3B30; }
        .logo { display: flex; align-items: center; gap: 15px; }
        .logo-img { width: 60px; height: 60px; border-radius: 12px; }
        .company-name { font-size: 28px; font-weight: bold; color: #1a1a1a; }
        .company-tagline { font-size: 12px; color: #666; }
        .status { padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 12px; display: inline-block; }
        .status-completed { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #d1ecf1; color: #0c5460; }
        .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-box { padding: 20px; border-radius: 12px; border: 2px solid #e0e0e0; }
        .info-title { font-size: 12px; font-weight: bold; color: #666; text-transform: uppercase; margin-bottom: 10px; }
        .info-content { font-size: 14px; color: #1a1a1a; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        th { background: #1a1a1a; color: white; padding: 15px; text-align: left; font-weight: bold; }
        td { padding: 15px; border-bottom: 1px solid #e0e0e0; }
        .total-section { text-align: right; margin-top: 30px; }
        .total-row { display: flex; justify-content: flex-end; gap: 100px; margin: 10px 0; }
        .total-label { color: #666; }
        .total-value { font-weight: bold; }
        .grand-total { font-size: 24px; color: #FF3B30; font-weight: bold; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; font-size: 12px; }
        @media print { body { background: white; padding: 0; } .invoice { box-shadow: none; } }
      </style>
    </head>
    <body>
      <div class="invoice">
        <div class="header">
          <div class="logo">
            <div>
              <div class="company-name">NRX Store</div>
              <div class="company-tagline">Premium Diamond Shop</div>
              <div style="margin-top: 10px; font-size: 12px; color: #666;">
                <div>📧 support@nrxstore.com</div>
                <div>📞 +8801883800356</div>
                <div>📍 Dhaka, Bangladesh</div>
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="status status-${order.status}">${order.status.toUpperCase()}</div>
            <div style="margin-top: 15px; font-size: 12px; color: #666;">Invoice Date</div>
            <div style="font-size: 16px; font-weight: bold;">${format(new Date(order.createdAt), "MMM dd, yyyy")}</div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-box">
            <div class="info-title">👤 Customer Information</div>
            <div class="info-content">
              <div style="font-weight: bold; margin-bottom: 5px;">${order.userName || order.user_name || order.display_name || 'Unknown User'}</div>
              <div style="font-size: 12px; color: #666;">${order.userEmail}</div>
              <div style="font-size: 12px; color: #666;">📞 ${order.phoneNumber}</div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-title">📦 Order Details</div>
            <div class="info-content">
              <div style="font-size: 12px; color: #666;">Order ID</div>
              <div style="font-weight: bold; font-family: monospace; margin-bottom: 5px;">${order.id.slice(0, 16).toUpperCase()}</div>
              <div style="font-size: 12px; color: #666;">📅 ${format(new Date(order.createdAt), "MMM dd, yyyy • HH:mm")}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Game ID</th>
              <th style="text-align: center;">Diamonds</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="font-weight: bold;">${order.productName}</div>
                <div style="font-size: 12px; color: #666;">Digital Product</div>
              </td>
              <td style="text-align: center; font-family: monospace; font-weight: bold;">${order.gameId}</td>
              <td style="text-align: center; font-weight: bold;">${order.diamonds.toLocaleString()}</td>
              <td style="text-align: right; font-size: 18px; font-weight: bold;">৳${order.price.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="info-section">
          <div class="info-box">
            <div class="info-title">💳 Payment Information</div>
            <div class="info-content">
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span style="color: #666;">Method</span>
                <span style="font-weight: bold;">${order.paymentMethod.toUpperCase()}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span style="color: #666;">Transaction ID</span>
                <span style="font-family: monospace; font-weight: bold; font-size: 12px;">${order.transactionId}</span>
              </div>
            </div>
          </div>
          <div class="info-box">
            <div class="info-title">Total Summary</div>
            <div class="total-section">
              <div class="total-row">
                <span class="total-label">Subtotal</span>
                <span class="total-value">৳${order.price.toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span class="total-label">Tax</span>
                <span class="total-value">৳0</span>
              </div>
              <div class="total-row" style="border-top: 2px solid #e0e0e0; padding-top: 10px; margin-top: 10px;">
                <span style="font-size: 18px; font-weight: bold;">Total</span>
                <span class="grand-total">৳${order.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        ${order.adminNotes ? `
          <div class="info-box" style="margin-top: 20px; background: #e3f2fd; border-color: #2196f3;">
            <div class="info-title" style="color: #1976d2;">✓ Admin Notes</div>
            <div class="info-content">${order.adminNotes}</div>
          </div>
        ` : ''}

        <div class="footer">
          <div style="font-weight: bold; margin-bottom: 10px;">Thank you for your business!</div>
          <div>This is a computer-generated invoice. No signature required.</div>
          <div style="margin-top: 10px;">For support, contact us at support@nrxstore.com or +8801883800356</div>
        </div>
      </div>
    </body>
    </html>
  `;
}
