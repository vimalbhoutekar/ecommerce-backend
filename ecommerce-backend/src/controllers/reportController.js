import PDFDocument from 'pdfkit';
import Order from '../models/orderModel.js';

export const generateSalesReport = async (req, res) => {
  try {
    const { period = 'daily', date } = req.query;
    
    let startDate, endDate;
    const currentDate = date ? new Date(date) : new Date();
    
    switch (period) {
      case 'daily':
        startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        endDate = new Date(currentDate.setHours(23, 59, 59, 999));
        break;
      case 'weekly':
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        endDate = new Date();
        break;
      case 'monthly':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
    }

    // Sales data aggregation
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Product-wise revenue
    const productRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.name',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          quantitySold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sales-report-${period}.pdf`);

    doc.pipe(res);
    
    doc.fontSize(20).text('Sales Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Period: ${period.toUpperCase()}`);
    doc.text(`Date Range: ${startDate.toDateString()} - ${endDate.toDateString()}`);
    doc.moveDown();

    if (salesData.length > 0) {
      const data = salesData[0];
      doc.text(`Total Orders: ${data.totalOrders}`);
      doc.text(`Total Revenue: $${data.totalRevenue.toFixed(2)}`);
      doc.text(`Average Order Value: $${data.avgOrderValue.toFixed(2)}`);
    }
    
    doc.moveDown();
    doc.text('Top Products by Revenue:', { underline: true });
    
    productRevenue.slice(0, 10).forEach(product => {
      doc.text(`${product._id}: $${product.revenue.toFixed(2)} (${product.quantitySold} units)`);
    });

    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};