import ExcelJS from 'exceljs'

export interface ExportData {
  sheetName: string
  data: Record<string, unknown>[]
  columns?: string[]
}

export const exportToExcel = async (
  data: ExportData[],
  filename: string = 'export.xlsx'
) => {
  try {
    const workbook = new ExcelJS.Workbook()

    for (const sheet of data) {
      const worksheet = workbook.addWorksheet(sheet.sheetName)

      if (sheet.data.length > 0) {
        // Colonnes automatiques à partir des clés du premier objet
        const columns =
          sheet.columns ||
          Object.keys(sheet.data[0]).map((key) => ({
            header: key,
            key,
            width: 25,
          }))

        worksheet.columns = columns as ExcelJS.Column[]

        // Ajouter les lignes
        sheet.data.forEach((row) => {
          worksheet.addRow(row)
        })

        // Style d'en-tête
        worksheet.getRow(1).font = { bold: true }
        worksheet.getRow(1).alignment = { horizontal: 'center' }

        // Ajuster la largeur automatiquement
        worksheet.columns.forEach((col) => {
          if (col && col.eachCell) {
            let maxLength = 10
            col.eachCell({ includeEmpty: true }, (cell) => {
              const len = cell.value ? cell.value.toString().length : 0
              if (len > maxLength) maxLength = len
            })
            col.width = maxLength + 2
          }
        })
      }
    }

    // Générer le fichier Excel
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Télécharger le fichier
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erreur export Excel :', error)
    throw error
  }
}

export const exportSalesReport = async (
  salesData: Record<string, unknown>[],
  summary: Record<string, unknown>,
  period: { startDate: string; endDate: string }
) => {
  const filename = `Rapport_Ventes_${period.startDate}_${period.endDate}.xlsx`

  const sheets: ExportData[] = [
    {
      sheetName: 'Résumé',
      data: [
        { Indicateur: 'Nombre de ventes', Valeur: summary.salesCount },
        { Indicateur: 'Chiffre d\'affaires total (XOF)', Valeur: summary.totalRevenue },
        { Indicateur: 'TVA collectée (XOF)', Valeur: summary.totalTax },
        {
          Indicateur: 'Ticket moyen (XOF)',
          Valeur:
            typeof summary.salesCount === 'number' &&
            summary.salesCount > 0 &&
            typeof summary.totalRevenue === 'number'
              ? Math.round(summary.totalRevenue / summary.salesCount)
              : 0,
        },
        {
          Indicateur: 'Période',
          Valeur: `${period.startDate} - ${period.endDate}`,
        },
      ],
    },
    {
      sheetName: 'Ventes Détaillées',
      data: salesData.map((sale: Record<string, unknown>) => ({
        'N° Vente': sale.saleNumber,
        Date: sale.saleDate
          ? new Date(sale.saleDate as string).toLocaleDateString('fr-FR')
          : '-',
        Heure: sale.saleDate
          ? new Date(sale.saleDate as string).toLocaleTimeString('fr-FR')
          : '-',
        Client: sale.customerName || 'Anonyme',
        Caissier: sale.cashierName,
        Caisse: sale.cashRegisterNumber,
        'Sous-total (XOF)': sale.subtotal,
        'Remise (XOF)': sale.discount,
        'TVA (XOF)': sale.taxAmount,
        'Total (XOF)': sale.totalAmount,
        Statut: sale.status,
      })),
    },
  ]

  if (
    summary.topProducts &&
    Array.isArray(summary.topProducts) &&
    summary.topProducts.length > 0
  ) {
    sheets.push({
      sheetName: 'Produits les plus vendus',
      data: summary.topProducts.map(
        (product: Record<string, unknown>, index: number) => ({
          Rang: index + 1,
          Produit: product.productName,
          SKU: product.productSku || '-',
          'Quantité vendue': product.quantity,
          'Chiffre d\'affaires (XOF)': product.revenue,
        })
      ),
    })
  }

  await exportToExcel(sheets, filename)
}

export const exportStockReport = async (
  stockData: Record<string, unknown>[]
) => {
  const filename = `Rapport_Stock_${new Date().toISOString().split('T')[0]}.xlsx`

  const sheets: ExportData[] = [
    {
      sheetName: 'Stock Global',
      data: stockData.map((item) => ({
        SKU: item.productSku,
        Produit: item.productName,
        Catégorie: item.categoryName || '-',
        'Stock disponible': item.availableQuantity,
        'Stock réservé': item.reservedQuantity,
        'Stock total': item.totalQuantity,
        'Niveau minimum': item.minStockLevel || '-',
        'Niveau réappro': item.reorderLevel || '-',
        Statut:
          (typeof item.availableQuantity === 'number'
            ? item.availableQuantity
            : 0) <=
          (typeof item.minStockLevel === 'number'
            ? item.minStockLevel
            : 0)
            ? 'Stock faible'
            : 'OK',
      })),
    },
  ]

  const lowStock = stockData.filter((item) => {
    const minStock =
      typeof item.minStockLevel === 'number' ? item.minStockLevel : 0
    const available =
      typeof item.availableQuantity === 'number' ? item.availableQuantity : 0
    return minStock > 0 && available <= minStock
  })

  if (lowStock.length > 0) {
    sheets.push({
      sheetName: 'Stock Faible',
      data: lowStock.map((item) => ({
        SKU: item.productSku,
        Produit: item.productName,
        'Stock disponible': item.availableQuantity,
        'Niveau minimum': item.minStockLevel,
        'À commander': Math.max(
          0,
          (typeof item.reorderLevel === 'number'
            ? item.reorderLevel
            : typeof item.minStockLevel === 'number'
              ? item.minStockLevel
              : 0) -
            (typeof item.availableQuantity === 'number'
              ? item.availableQuantity
              : 0)
        ),
      })),
    })
  }

  await exportToExcel(sheets, filename)
}
