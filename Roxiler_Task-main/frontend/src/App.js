import React, { useState } from 'react';
import './App.css';
import Dropdown from './components/Dropdown';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChartComponent from './components/BarChartComponent';
import PieChartComponent from './components/PieChartComponent';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <div className="App">
      <h1>MERN Stack Coding Challenge</h1>
      <Dropdown selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
      <StatisticsBox selectedMonth={selectedMonth} />
      <TransactionsTable selectedMonth={selectedMonth} />
      <BarChartComponent selectedMonth={selectedMonth} />
      <PieChartComponent selectedMonth={selectedMonth} />
    </div>
  );
};

export default App;
