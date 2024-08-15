import React from 'react';

const Dropdown = ({ selectedMonth, handleMonthChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <select value={selectedMonth} onChange={handleMonthChange}>
      {months.map((month, index) => (
        <option key={index} value={index + 1}>{month}</option>
      ))}
    </select>
  );
};

export default Dropdown;
