import { NextRequest, NextResponse } from 'next/server'
import {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getVerifiedSuppliers,
  getSuppliersByCategory,
  getSuppliersByCountry
} from '@/lib/services/suppliers-service'
import type { Supplier } from '@/types'

// GET /api/suppliers - Get all suppliers or filtered suppliers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const verified = searchParams.get('verified')
    const category = searchParams.get('category')
    const country = searchParams.get('country')
    const id = searchParams.get('id')

    if (id) {
      const supplier = await getSupplierById(id)
      if (!supplier) {
        return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
      }
      return NextResponse.json(supplier)
    }

    if (verified === 'true') {
      const suppliers = await getVerifiedSuppliers()
      return NextResponse.json(suppliers)
    }

    if (category) {
      const suppliers = await getSuppliersByCategory(category)
      return NextResponse.json(suppliers)
    }

    if (country) {
      const suppliers = await getSuppliersByCountry(country)
      return NextResponse.json(suppliers)
    }

    const suppliers = await getSuppliers()
    return NextResponse.json(suppliers)
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suppliers', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST /api/suppliers - Create a new supplier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...supplierData } = body as Supplier

    // Validate required fields
    if (!supplierData.name || !supplierData.categories || !supplierData.country) {
      return NextResponse.json(
        { error: 'Missing required fields: name, categories, country' },
        { status: 400 }
      )
    }

    const supplierId = await createSupplier(supplierData)
    return NextResponse.json({ id: supplierId, ...supplierData }, { status: 201 })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to create supplier', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// PUT /api/suppliers - Update a supplier
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body as Partial<Supplier> & { id: string }

    if (!id) {
      return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 })
    }

    await updateSupplier(id, updates)
    return NextResponse.json({ id, ...updates })
  } catch (error) {
    console.error('Error updating supplier:', error)
    return NextResponse.json(
      { error: 'Failed to update supplier', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE /api/suppliers - Delete a supplier
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Supplier ID is required' }, { status: 400 })
    }

    await deleteSupplier(id)
    return NextResponse.json({ message: 'Supplier deleted successfully' })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json(
      { error: 'Failed to delete supplier', message: (error as Error).message },
      { status: 500 }
    )
  }
}
