"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Lock, Mail, Play, Zap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans text-slate-900 bg-gradient-to-br from-[#fcfcfa] via-[#fafaf8] to-[#f4f7fa] overflow-x-hidden selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-16 md:py-8 max-w-[1400px] w-full mx-auto relative z-20">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-md overflow-hidden">
            <img src="/logo.png" alt="SendLiberty" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold tracking-[-0.04em] text-2xl uppercase">SendLiberty</span>
        </Link>
        <div className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-slate-600">
          <Link href="#features" className="hover:text-black transition-colors">Features</Link>
          <Link href="/docs" className="hover:text-black transition-colors">Documentation</Link>
          <Link href="/dashboard/billing" className="hover:text-black transition-colors">Pricing</Link>
          <a href="mailto:support@sendliberty.com" className="hover:text-black transition-colors">Support</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:flex items-center justify-center font-bold px-5 py-2.5 border-2 border-transparent hover:border-slate-200 rounded-lg transition-all text-[15px]">
            Log In
          </Link>
          <Link href="/dashboard">
            <Button className="rounded-md font-bold text-[15px] h-11 px-6 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.1)] hover:bg-slate-800 transition-all border border-slate-900 bg-slate-900 text-white">
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 pt-12 pb-24 md:pt-20 md:pb-32 relative z-10 flex flex-col lg:flex-row items-center gap-16">

        {/* Left Content */}
        <div className="w-full lg:w-1/2 relative space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="absolute -top-16 -left-8 md:-top-24 md:-left-12 pointer-events-none"
          >
            <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-300 opacity-60">
              <path d="M10 80C10 80 25 30 65 30C105 30 110 50 110 50M110 50L95 40M110 50L95 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          {/* Background blurred glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-yellow-200/40 via-blue-200/40 to-pink-200/40 blur-[80px] rounded-full -z-10" />

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[3.5rem] md:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-[-0.04em] leading-[0.95]"
          >
            Email relay <br />
            <span className="text-slate-700">easier and</span> <br />
            faster.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-6"
          >
            <div>
              <h3 className="text-3xl font-bold tracking-tight">500+</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Emails Sent Daily</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight">100%</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">OAuth Secure</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 max-w-lg"
          >
            <div className="flex items-center text-sm font-bold uppercase tracking-widest text-slate-600 gap-2 mb-2">
              <span className="uppercase tracking-widest">DEVELOPER SUCCESS</span>
              <span className="text-pink-500 text-lg">✻</span>
            </div>

            <p className="text-[17px] leading-relaxed text-slate-600 font-medium font-sans">
              The ultimate feature-rich Resend alternative. Don't let Render, Railway free tiers stop you from adding email support to your applications. Connect your Gmail via OAuth, skip the SMTP nightmare, and send batch or scheduled emails instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-md h-[52px] px-8 text-[15px] font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.1)] transition-all bg-white text-black border-2 border-slate-200 hover:bg-slate-50">
                  Try for free
                </Button>
              </Link>

              <Link href="/docs" className="flex items-center gap-3 font-semibold text-slate-700 hover:text-black transition-colors">
                <div className="w-[52px] h-[52px] rounded-full border-2 border-slate-200 flex items-center justify-center bg-white shadow-sm hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                How it works
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Content (Visuals & Code) */}
        <div className="w-full lg:w-1/2 relative min-h-[500px] md:min-h-[600px] flex items-center justify-center">

          {/* Decorative Floaties */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute z-20 top-[10%] left-[0%]">
            <div className="w-14 h-14 rounded-full bg-[#E5E9F4] border-2 border-slate-900 shadow-[3px_3px_0px_rgba(0,0,0,0.1)] flex items-center justify-center transform -rotate-12">
              <Mail className="w-6 h-6 text-slate-700" />
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} className="absolute z-20 top-[40%] right-[0%]">
            <div className="w-16 h-16 rounded-full bg-[#EAF5E5] border-2 border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] flex items-center justify-center transform rotate-12">
              <span className="font-bold text-xl text-green-700">@</span>
            </div>
          </motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }} className="absolute z-20 bottom-[10%] left-[10%]">
            <div className="w-12 h-12 rounded-full bg-[#F5E5EC] border-2 border-slate-900 shadow-[3px_3px_0px_rgba(0,0,0,0.1)] flex items-center justify-center transform rotate-6">
              <Zap className="w-5 h-5 text-pink-500 fill-pink-500" />
            </div>
          </motion.div>


          {/* Big Code Window in Front */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-full max-w-[500px] bg-[#0E1526] rounded-xl border border-slate-700 shadow-2xl p-6 relative z-30 mx-auto hidden md:block"
          >
            <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
            </div>

            <div className="font-mono text-[14px] leading-loose text-slate-300">
              <span className="text-pink-400">import</span> {'{'} SendLiberty {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">"@send-liberty/sdk"</span>;<br /><br />
              <span className="text-pink-400">const</span> client = <span className="text-pink-400">new</span> <span className="text-yellow-200">SendLiberty</span>(<span className="text-slate-500">process.env.SL_API_KEY</span>);<br /><br />
              <span className="text-slate-500">// Easily send bulk personalized emails in the background</span><br />
              <span className="text-pink-400">await</span> client.<span className="text-blue-300">sendBatch</span>({'{'}<br />
              &nbsp;&nbsp;recipients: users.<span className="text-blue-300">map</span>(<span className="text-orange-300">u</span> ={'>'} ({'{'}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;to: u.<span className="text-blue-200">email</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;subject: <span className="text-green-300">`Hey ${'{'}u.<span className="text-blue-200">name</span>{'}'}!`</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;html: <span className="text-green-300">`&lt;p&gt;Check this out!&lt;/p&gt;`</span><br />
              &nbsp;&nbsp;{'}'})),<br />
              &nbsp;&nbsp;batchSize: <span className="text-purple-400">100</span><br />
              {'}'});
            </div>
          </motion.div>

        </div>
      </main>

      {/* Trust & Features Section */}
      <section id="features" className="py-24 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto text-center md:text-left">
          <div className="flex flex-col md:flex-row gap-16 md:gap-8 items-center justify-between">
            <div className="w-full md:w-[45%]">
              <h2 className="text-4xl md:text-[3.5rem] font-bold tracking-tight mb-6 leading-none">
                Zero SMTP.<br />100% Secure.
              </h2>
              <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg mx-auto md:mx-0">
                You never give us your Google password. SendLiberty uses strict OAuth2 tokens to relay messages through your own Gmail safely and efficiently.
              </p>
            </div>

            <div className="w-full md:w-[50%] grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'The Resend Alternative', icon: Lock, desc: 'Why pay for complex enterprise email sending when you can just link your own Google Workspace and get more features out of the box?' },
                { title: 'TypeScript SDK', icon: Code2, desc: 'Strictly typed package for Node.js edge functions, and lambda environments. Easy drop-in replacement.' },
                { title: 'Built-in Queue (No BullMQ)', icon: Zap, desc: 'Schedule emails and queue thousands of batch messages in the background automatically. No Redis, no external workers needed.' },
                { title: 'Instant Setup', icon: CheckCircle2, desc: 'Click "Sign in with Google", get your access key, and start routing immediately without DNS verification.' },
              ].map((f, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl text-left hover:shadow-lg transition-transform hover:-translate-y-1">
                  <div className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-lg flex items-center justify-center mb-4 text-slate-800">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[17px] mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-slate-50 text-center font-medium text-slate-400">
        <p>© {new Date().getFullYear()} SendLiberty. All rights reserved.</p>
      </footer>
    </div>
  );
}
