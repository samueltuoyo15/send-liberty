"use client";

import { FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Logs</h1>
          <p className="text-muted-foreground mt-1">
            View the recent history of all emails sent via your API keys.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border rounded-md px-3 h-10 shadow-sm w-full sm:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input 
            className="bg-transparent border-none outline-none text-sm px-2 placeholder:text-muted-foreground w-full sm:w-64" 
            placeholder="Search by recipient or subject..." 
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-4">To / Subject</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-semibold text-foreground">hello@startup.com</div>
                <div className="text-muted-foreground text-xs mt-0.5 mt-1">Welcome to our platform!</div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border bg-background shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Delivered
                </span>
              </td>
              <td className="px-6 py-4 text-right text-muted-foreground">Today, 10:24 AM</td>
            </tr>
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-semibold text-foreground">admin@corp.inc</div>
                <div className="text-muted-foreground text-xs mt-0.5 mt-1">Weekly Report</div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-border bg-background shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Delivered
                </span>
              </td>
              <td className="px-6 py-4 text-right text-muted-foreground">Yesterday, 3:12 PM</td>
            </tr>
            <tr className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-semibold text-foreground">user@invalid.domain</div>
                <div className="text-muted-foreground text-xs mt-0.5 mt-1">Password Reset</div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-destructive/20 bg-destructive/10 text-destructive shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>
                  Failed
                </span>
              </td>
              <td className="px-6 py-4 text-right text-muted-foreground">Mar 10, 11:30 AM</td>
            </tr>
          </tbody>
        </table>
        <div className="p-4 border-t border-border flex justify-between items-center bg-muted/20">
          <span className="text-sm text-muted-foreground">Showing 3 results</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
