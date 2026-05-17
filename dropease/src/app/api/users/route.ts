import { NextRequest, NextResponse } from 'next/server'
import {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  updateUserPlan,
  markUserAsOnboarded,
  getProUsers,
  getFreeUsers,
  getOnboardedUsers
} from '@/lib/services/users-service'
import type { User } from '@/types'

// GET /api/users - Get all users or filtered users
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const plan = searchParams.get('plan')
    const onboarded = searchParams.get('onboarded')
    const id = searchParams.get('id')

    if (id) {
      const user = await getUserById(id)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json(user)
    }

    if (email) {
      const user = await getUserByEmail(email)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json(user)
    }

    if (plan === 'pro') {
      const users = await getProUsers()
      return NextResponse.json(users)
    }

    if (plan === 'free') {
      const users = await getFreeUsers()
      return NextResponse.json(users)
    }

    if (onboarded === 'true') {
      const users = await getOnboardedUsers()
      return NextResponse.json(users)
    }

    const users = await getUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...userData } = body as User

    // Validate required fields
    if (!userData.name || !userData.email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email' },
        { status: 400 }
      )
    }

    const userId = await createUser(userData)
    return NextResponse.json({ id: userId, ...userData }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update a user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, plan, onboarded, ...updates } = body as Partial<User> & { id?: string; plan?: User['plan']; onboarded?: boolean }

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (plan) {
      await updateUserPlan(id, plan)
      return NextResponse.json({ id, plan })
    }

    if (onboarded === true) {
      await markUserAsOnboarded(id)
      return NextResponse.json({ id, isOnboarded: true })
    }

    await updateUser(id, updates)
    return NextResponse.json({ id, ...updates })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user', message: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE /api/users - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await deleteUser(id)
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user', message: (error as Error).message },
      { status: 500 }
    )
  }
}
