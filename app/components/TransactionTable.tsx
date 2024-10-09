import React from 'react';
import { Transaction } from '../types';

interface TransactionTableProps {
  data: {
    transactions: Transaction[];
    total: number;
    page: number;
    perPage: number;
  };
  page: number;
  setPage: (page: number) => void;
  perPage: number;
}

export default function TransactionTable({ data, page, setPage, perPage }: TransactionTableProps) {
  const { transactions, total } = data;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Sold</th>
            <th className="border p-2">Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="border p-2">{transaction.title}</td>
                <td className="border p-2">{transaction.description.substring(0, 50)}...</td>
                <td className="border p-2">${transaction.price.toFixed(2)}</td>
                <td className="border p-2">{transaction.category}</td>
                <td className="border p-2">{transaction.sold ? 'Yes' : 'No'}</td>
                <td className="border p-2">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="border p-2 text-center">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil(total / perPage)}</span>
        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page * perPage >= total}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  )
}