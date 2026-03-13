import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  const handleLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm p-8 rounded-2xl border border-border bg-card shadow-xl text-center space-y-8">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-foreground text-background rounded-xl mx-auto flex items-center justify-center mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-6 h-6"
            >
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to SendLiberty</h1>
          <p className="text-muted-foreground text-sm font-medium">Log in to manage your email relay service</p>
        </div>

        <Button 
          onClick={handleLogin}
          size="lg" 
          className="w-full font-bold h-12 flex items-center justify-center gap-2"
        >
          <Github className="w-5 h-5 fill-current" />
          Continue with GitHub
        </Button>

        <p className="text-xs text-muted-foreground font-medium">
          By clicking continue, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
