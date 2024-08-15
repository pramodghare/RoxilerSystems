import React, { useState, useEffect } from 'react';
import { getStatistics } from '../services/api';

const StatisticsBox = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [selectedMonth]);

  const fetchStatistics = async () => {
    try {
      const response = await getStatistics(selectedMonth);
      setStatistics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Statistics</h3>
      <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default StatisticsBox;
