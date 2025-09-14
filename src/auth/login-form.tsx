"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Github, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Login attempt:", { email, password })
    setIsLoading(false)
  }

  const handleGithubLogin = async () => {
    setIsLoading(true)

    // Simulate GitHub OAuth
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("GitHub login attempt")
    setIsLoading(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight p-4">Iniciar sesión</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Ingresa tu email y contraseña para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full bg-transparent"
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          Continuar con GitHub
        </Button>

        <div className="text-center text-xs text-muted-foreground">
          Al hacer clic en continuar, aceptas nuestros{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Términos de Servicio
          </a>{" "}
          y{" "}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Política de Privacidad
          </a>
          .
        </div>
      </CardContent>
    </Card>
  )
}
