import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import axios from 'axios'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("rox_database")

    // Fetch data from the third-party API
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json')
    const data = response.data

    // Insert data into MongoDB
    await db.collection("transactions").insertMany(data)

    return NextResponse.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Seeding error:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
