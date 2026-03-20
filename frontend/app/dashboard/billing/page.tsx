"use client";

import { CreditCard, Check, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/useAuth";
import { useCreditPackages, useInitializePayment, useVerifyPayment } from "@/hooks/usePayments";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";

export default function BillingPage() {
  const { data: user, isLoading, refetch } = useMe();
  const { data: packages, isLoading: isLoadingPackages } = useCreditPackages();
  const { mutate: initializePayment, isPending: isInitializing } = useInitializePayment();
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();
  const [showPackages, setShowPackages] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const router = useRouter();
  const searchParams = useSearchParams();

  const creditPercentage = user ? Math.min(100, (user.credits / user.monthly_limit) * 100) : 0;

  useEffect(() => {
    const reference = searchParams.get("reference");
    
    if (reference && verificationStatus === "idle") {
      setVerificationStatus("verifying");
      
      verifyPayment(reference, {
        onSuccess: () => {
          setVerificationStatus("success");
          refetch();
          setTimeout(() => {
            router.replace("/dashboard/billing");
            setVerificationStatus("idle");
          }, 2000);
        },
        onError: () => {
          setVerificationStatus("error");
          setTimeout(() => {
            router.replace("/dashboard/billing");
            setVerificationStatus("idle");
          }, 3000);
        },
      });
    }
  }, [searchParams, verifyPayment, refetch, router, verificationStatus]);

  const handleBuyCredits = (pkg: any) => {
    setSelectedPackage(pkg);
    initializePayment(pkg.id, {
      onSuccess: (data) => {
        window.location.href = data.authorization_url;
      },
    });
  };

  if (verificationStatus === "verifying") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Verifying Payment...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground">Your emails have been added to your account</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold">Payment Verification Failed</h2>
          <p className="text-muted-foreground">Please contact support if you were charged</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Emails</h1>
        <p className="text-muted-foreground mt-1">
          Buy emails once and use them anytime. No subscriptions, no expiry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
          
          {isLoading ? (
            <div className="space-y-4 mb-6">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Buy emails once, use anytime</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No monthly subscriptions</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Emails never expire</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Gmail: 500/day • SMTP: Unlimited</span>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2 mb-2 overflow-hidden shadow-inner">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${creditPercentage}%` }}></div>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                {user?.credits || 0} emails available
              </p>
            </>
          )}
          
          <Button 
            className="w-full font-semibold shadow-md" 
            onClick={() => setShowPackages(true)}
            disabled={isInitializing}
          >
            <Zap className="w-4 h-4 mr-2" />
            Buy More Emails
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-foreground text-lg mb-4">How It Works</h3>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Choose a Package</h4>
                <p>Select how many emails you need. Larger packages offer better value.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Pay Once</h4>
                <p>Complete your payment securely via Paystack. We accept cards and bank transfers.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Use Anytime</h4>
                <p>Your emails are added instantly and never expire. Use them whenever you need.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPackages} onOpenChange={setShowPackages}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose Your Email Package</DialogTitle>
            <DialogDescription>
              One-time payment. Emails never expire. Use them at your own pace.
            </DialogDescription>
          </DialogHeader>
          {isLoadingPackages ? (
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {packages?.map((pkg) => (
                <div
                  key={pkg.id}
                  className="rounded-lg border-2 border-border bg-card p-4 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => handleBuyCredits(pkg)}
                >
                  <div className="text-center">
                    <div className="text-3xl font-black text-primary mb-1">{pkg.credits.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mb-3">Emails</div>
                    <div className="text-2xl font-bold mb-1">₦{pkg.amountNGN.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mb-4">One-time payment</div>
                    <Button className="w-full" size="sm" disabled={isInitializing}>
                      {isInitializing && selectedPackage?.id === pkg.id ? "Processing..." : "Buy Now"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
