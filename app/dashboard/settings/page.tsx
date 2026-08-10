"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon, PencilEdit01Icon, FloppyDiskIcon, Logout01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { Button } from "@/components/ui/button";
import { useMe, useUpdateProfile, useLogout } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { CreditCardIcon } from '@hugeicons/core-free-icons';

export default function SettingsPage() {
  const { data: user, isLoading } = useMe();
  const isPro = user?.plan === "pro";
  const isCanceled = user?.subscriptionStatus === "canceled";
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [editName, setEditName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [cancelSubConfirmOpen, setCancelSubConfirmOpen] = useState(false);
  const [isCancelingSub, setIsCancelingSub] = useState(false);
  const [isRedirectingCheckout, setIsRedirectingCheckout] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutId = urlParams.get("checkout_id");
      if (urlParams.get("billing") === "success") {
        toast.loading("Verifying payment with Bachs...", { id: "billing-verify" });
        fetch(`/api/billing/verify?checkout_id=${checkoutId || ""}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.verified) {
              toast.success("Payment verified! Your account has been upgraded to Pro.", { id: "billing-verify" });
              setTimeout(() => {
                window.location.href = "/dashboard/settings";
              }, 1000);
            } else {
              toast.info("Payment received! Updating account...", { id: "billing-verify" });
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          })
          .catch(() => {
            toast.dismiss("billing-verify");
          });
      } else if (urlParams.get("billing") === "cancel") {
        toast.info("Checkout canceled.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleBachsCheckout = async () => {
    setCurrencyModalOpen(true);
  };

  const processCheckout = async () => {
    try {
      setIsRedirectingCheckout(true);
      const res = await fetch("/api/billing/checkout", { method: "POST" });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Failed to initialize checkout session");
      }
    } catch {
      toast.error("Error creating checkout session");
    } finally {
      setIsRedirectingCheckout(false);
    }
  };

  const handleCurrencySubmit = () => {
    updateProfile(
      { billingCurrency: selectedCurrency },
      {
        onSuccess: () => {
          setCurrencyModalOpen(false);
          processCheckout();
        },
      }
    );
  };

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      return res.json();
    },
    onSuccess: () => {
      router.push("/");
    },
  });

  const handleEditClick = () => {
    setEditName(user?.displayName || "");
    setIsEditOpen(true);
  };

  const handleSave = () => {
    if (editName.length > 30 || !editName.trim()) return;
    updateProfile({ displayName: editName }, {
      onSuccess: () => {
        setIsEditOpen(false);
      }
    });
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline-md font-bold tracking-tight text-primary-sendlib">Settings</h1>
          <p className="text-secondary font-body-md mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        <Button 
          className="rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white shadow-sm transition-all active:scale-95 px-4 py-2 cursor-pointer"
          onClick={handleEditClick}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={16} color='currentColor' strokeWidth={1.5} />
          <span className="ml-2">Edit Profile</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile, Sign Out & Delete Account */}
        <div className="lg:col-span-6 space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border border-[#ebdcd0]/60 bg-[#f4ebe1]/35 shadow-none p-6">
            <div className="flex items-center gap-2 mb-4">
              <HugeiconsIcon icon={UserIcon} size={20} color='currentColor' strokeWidth={1.5} className="text-[#6d4d24]" />
              <h3 className="font-headline-md font-bold text-lg text-[#6d4d24]">Profile</h3>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full rounded-lg bg-[#ebdcd0]/35" />
                <Skeleton className="h-10 w-full rounded-lg bg-[#ebdcd0]/35" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-label-xs uppercase tracking-wider text-[#6d4d24]/80 mb-1.5 block font-semibold">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ""}
                    disabled
                    className="w-full rounded-lg border border-[#ebdcd0]/80 bg-white px-3.5 py-2.5 text-sm text-[#6d4d24] font-medium outline-none cursor-not-allowed opacity-80"
                  />
                </div>
                <div>
                  <label className="text-xs font-label-xs uppercase tracking-wider text-[#6d4d24]/80 mb-1.5 block font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full rounded-lg border border-[#ebdcd0]/80 bg-white px-3.5 py-2.5 text-sm text-[#6d4d24] font-medium outline-none cursor-not-allowed opacity-80"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Plan & Billing */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-xl border border-primary-sendlib/20 bg-primary-sendlib/[0.02] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CreditCardIcon} size={20} color='currentColor' strokeWidth={1.5} className="text-primary-sendlib" />
                <h3 className="font-headline-md font-bold text-lg text-primary-sendlib">Plan & Billing</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${isCanceled ? 'bg-destructive/80' : 'bg-primary-sendlib'}`}>
                {isPro ? (isCanceled ? "Pro Plan (Canceled)" : "Pro Plan Active") : "Free Plan"}
              </span>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-secondary leading-relaxed max-w-[600px] mb-4">
                {isPro
                  ? isCanceled 
                    ? "Your Pro Plan has been canceled and will not renew. You still have access to Pro features until the end of your billing cycle."
                    : "Your account is on the Pro Plan for just $3.99/month. You enjoy 300 req/min, up to 50 connected accounts, and 90 days of email log retention."
                  : "You are currently on the Free Plan. Upgrade to Pro for $3.99/month to unlock 300 req/min, up to 50 connected accounts, and 90 days of log retention."}
              </p>

              {!isPro ? (
                <Button
                  className="font-label-sm rounded-lg bg-primary-sendlib hover:bg-primary-sendlib/90 text-white cursor-pointer active:scale-95 transition-all shadow-sm disabled:opacity-50"
                  onClick={handleBachsCheckout}
                  disabled={isRedirectingCheckout}
                >
                  <HugeiconsIcon icon={CreditCardIcon} size={16} color='currentColor' strokeWidth={1.5} />
                  <span className="ml-2">
                    {isRedirectingCheckout ? "Initializing Bachs Checkout..." : "Upgrade to Pro ($3.99/mo)"}
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  {!isCanceled && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-bold cursor-pointer"
                      onClick={() => setCancelSubConfirmOpen(true)}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                  {user?.lastPaymentAt && (
                    <span className="text-xs font-medium text-secondary">
                      {isCanceled ? "Cancels on: " : "Renews on: "}
                      {new Date(new Date(user.lastPaymentAt).setMonth(new Date(user.lastPaymentAt).getMonth() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="grid grid-cols-1 gap-6">
            {/* Sign Out Card */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/[0.01] shadow-none p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HugeiconsIcon icon={Logout01Icon} size={18} color='currentColor' strokeWidth={1.5} className="text-destructive" />
                  <h3 className="font-headline-md font-bold text-base text-destructive">Sign Out</h3>
                </div>
                <p className="text-sm text-secondary leading-relaxed">
                  Sign out of your Sendlib account on this device.
                </p>
              </div>
              <Button 
                variant="destructive"
                size="sm"
                className="rounded-lg font-label-sm w-full sm:w-auto shrink-0 cursor-pointer"
                onClick={() => setSignOutConfirmOpen(true)}
              >
                Sign Out
              </Button>
            </div>

            {/* Delete Account Card */}
            <div className="rounded-xl border border-destructive/40 bg-destructive/[0.03] shadow-none p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <HugeiconsIcon icon={Delete02Icon} size={18} color='currentColor' strokeWidth={1.5} className="text-destructive" />
                  <h3 className="font-headline-md font-bold text-base text-destructive">Delete Account</h3>
                </div>
                <p className="text-sm text-secondary leading-relaxed">
                  Permanently delete account, keys & logs. Cannot be undone.
                </p>
              </div>
              <Button 
                variant="destructive"
                size="sm"
                className="rounded-lg font-label-sm w-full sm:w-auto shrink-0 cursor-pointer"
                onClick={() => setDeleteAccountOpen(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile & Preferences Slide-over Drawer */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent side="right">
          <SheetHeader className="p-0 mb-6">
            <SheetTitle className="text-xl font-headline-md font-bold text-primary-sendlib">Edit Profile</SheetTitle>
            <SheetDescription className="text-secondary text-sm">
              Update your display name below.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-label-sm font-semibold text-on-background mb-2 block">
                Display Name
              </label>
              <Input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-10 rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm focus-visible:border-primary-sendlib text-on-background font-medium"
              />
              <div className="flex justify-between mt-1.5 text-xs">
                <span className={editName.length > 30 ? "text-destructive font-bold" : "text-secondary font-medium"}>
                  {editName.length}/30 characters
                </span>
                {editName.length > 30 && (
                  <span className="text-destructive font-bold">Exceeds limit</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-label-sm font-semibold text-on-background mb-2 block">
                Email Address (Read-only)
              </label>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="h-10 rounded-lg border border-outline-variant bg-surface-container-low px-3 text-sm text-secondary cursor-not-allowed opacity-75"
              />
            </div>
          </div>
          <SheetFooter className="p-0 mt-6 pt-4 border-t border-outline-variant flex-row gap-3">
            <Button variant="outline" className="flex-1 rounded-lg font-label-sm border border-outline-variant" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1 rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white" onClick={handleSave} disabled={isUpdating || editName.length > 30 || !editName.trim()}>
              <HugeiconsIcon icon={FloppyDiskIcon} size={16} color='currentColor' strokeWidth={1.5} className="mr-2" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Sign Out Confirmation Dialog */}
      <Dialog open={signOutConfirmOpen} onOpenChange={setSignOutConfirmOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-destructive">Sign Out</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Are you sure you want to sign out of your Sendlib account? You will need to log in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low" 
              onClick={() => setSignOutConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-destructive hover:bg-destructive/90 text-white" 
              onClick={() => {
                setSignOutConfirmOpen(false);
                logout();
              }}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-destructive">Delete Account</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              This will permanently delete your Sendlib account and all associated data, including connected Gmail accounts, email logs, and API keys. This action is <strong>irreversible</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low" 
              onClick={() => setDeleteAccountOpen(false)}
              disabled={isDeletingAccount}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-destructive hover:bg-destructive/90 text-white" 
              onClick={() => deleteAccount()}
              disabled={isDeletingAccount}
            >
              {isDeletingAccount ? "Deleting..." : "Yes, Delete Everything"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog open={cancelSubConfirmOpen} onOpenChange={setCancelSubConfirmOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-destructive">Cancel Subscription</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              Are you sure you want to cancel your Pro subscription? You will lose access to Pro features at the end of your billing cycle.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low" 
              onClick={() => setCancelSubConfirmOpen(false)}
              disabled={isCancelingSub}
            >
              Keep Subscription
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-destructive hover:bg-destructive/90 text-white" 
              onClick={async () => {
                setIsCancelingSub(true);
                try {
                  const res = await fetch("/api/billing/cancel", { method: "POST" });
                  const data = await res.json();
                  if (data.success) {
                    import("sonner").then(m => m.toast.success("Subscription canceled."));
                    window.location.reload();
                  } else {
                    import("sonner").then(m => m.toast.error(data.message || "Failed to cancel"));
                  }
                } catch {
                  import("sonner").then(m => m.toast.error("Error canceling subscription"));
                } finally {
                  setIsCancelingSub(false);
                  setCancelSubConfirmOpen(false);
                }
              }}
              disabled={isCancelingSub}
            >
              {isCancelingSub ? "Canceling..." : "Cancel Subscription"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Currency / Location Dialog */}
      <Dialog open={currencyModalOpen} onOpenChange={setCurrencyModalOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-headline-md font-bold text-primary-sendlib">Select Currency</DialogTitle>
            <DialogDescription className="text-secondary text-sm leading-relaxed mt-1">
              What currency would you like to pay in? Select your preferred currency below.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <label className="text-xs font-label-xs uppercase tracking-wider text-on-background/60 mb-2 block font-semibold">
              Preferred Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm text-on-background font-medium outline-none cursor-pointer focus:border-primary-sendlib focus:ring-1 focus:ring-primary-sendlib/20 transition-colors appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
            >
              <option value="USD">USD</option>
              <option value="NGN" disabled className="text-gray-400">NGN - Coming Soon</option>
              <option value="GHS" disabled className="text-gray-400">GHS - Coming Soon</option>
            </select>
          </div>
          <div className="flex flex-row gap-3 mt-2 pt-4 border-t border-outline-variant/60">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg font-label-sm border border-outline-variant hover:bg-surface-container-low" 
              onClick={() => setCurrencyModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-lg font-label-sm bg-primary-sendlib hover:bg-primary-sendlib/90 text-white" 
              onClick={handleCurrencySubmit}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Continue to Checkout"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
