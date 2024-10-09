'use client'

import { useState, useEffect } from 'react'
import TransactionTable from './components/TransactionTable'
import Statistics from './components/Statistics'
import BarChart from './components/BarChart'
import PieChart from './components/PieChart'
import { CombinedData } from './types'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Home() {
  const [month, setMonth] = useState('March')
  const [searchTerm, setSearchTerm] = useState('')
  const [data, setData] = useState<CombinedData | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    fetchData()
  }, [month, searchTerm, page])

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/combined?month=${month}&search=${searchTerm}&page=${page}&perPage=${perPage}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const result: CombinedData = await response.json()
      console.log('API response:', result)  // For debugging
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
      setData(null)
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Dashboard</h1>
      <div className="mb-4 flex items-center">
        <select 
          value={month} 
          onChange={(e) => setMonth(e.target.value)}
          className="mr-4 p-2 border rounded"
        >
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search transactions..."
          className="p-2 border rounded flex-grow"
        />
      </div>
      {data ? (
        <>
          <Statistics data={data.statistics} />
          <TransactionTable 
            data={data.transactions} 
            page={page} 
            setPage={setPage} 
            perPage={perPage} 
          />
          <div className="flex mt-8">
            <div className="w-1/2 pr-4">
              <BarChart data={data.barChartData} />
            </div>
            <div className="w-1/2 pl-4">
              <PieChart data={data.pieChartData} />
            </div>
          </div>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </main>
  )
}