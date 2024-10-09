import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month')

  try {
    const client = await clientPromise
    const db = client.db("rox_database")

    const matchStage = { dateOfSale: { $regex: `.*${month}.*` } }

    const totalSaleAmount = await db.collection("transactions").aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]).toArray()

    const soldItems = await db.collection("transactions").countDocuments({
      ...matchStage,
      sold: true
    })

    const notSoldItems = await db.collection("transactions").countDocuments({
      ...matchStage,
      sold: false
    })

    return NextResponse.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      soldItems,
      notSoldItems
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
