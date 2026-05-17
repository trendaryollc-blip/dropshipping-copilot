import { NextRequest, NextResponse } from 'next/server'
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrdersByStatus,
  getOrdersByCustomer,
  getPendingOrders,
  getShippedOrders,
  getDeliveredOrders
} from '@/lib/services/orders-service'
import type { Order } from '@/types'

// GET /api/orders - Get all orders or filtered orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const customer = searchParams.get('customer')
    const id = searchParams.get('id')

    if (id) {
      const order = await getOrderById(id)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    if (status === 'pending') {
      const orders = await getPendingOrders()
      return NextResponse.json(orders)
    }

    if (status === 'shipped') {
      const orders = await getShippedOrders()
      return NextResponse.json(orders)
    }

    if (status === 'delivered') {
      const orders = await getDeliveredOrders()
      return NextResponse.json(orders)
    }

    if (status) {
      const orders = await getOrdersByStatus(status as Order['status'])
      return NextResponse.json(orders)
    }

    if (customer) {
      const orders = await getOrdersByCustomer(customer)
      return NextResponse.json(orders)
    }

    const orders = await getOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...orderData } = body as Order

    // Validate required fields
    if (!orderData.productName || !orderData.customer || !orderData.total) {
      return NextResponse.json(
        { error: 'Missing required fields: productName, customer, total' },
        { status: 400 }
      )
    }

    const orderId = await createOrder(orderData)
    return NextResponse.json({ id: orderId, ...orderData }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// PUT /api/orders - Update an order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, ...updates } = body as Partial<Order> & { id?: string; status?: Order['status'] }

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    if (status) {
      await updateOrderStatus(id, status)
      return NextResponse.json({ id, status })
    }

    await updateOrder(id, updates)
    return NextResponse.json({ id, ...updates })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE /api/orders - Delete an order
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    await deleteOrder(id)
    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Failed to delete order', message: (error as Error).message },
      { status: 500 }
    )
  }
}
