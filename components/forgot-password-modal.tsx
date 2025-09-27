"use client"

import type React from "react"

import { useState } from "react"
import { SimpleModal } from "@/components/simple-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { authService } from "@/lib/auth"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await authService.forgotPassword(email)
      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || "Failed to send reset email")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setError("")
    setIsSuccess(false)
    onClose()
  }

  return (
    <SimpleModal isOpen={isOpen} onClose={handleClose} title={isSuccess ? "Check Your Email" : "Forgot Password"}>
      <div className="max-w-md bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl rounded-3xl p-6">
        <div className="text-center pb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {isSuccess ? "Check Your Email" : "Forgot Password"}
          </h2>
          <p className="text-gray-600">
            {isSuccess
              ? "We've sent password reset instructions to your email"
              : "Enter your email address and we'll send you a link to reset your password"}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-700 mb-2">Password reset instructions sent!</p>
              <p className="text-sm text-gray-500">
                Check your email inbox and follow the instructions to reset your password.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="forgot-email" className="text-sm font-semibold text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-lg pl-12"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Send Reset Link</span>
                  </div>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full h-12 hover:bg-gray-50 bg-white/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </SimpleModal>
  )
}
