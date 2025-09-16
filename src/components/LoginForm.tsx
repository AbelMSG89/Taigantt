"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Eye, EyeOff, AlertCircleIcon } from "lucide-react";
import { AuthService } from "@/features/auth/services/auth.service";
import type { LoginResponse } from "@/features/auth/models/auth.model";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import CenteredLayout from "@/layouts/CenteredLayout";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleUsernameLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await AuthService.normalLogin({
        username: username,
        password: password,
      });

      console.log("Successful login:", response);

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("GitHub login attempt");
    setIsLoading(false);
  };

  return (
    <CenteredLayout>
      <Card className="w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight p-4">
            Sign In
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your username and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleUsernameLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
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
            Continue with GitHub
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </div>
        </CardContent>
      </Card>
    </CenteredLayout>
  );
}
