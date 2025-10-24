"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Printer, FileDown } from "lucide-react"
import type { Sale } from "@/types/api"

interface ReceiptPrinterProps {
  sale: Sale
  onPrint?: () => void
}

export function ReceiptPrinter({ sale, onPrint }: ReceiptPrinterProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Ticket ${sale.saleNumber}</title>
              <style>
                @page { margin: 0; }
                body { 
                  margin: 0; 
                  padding: 20px;
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.4;
                }
                .receipt { 
                  max-width: 80mm; 
                  margin: 0 auto;
                }
                .center { text-align: center; }
                .bold { font-weight: bold; }
                .line { border-bottom: 1px dashed #000; margin: 10px 0; }
                table { width: 100%; border-collapse: collapse; }
                td { padding: 2px 0; }
                .right { text-align: right; }
                .total { font-size: 14px; font-weight: bold; margin-top: 10px; }
                @media print {
                  body { padding: 0; }
                }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
          onPrint?.()
        }, 250)
      }
    }
  }

  const handleDownloadPDF = () => {
    // Pour un vrai PDF, utiliser jsPDF
    handlePrint()
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button onClick={handlePrint} className="flex-1">
          <Printer className="mr-2 h-4 w-4" />
          Imprimer
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline" className="flex-1">
          <FileDown className="mr-2 h-4 w-4" />
          PDF
        </Button>
      </div>

      {/* Receipt Preview */}
      <div className="border rounded-lg p-4 bg-white">
        <div ref={receiptRef} className="receipt font-mono text-sm">
          {/* Header with Logo */}
          <div className="center mb-4">
            <div className="text-2xl bold">🛍️ DUTY FREE</div>
            <div className="text-xs mt-2">DJBC - Aéroport International</div>
            <div className="text-xs">Ouagadougou, Burkina Faso</div>
            <div className="text-xs">Tel: +226 XX XX XX XX</div>
            <div className="text-xs">IFU: XXXXXXXXXXX</div>
          </div>

          <div className="line"></div>

          {/* Welcome Message */}
          <div className="center mb-2">
            <div className="bold">Bienvenue / Welcome</div>
            <div className="text-xs">Merci de votre visite</div>
          </div>

          <div className="line"></div>

          {/* Sale Info */}
          <table className="mb-2">
            <tbody>
              <tr>
                <td>N° Ticket:</td>
                <td className="right bold">{sale.saleNumber}</td>
              </tr>
              <tr>
                <td>Date:</td>
                <td className="right">
                  {new Date(sale.saleDate).toLocaleDateString('fr-FR')}
                </td>
              </tr>
              <tr>
                <td>Heure:</td>
                <td className="right">
                  {new Date(sale.saleDate).toLocaleTimeString('fr-FR')}
                </td>
              </tr>
              <tr>
                <td>Caisse:</td>
                <td className="right">{sale.cashRegisterNumber}</td>
              </tr>
              <tr>
                <td>Caissier:</td>
                <td className="right">{sale.cashierName}</td>
              </tr>
              {sale.customerName && (
                <tr>
                  <td>Client:</td>
                  <td className="right">{sale.customerName}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="line"></div>

          {/* Items - Bilingual */}
          <div className="mb-2">
            <div className="bold mb-2">ARTICLES / ITEMS</div>
            {sale.items.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <span className="bold">{item.productName}</span>
                </div>

                <div className="flex justify-between">
                  <span>
                    {item.quantity} x {item.unitPrice.toLocaleString()} XOF
                  </span>
                  <span className="bold">{item.totalPrice.toLocaleString()} XOF</span>
                </div>
              </div>
            ))}
          </div>

          <div className="line"></div>

          {/* Totals */}
          <table className="mb-2">
            <tbody>
              <tr>
                <td>Sous-total HT / Subtotal:</td>
                <td className="right">{sale.subtotal.toLocaleString()} XOF</td>
              </tr>
              {sale.discount > 0 && (
                <tr>
                  <td>Remise / Discount:</td>
                  <td className="right">-{sale.discount.toLocaleString()} XOF</td>
                </tr>
              )}
              <tr>
                <td>TVA (18%):</td>
                <td className="right">{sale.taxAmount.toLocaleString()} XOF</td>
              </tr>
            </tbody>
          </table>

          <div className="line"></div>

          {/* Grand Total */}
          <div className="total center mb-3">
            <div>TOTAL TTC / TOTAL</div>
            <div className="text-2xl">{sale.totalAmount.toLocaleString()} XOF</div>
          </div>

          {/* Payments */}
          {sale.payments && sale.payments.length > 0 && (
            <>
              <div className="line"></div>
              <div className="mb-2">
                <div className="bold mb-1">PAIEMENT / PAYMENT</div>
                {sale.payments.map((payment, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {payment.paymentMethod === 'CASH' ? 'Espèces / Cash' : 
                       payment.paymentMethod === 'CARD' ? 'Carte / Card' : 
                       'Mobile Money'} ({payment.currency})
                    </span>
                    <span>{payment.amount.toLocaleString()} XOF</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="line"></div>

          {/* Footer Message */}
          <div className="center text-xs mb-2">
            <div className="bold mb-1">Merci de votre achat!</div>
            <div className="bold">Thank you for your purchase!</div>
            <div className="mt-2">Au plaisir de vous revoir</div>
            <div>We hope to see you again</div>
          </div>

          {/* Promotional Message (Optional) */}
          <div className="center text-xs mt-3 p-2" style={{ border: '1px dashed #000' }}>
            <div className="bold">🎁 OFFRE SPÉCIALE / SPECIAL OFFER 🎁</div>
            <div>10% de réduction sur votre prochain achat</div>
            <div>10% off on your next purchase</div>
            <div className="mt-1 text-xs">Code: WELCOME10</div>
          </div>

          {/* Barcode/QR Code Placeholder */}
          <div className="center mt-4 text-xs">
            <div>*** {sale.saleNumber} ***</div>
          </div>

          {/* Legal Footer */}
          <div className="center text-xs mt-3">
            <div>Ce ticket vaut facture</div>
            <div>This receipt is valid as invoice</div>
          </div>
        </div>
      </div>
    </>
  )
}