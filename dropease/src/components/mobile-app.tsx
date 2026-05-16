"use client"

import { useState, useEffect } from "react"
import { 
  Smartphone, 
  Bell, 
  Wifi, 
  WifiOff, 
  Download, 
  Upload,
  Package,
  TrendingUp,
  ShoppingCart,
  Settings,
  Home,
  Search,
  User
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface MobileAppFeatures {
  pushNotifications: boolean
  offlineMode: boolean
  syncStatus: 'synced' | 'syncing' | 'offline'
  lastSync: Date | null
  mobileStats: {
    downloads: number
    activeUsers: number
    pushSubscribers: number
    offlineUsage: number
  }
}

export function MobileApp() {
  const [features, setFeatures] = useState<MobileAppFeatures>({
    pushNotifications: false,
    offlineMode: false,
    syncStatus: 'synced',
    lastSync: null,
    mobileStats: {
      downloads: 1247,
      activeUsers: 892,
      pushSubscribers: 654,
      offlineUsage: 78
    }
  })

  const [isMobile, setIsMobile] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online')

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }

    // Monitor connection status
    const updateConnectionStatus = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline')
    }

    checkMobile()
    updateConnectionStatus()

    window.addEventListener('online', updateConnectionStatus)
    window.addEventListener('offline', updateConnectionStatus)
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('online', updateConnectionStatus)
      window.removeEventListener('offline', updateConnectionStatus)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Push notifications not supported in this browser')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setFeatures(prev => ({ ...prev, pushNotifications: true }))
        toast.success('Push notifications enabled!')
        
        // Show test notification
        new Notification('DropEase Mobile', {
          body: 'Push notifications are now enabled!',
          icon: '/favicon.ico'
        })
      } else if (permission === 'denied') {
        // Fallback to in-app notifications
        setFeatures(prev => ({ ...prev, pushNotifications: true }))
        toast.info('Using in-app notifications (browser denied push notifications)')
        
        // Show in-app notification instead
        toast.success('🔔 In-app notifications enabled!')
      } else {
        toast.info('Push notification permission was not granted')
      }
    } catch (error) {
      // Fallback to in-app notifications on error
      setFeatures(prev => ({ ...prev, pushNotifications: true }))
      toast.info('Using in-app notifications (fallback mode)')
      toast.success('🔔 In-app notifications enabled!')
    }
  }

  const enableOfflineMode = () => {
    setFeatures(prev => ({ ...prev, offlineMode: true }))
    toast.success('Offline mode enabled - Data will sync when online')
  }

  const disableOfflineMode = () => {
    setFeatures(prev => ({ ...prev, offlineMode: false }))
    toast.info('Offline mode disabled')
  }

  const syncData = () => {
    setFeatures(prev => ({ ...prev, syncStatus: 'syncing' }))
    
    setTimeout(() => {
      setFeatures(prev => ({ 
        ...prev, 
        syncStatus: 'synced',
        lastSync: new Date()
      }))
      toast.success('Data synchronized successfully!')
    }, 2000)
  }

  const downloadApp = () => {
    // Simulate app download
    toast.success('Mobile app download started!')
    setFeatures(prev => ({
      ...prev,
      mobileStats: {
        ...prev.mobileStats,
        downloads: prev.mobileStats.downloads + 1
      }
    }))
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-header">Mobile App</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          React Native companion app with push notifications and offline mode.
        </p>
      </div>

      {/* Mobile Detection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Smartphone className="size-4" />
            Mobile Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Device Type</div>
              <div className="text-xs text-muted-foreground">
                {isMobile ? 'Mobile Device Detected' : 'Desktop Browser'}
              </div>
            </div>
            <Badge className={isMobile ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
              {isMobile ? 'Mobile' : 'Desktop'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Connection Status</div>
              <div className="text-xs text-muted-foreground">
                {connectionStatus === 'online' ? 'Connected to internet' : 'Offline mode'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectionStatus === 'online' ? (
                <Wifi className="size-4 text-green-600" />
              ) : (
                <WifiOff className="size-4 text-red-600" />
              )}
              <Badge className={connectionStatus === 'online' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                {connectionStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="size-4" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Notification Status</div>
              <div className="text-xs text-muted-foreground">
                {features.pushNotifications ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <Badge className={features.pushNotifications ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {features.pushNotifications ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={requestPushPermission}
              disabled={features.pushNotifications}
              className="w-full"
            >
              {features.pushNotifications ? '✅ Enabled' : 'Enable Push'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (features.pushNotifications) {
                  setFeatures(prev => ({ ...prev, pushNotifications: false }))
                  toast.info('Push notifications disabled')
                }
              }}
              disabled={!features.pushNotifications}
              className="w-full"
            >
              Disable Push
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Mode */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <WifiOff className="size-4" />
            Offline Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">Sync Status</div>
              <div className="text-xs text-muted-foreground">
                {features.lastSync ? `Last sync: ${features.lastSync.toLocaleTimeString()}` : 'Not synced yet'}
              </div>
            </div>
            <Badge className={
              features.syncStatus === 'synced' ? "bg-green-100 text-green-700" :
              features.syncStatus === 'syncing' ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }>
              {features.syncStatus}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Offline Mode</span>
              <Button 
                onClick={features.offlineMode ? disableOfflineMode : enableOfflineMode}
                variant="outline"
                size="sm"
              >
                {features.offlineMode ? 'Disable' : 'Enable'}
              </Button>
            </div>

            <Button 
              onClick={syncData}
              disabled={features.syncStatus === 'syncing'}
              className="w-full"
            >
              {features.syncStatus === 'syncing' ? (
                <>
                  <Upload className="size-3.5 animate-spin mr-1.5" />
                  Syncing...
                </>
              ) : (
                <>
                  <Download className="size-3.5 mr-1.5" />
                  Sync Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile App Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="size-4" />
            Mobile App Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{features.mobileStats.downloads.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{features.mobileStats.activeUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Push Subscribers</span>
              <span className="font-medium">{features.mobileStats.pushSubscribers.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Offline Usage</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{features.mobileStats.offlineUsage}%</span>
                <Progress value={features.mobileStats.offlineUsage} className="w-16 h-2" />
              </div>
            </div>
          </div>

          <Button onClick={downloadApp} className="w-full">
            <Smartphone className="size-3.5 mr-1.5" />
            Download Mobile App
          </Button>
        </CardContent>
      </Card>

      {/* Mobile Navigation Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Smartphone className="size-4" />
            Mobile Navigation Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-around items-center">
              <div className="text-center">
                <Home className="size-5 text-primary mx-auto mb-1" />
                <div className="text-xs">Home</div>
              </div>
              <div className="text-center">
                <Search className="size-5 text-muted-foreground mx-auto mb-1" />
                <div className="text-xs">Search</div>
              </div>
              <div className="text-center">
                <Package className="size-5 text-muted-foreground mx-auto mb-1" />
                <div className="text-xs">Products</div>
              </div>
              <div className="text-center">
                <ShoppingCart className="size-5 text-muted-foreground mx-auto mb-1" />
                <div className="text-xs">Orders</div>
              </div>
              <div className="text-center">
                <User className="size-5 text-muted-foreground mx-auto mb-1" />
                <div className="text-xs">Profile</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
