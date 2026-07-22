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

export default function SettingsPage() {
  const { data: user, isLoading } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [editName, setEditName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const router = useRouter();

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
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-7">
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

        {/* Right Column: Sign Out & Delete Account */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-xl border border-destructive/20 bg-destructive/[0.01] shadow-none p-6">
            <div className="flex items-center gap-2 mb-4">
              <HugeiconsIcon icon={Logout01Icon} size={20} color='currentColor' strokeWidth={1.5} className="text-destructive" />
              <h3 className="font-headline-md font-bold text-lg text-destructive">Sign Out</h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-sm text-secondary leading-relaxed">
                Sign out of your SendLib account on this device.
              </p>
              <Button 
                variant="destructive"
                size="lg"
                className="rounded-lg font-label-sm shrink-0 cursor-pointer"
                onClick={() => setSignOutConfirmOpen(true)}
              >
                Sign Out
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-destructive/40 bg-destructive/[0.03] shadow-none p-6">
            <div className="flex items-center gap-2 mb-4">
              <HugeiconsIcon icon={Delete02Icon} size={20} color='currentColor' strokeWidth={1.5} className="text-destructive" />
              <h3 className="font-headline-md font-bold text-lg text-destructive">Delete Account</h3>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-secondary leading-relaxed">
                Permanently delete your account and all associated data, including connected Gmail accounts, email logs, and API keys. This action cannot be undone.
              </p>
              <div>
                <Button 
                  variant="destructive"
                  size="lg"
                  className="rounded-lg font-label-sm w-full sm:w-auto whitespace-nowrap cursor-pointer"
                  onClick={() => setDeleteAccountOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
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
              Are you sure you want to sign out of your SendLib account? You will need to log in again to access your dashboard.
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
              This will permanently delete your SendLib account and all associated data, including connected Gmail accounts, email logs, and API keys. This action is <strong>irreversible</strong>.
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
    </div>
  );
}
