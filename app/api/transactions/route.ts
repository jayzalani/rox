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

    const total = await db.collection("transactions").countDocuments(query)
    const transactions = await db.collection("transactions")
      .find(query)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray()

    return NextResponse.json({
      transactions,
      total,
      page,
      perPage
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}