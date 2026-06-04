"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, CheckCircle, AlertCircle, Copy, Download } from "lucide-react"
import { toast } from "sonner"
import { twoFactorService, passwordService, sessionService } from "@/lib/auth-service"

export function SecuritySettings() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [activeSessions, setActiveSessions] = useState<
    { sessionId: string; device: string; ipAddress: string; lastActivity: string }[]
  >([])

  const handleEnable2FA = async () => {
    setLoading(true)
    try {
      const { secret, qrCode } = await twoFactorService.generateSecret("user@example.com")
      // Show setup dialog with QR code and secret
      toast.success("2FA setup initiated! Scan the QR code with your authenticator app.")
    } catch (error) {
      toast.error("Failed to generate 2FA secret")
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    setLoading(true)
    try {
      await twoFactorService.disable2FA("user_id")
      setTwoFAEnabled(false)
      toast.success("2FA has been disabled")
    } catch (error) {
      toast.error("Failed to disable 2FA")
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSessions = async () => {
    setLoading(true)
    try {
      const sessions = await sessionService.getActiveSessions("user_id")
      setActiveSessions(sessions.map((s) => ({ sessionId: s.sessionId, device: s.device, ipAddress: s.ipAddress, lastActivity: s.lastActivity })))
    } catch (error) {
      toast.error("Failed to load sessions")
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    setLoading(true)
    try {
      await sessionService.revokeSession(sessionId)
      setActiveSessions(activeSessions.filter((s) => s.sessionId !== sessionId))
      toast.success("Session revoked")
    } catch (error) {
      toast.error("Failed to revoke session")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* 2FA Setup */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
          </div>
          {twoFAEnabled ? (
            <div className="flex items-center gap-2">
              <Badge className="bg-success-light text-success">Enabled</Badge>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>2FA Management</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription>2FA is currently enabled on your account</AlertDescription>
                    </Alert>
                    <div>
                      <p className="text-sm font-medium mb-2">Recovery Codes</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Save these codes in a safe place. Each code can be used once if you lose access to your authenticator.
                      </p>
                      <div className="bg-muted p-4 rounded font-mono text-xs space-y-2">
                        {backupCodes.length === 0 ? (
                          <p className="text-muted-foreground">No recovery codes generated</p>
                        ) : (
                          backupCodes.map((code, i) => (
                            <p key={i}>{code}</p>
                          ))
                        )}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDisable2FA}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Disabling..." : "Disable 2FA"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger
                render={
                  <Button onClick={handleEnable2FA} disabled={loading}>
                    {loading ? "Setting up..." : "Enable"}
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Up 2FA</DialogTitle>
                </DialogHeader>
                <TwoFASetup onConfirm={setTwoFAEnabled} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </Card>

      {/* Password Security */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Change Password</h3>
            <p className="text-sm text-muted-foreground">Update your password regularly</p>
          </div>
          <Dialog>
            <DialogTrigger
              render={
                <Button variant="outline">Change</Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <PasswordChangeForm />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Active Sessions</h3>
            <p className="text-sm text-muted-foreground">Manage your logged-in devices</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLoadSessions} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <div className="space-y-4">
          {activeSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions</p>
          ) : (
            activeSessions.map((session) => (
              <div key={session.sessionId} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{session.device}</p>
                  <p className="text-xs text-muted-foreground">IP: {session.ipAddress}</p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {new Date(session.lastActivity).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSession(session.sessionId)}
                  disabled={loading}
                >
                  Revoke
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Security Tips */}
      <Card className="p-6 bg-blue-50">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-sm mb-2">Security Best Practices</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Use a strong, unique password</li>
              <li>✓ Enable two-factor authentication</li>
              <li>✓ Review active sessions regularly</li>
              <li>✓ Never share your recovery codes</li>
              <li>✓ Update your password every 90 days</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

interface TwoFASetupProps {
  onConfirm: (enabled: boolean) => void
}

function TwoFASetup({ onConfirm }: TwoFASetupProps) {
  const [step, setStep] = useState<"qr" | "verify" | "backup">("qr")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])

  const handleVerify = async () => {
    setLoading(true)
    try {
      const isValid = await twoFactorService.verifyCode("secret", code)
      if (isValid) {
        const result = await twoFactorService.enable2FA("user_id", "secret")
        setBackupCodes(result.backup_codes)
        setStep("backup")
      } else {
        toast.error("Invalid code. Please try again.")
      }
    } catch (error) {
      toast.error("Verification failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {step === "qr" && (
        <>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator)
            </AlertDescription>
          </Alert>
          <div className="flex justify-center p-4 bg-muted rounded-lg">
            <div className="w-48 h-48 bg-card border border-border rounded-lg flex items-center justify-center">
              {/* QR Code would be rendered here */}
              <span className="text-sm text-muted-foreground">[QR Code]</span>
            </div>
          </div>
          <Button onClick={() => setStep("verify")} className="w-full">
            I've Scanned the QR Code
          </Button>
        </>
      )}

      {step === "verify" && (
        <>
          <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
          <Input
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />
          <Button onClick={handleVerify} disabled={code.length !== 6 || loading} className="w-full">
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </>
      )}

      {step === "backup" && (
        <>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>2FA enabled successfully!</AlertDescription>
          </Alert>
          <div>
            <p className="text-sm font-medium mb-2">Recovery Codes</p>
            <p className="text-xs text-muted-foreground mb-4">
              Save these codes in a safe place. You'll need them if you lose access to your authenticator.
            </p>
            <div className="bg-muted p-4 rounded font-mono text-xs space-y-2">
              {backupCodes.map((code, i) => (
                <p key={i}>{code}</p>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(backupCodes.join("\n"))}
              className="flex-1"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <Button
            onClick={() => {
              onConfirm(true)
            }}
            className="w-full"
          >
            Done
          </Button>
        </>
      )}
    </div>
  )
}

function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0)

  const handlePasswordChange = (value: string) => {
    setNewPassword(value)
    const { score } = passwordService.validatePasswordStrength(value)
    setStrength(score)
  }

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      // Simulate password change
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setStrength(0)
    } catch (error) {
      toast.error("Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      <Input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => handlePasswordChange(e.target.value)}
      />
      <div>
        <div className="flex gap-1 mb-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded ${i < strength ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Password strength: {["Very Weak", "Weak", "Fair", "Good", "Strong"][strength]}</p>
      </div>
      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading || !currentPassword || !newPassword || strength < 2} className="w-full">
        {loading ? "Changing..." : "Change Password"}
      </Button>
    </div>
  )
}
