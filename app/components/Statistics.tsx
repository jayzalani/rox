import React from 'react';
import { Statistics as StatisticsType } from '../types';

interface StatisticsProps {
  data: StatisticsType;
}

export default function Statistics({ data }: StatisticsProps) {
  if (!data) {
    return <div>No statistics data available.</div>;
  }

  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      <div className="bg-blue-100 p-4 rounded">
        <h3 className="font-bold">Total Sale Amount</h3>
        <p>${data.totalSaleAmount.toFixed(2)}</p>
      </div>
      <div className="bg-green-100 p-4 rounded">
        <h3 className="font-bold">Total Sold Items</h3>
        <p>{data.totalSoldItems}</p>
      </div>
      <div className="bg-red-100 p-4 rounded">
        <h3 className="font-bold">Total Not Sold Items</h3>
        <p>{data.totalNotSoldItems}</p>
      </div>
    </div>
  );
}