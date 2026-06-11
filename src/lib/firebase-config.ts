"use client"

// Firebase configuration for local development
// This file provides a complete mock implementation for Firebase services

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth, type User as FBUser } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import type { User } from "@/types"

// Mock Firebase configuration
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCuxoy9erTCoB_QYARF724PC513tDWL8jQ",
  authDomain: "automation-copilot-62b12.firebaseapp.com",
  projectId: "automation-copilot-62b12",
  storageBucket: "automation-copilot-62b12.firebasestorage.app",
  messagingSenderId: "140344348376",
  appId: "1:140344348376:web:8ff56d66a593eaf6ec11ad",
}

// Mock Firebase services
let fbApp: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let mockUsers: Record<string, User> = {}
let mockAuthStateChangeListeners: ((user: User | null) => void)[] = []
let currentMockUser: User | null = null

// Initialize Firebase mock
export function initializeFirebaseMock() {
  if (!getApps().length) {
    // Initialize Firebase app with mock config
    fbApp = initializeApp(FIREBASE_CONFIG)
    db = getFirestore(fbApp)
    auth = getAuth(fbApp)
  }
}

// Mock Firebase functions
export function isFirebaseAuthConfigured(): boolean {
  return true
}

export function getAuthInstance(): Auth {
  initializeFirebaseMock()
  return auth!
}

export function getFirestoreClient(): Firestore | null {
  initializeFirebaseMock()
  return db
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  // Add listener
  mockAuthStateChangeListeners.push(callback)

  // Check current state
  callback(currentMockUser)

  // Return cleanup function
  return () => {
    mockAuthStateChangeListeners = mockAuthStateChangeListeners.filter(listener => listener !== callback)
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  console.log(`[Firebase] Signing in with email: ${email}`)

  // Create mock user
  const mockUser = {
    uid: `user-${Date.now()}`,
    displayName: "Mock User",
    email,
    emailVerified: true,
    metadata: { creationTime: Date.now().toString() }
  }

  // Store the user
  mockUsers[email] = {
    id: mockUser.uid,
    name: mockUser.displayName,
    email: mockUser.email,
    avatar: `https://i.pravatar.cc/80?u=${mockUser.uid}`,
    plan: "free",
    createdAt: new Date(mockUser.metadata.creationTime).toISOString().split("T")[0],
    isOnboarded: false
  }

  // Update auth state
  currentMockUser = mockUsers[email]
  mockAuthStateChangeListeners.forEach(listener => listener(mockUsers[email]))

  return mockUsers[email]
}

export async function signUp(email: string, password: string, displayName?: string): Promise<User> {
  console.log(`[Firebase] Signing up with email: ${email}`)

  // Create mock user
  const mockUser = {
    uid: `user-${Date.now()}`,
    displayName: displayName || "New User",
    email,
    emailVerified: false,
    metadata: { creationTime: Date.now().toString() }
  }

  // Store the user
  mockUsers[email] = {
    id: mockUser.uid,
    name: mockUser.displayName,
    email: mockUser.email,
    avatar: `https://i.pravatar.cc/80?u=${mockUser.uid}`,
    plan: "free",
    createdAt: new Date(mockUser.metadata.creationTime).toISOString().split("T")[0],
    isOnboarded: false
  }

  // Update auth state
  currentMockUser = mockUsers[email]
  mockAuthStateChangeListeners.forEach(listener => listener(mockUsers[email]))

  return mockUsers[email]
}

export async function signOut(): Promise<void> {
  console.log("[Firebase] Signing out")
  currentMockUser = null
  mockAuthStateChangeListeners.forEach(listener => listener(null))
}

export async function updateAuthProfile(data: { displayName?: string, photoURL?: string }): Promise<User> {
  if (!currentMockUser) throw new Error("No authenticated user")

  const email = currentMockUser.email
  if (!email) throw new Error("No email found for current user")

  const user = mockUsers[email]
  if (!user) throw new Error("User not found")

  if (data.displayName) user.name = data.displayName
  if (data.photoURL) user.avatar = data.photoURL

  return user
}

export async function sendVerification(): Promise<void> {
  console.log("[Firebase] Sending verification email")
}

export async function resetPassword(email: string): Promise<void> {
  console.log(`[Firebase] Sending password reset email to: ${email}`)
}

// Initialize Firebase mock on client side
if (typeof window !== "undefined") {
  initializeFirebaseMock()
}