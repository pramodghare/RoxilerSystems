const axios = require('axios');

const Transaction = require('../models/Transaction');

const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);

    res.status(200).send('Database initialized with seed data.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};



const listTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;

  try {
    const query = {
      dateOfSale: { $regex: `-${month}-`, $options: 'i' },
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } }
        ]
      })
    };

    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `-${month}-`, $options: 'i' } } },
      { $group: { _id: null, totalAmount: { $sum: '$price' } } }
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: `-${month}-`, $options: 'i' },
      sold: true
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: `-${month}-`, $options: 'i' },
      sold: false
    });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getBarChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const priceRanges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Number.MAX_SAFE_INTEGER }
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $regex: `-${month}-`, $options: 'i' },
          price: { $gte: range.min, $lte: range.max }
        });

        return { range: range.range, count };
      })
    );

    res.json(barChartData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPieChartData = async (req, res) => {
  const { month } = req.query;

  try {
    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: `-${month}-`, $options: 'i' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json(pieChartData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCombinedData = async (req, res) => {
  try {
    const [statistics, barChartData, pieChartData] = await Promise.all([
      getStatistics(req, res),
      getBarChartData(req, res),
      getPieChartData(req, res)
    ]);

    res.json({ statistics, barChartData, pieChartData });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {initializeDatabase,listTransactions,getStatistics,getBarChartData,getPieChartData,getCombinedData};
