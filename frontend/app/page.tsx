"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Lock, Mail, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-foreground rounded-md flex items-center justify-center">
            <Mail className="text-background w-4 h-4" />
          </div>
          <span className="font-bold text-xl tracking-tight">SendLiberty</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="hover:opacity-60 transition-opacity">Features</Link>
          <Link href="#docs" className="hover:opacity-60 transition-opacity">Docs</Link>
          <Link href="#pricing" className="hover:opacity-60 transition-opacity">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:opacity-60 transition-opacity hidden md:block">
            Log In
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-md font-bold px-6">Dashboard</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs font-semibold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            Gmail OAuth Email Relay API
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.05]">
            Send emails. <br />
            Zero SMTP headaches.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Connect your Gmail via OAuth2. Get an API key. Send transactional emails instantly without configuring SMTP ports or storing passwords.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-md h-14 px-8 text-base font-bold flex items-center gap-2 group">
                Start Building Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#docs">
              <Button size="lg" variant="outline" className="rounded-md h-14 px-8 text-base font-bold">
                Read the Docs
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Code Snippet Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-24 w-full max-w-3xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden relative text-left"
        >
          <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
            </div>
            <div className="ml-4 text-xs font-mono text-muted-foreground">send-email.ts</div>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
            <span className="text-muted-foreground">import</span> SamuelMail <span className="text-muted-foreground">from</span> "samuelmail";<br/><br/>
            <span className="text-muted-foreground">const</span> mailer = <span className="text-muted-foreground">new</span> SamuelMail({'{'}<br/>
            &nbsp;&nbsp;auth: {'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;apiKey: <span className="text-foreground font-semibold">"sk_live_x8f92j..."</span><br/>
            &nbsp;&nbsp;{'}'},<br/>
            &nbsp;&nbsp;service: <span className="text-foreground font-semibold">"gmail"</span><br/>
            {'}'});<br/><br/>
            <span className="text-muted-foreground">await</span> mailer.send({'{'}<br/>
            &nbsp;&nbsp;to: <span className="text-foreground font-semibold">"user@example.com"</span>,<br/>
            &nbsp;&nbsp;subject: <span className="text-foreground font-semibold">"Welcome aboard!"</span>,<br/>
            &nbsp;&nbsp;html: <span className="text-foreground font-semibold">"&lt;p&gt;You're securely connected.&lt;/p&gt;"</span><br/>
            {'}'});
          </div>
        </motion.div>
      </main>

      {/* Features Showcase */}
      <section id="features" className="py-24 px-6 border-t border-border/40 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Secure by design.<br/>Developer focused.</h2>
            <p className="text-muted-foreground text-lg max-w-xl">We handle the OAuth refresh tokens. You just use your API key. Setup takes less than 2 minutes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-foreground text-background rounded-md flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">No Passwords Stored</h3>
              <p className="text-muted-foreground leading-relaxed">Everything works via Gmail OAuth2. We never see or store your Google password.</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-foreground text-background rounded-md flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Simple SDK</h3>
              <p className="text-muted-foreground leading-relaxed">Familiar Nodemailer-style syntax. Just pass your API key and start sending.</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-foreground text-background rounded-md flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">No SMTP Ports</h3>
              <p className="text-muted-foreground leading-relaxed">Bypass strict firewall rules. SendLiberty uses standard HTTP endpoints to relay your email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} SendLiberty. All rights reserved.</p>
      </footer>
    </div>
  );
}
