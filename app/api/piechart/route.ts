import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')

  try {
    const client = await clientPromise
    const db = client.db("rox_database")

    const result = await db.collection("transactions").aggregate([
      { $match: { dateOfSale: { $regex: `.*${month}.*` } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]).toArray()

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching pie chart data:', error)
    return NextResponse.json({ error: 'Failed to fetch pie chart data' }, { status: 500 })
  }
}