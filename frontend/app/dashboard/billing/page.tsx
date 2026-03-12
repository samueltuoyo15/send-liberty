"use client";

import { CreditCard, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Credits</h1>
        <p className="text-muted-foreground mt-1">
          Manage your credit balance and payment methods.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Current Plan */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Pay As You Go</h3>
              <p className="text-muted-foreground text-sm">Active</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>Purchase credits anytime</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>1 Gmail Account</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>Standard Support</span>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-2 overflow-hidden shadow-inner">
            <div className="bg-primary h-2 rounded-full" style={{ width: "71%" }}></div>
          </div>
          <p className="text-xs text-muted-foreground mb-6">142 credits out of 200 remaining</p>
          
          <Button className="w-full font-semibold shadow-md">Buy More Credits</Button>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground text-lg mb-4">Payment Methods</h3>
          <p className="text-muted-foreground text-sm mb-6">You currently have no payment methods saved. Add one to top up credits seamlessly.</p>
          <Button variant="outline" className="w-full">Add Payment Method</Button>
        </div>
      </div>
    </div>
  );
}
