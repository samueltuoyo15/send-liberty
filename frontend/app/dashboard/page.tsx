"use client";

import { motion } from "framer-motion";
import { 
  Key, 
  Mail, 
  FileText,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const emailLogs = [
    { id: "msg_1A2b3C", to: "hello@startup.com", subject: "Welcome to our platform!", status: "Delivered", date: "Today, 10:24 AM" },
    { id: "msg_9X8y7Z", to: "admin@corp.inc", subject: "Weekly Report", status: "Delivered", date: "Yesterday, 3:12 PM" },
    { id: "msg_4M5n6P", to: "user@invalid.domain", subject: "Password Reset", status: "Failed", date: "Mar 10, 11:30 AM" },
    { id: "msg_2Q3r4S", to: "contact@agency.co", subject: "New Lead Notification", status: "Delivered", date: "Mar 09, 8:00 AM" },
    { id: "msg_7T8u9V", to: "support@app.io", subject: "Ticket #9921 Created", status: "Delivered", date: "Mar 08, 10:00 AM" },
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Welcome & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
          <p className="text-muted-foreground font-medium">Your API relay service is active and running.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Button className="rounded-md shadow-md font-bold group">
            <Mail className="w-4 h-4 mr-2" />
            Connect Gmail
          </Button>
          <Button variant="secondary" className="rounded-md shadow-sm font-bold border border-border">
            <Key className="w-4 h-4 mr-2" />
            Generate Key
          </Button>
        </motion.div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-1"
        >
          <Card className="h-full border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-muted-foreground">Credit Balance</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter text-primary">142 <span className="text-lg text-muted-foreground font-semibold">credits</span></div>
              <div className="pt-4">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: '71%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Pay as you go • No expiration</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full border-border bg-card shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-muted-foreground">Active API Keys</CardTitle>
              <Key className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter">2</div>
              <p className="text-sm text-muted-foreground mt-3 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-foreground" /> All keys are active
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="h-full border-border bg-card shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-muted-foreground">Connected Gmails</CardTitle>
              <Mail className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black tracking-tighter">1</div>
              <p className="text-sm text-muted-foreground mt-3 font-medium font-mono">
                dev@start...com
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Logs List */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="lg:col-span-2"
        >
          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-bold">Recent Email Logs</CardTitle>
              <Button variant="ghost" size="sm" className="font-semibold h-8 w-8 p-0">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50 border-y border-border">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-bold pl-6">To / Subject</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                    <TableHead className="font-bold text-right pr-6">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailLogs.map((log) => (
                    <TableRow key={log.id} className="border-border transition-colors hover:bg-muted/40 group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{log.to}</span>
                          <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{log.subject}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={log.status === "Delivered" ? "outline" : "secondary"} 
                          className={`
                            font-semibold rounded-md tracking-wider text-[10px] border-border
                            ${log.status === "Failed" ? "bg-destructive/10 text-destructive border-transparent" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"}
                          `}
                        >
                          {log.status === "Delivered" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {log.status === "Failed" && <XCircle className="w-3 h-3 mr-1" />}
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-medium text-right pr-6">
                        {log.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Widgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Setup Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-sm">Connect Gmail</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">Authorize your Google Workspace account.</p>
                </div>
              </div>
              <div className="relative pl-3 py-1">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-sm">Get API Key</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">Generate a secret key to authenticate your backend requests.</p>
                </div>
              </div>
              <div className="relative pl-3 py-1">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-border bg-card text-muted-foreground flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-sm">Install SDK</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">Use our NPM package to send emails seamlessly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
