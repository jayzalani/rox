import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const perPage = parseInt(searchParams.get('perPage') || '10')

  try {
    const client = await clientPromise
    const db = client.db("rox_database")

    const monthNumber = new Date(`${month} 1, 2000`).getMonth() + 1
    const monthRegex = new RegExp(`-${monthNumber.toString().padStart(2, '0')}-`)

    const query = {
      dateOfSale: { $regex: monthRegex },
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } }
      ]
    }

    // Transactions
    const total = await db.collection("transactions").countDocuments(query)
    const transactions = await db.collection("transactions")
      .find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray()

    // Statistics
    const allTransactions = await db.collection("transactions").find({ dateOfSale: { $regex: monthRegex } }).toArray()
    const totalSaleAmount = allTransactions.reduce((sum, transaction) => sum + transaction.price, 0)
    const totalSoldItems = allTransactions.filter(transaction => transaction.sold).length
    const totalNotSoldItems = allTransactions.length - totalSoldItems

    // Bar Chart Data
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ]

    const barChartData = priceRanges.map(range => ({
      range: range.max === Infinity ? `${range.min}-above` : `${range.min}-${range.max}`,
      count: allTransactions.filter(transaction => transaction.price >= range.min && transaction.price <= range.max).length
    }))

    // Pie Chart Data
    const categories = [...new Set(allTransactions.map(transaction => transaction.category))]
    const pieChartData = categories.map(category => ({
      category,
      count: allTransactions.filter(transaction => transaction.category === category).length
    }))

    return NextResponse.json({
      transactions: { transactions, total, page, perPage },
      statistics: { totalSaleAmount, totalSoldItems, totalNotSoldItems },
      barChartData,
      pieChartData
    })
  } catch (error) {
    console.error('Error fetching combined data:', error)
    return NextResponse.json({ error: 'Failed to fetch combined data' }, { status: 500 })
  }
}