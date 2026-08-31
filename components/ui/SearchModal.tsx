"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  BarChartIcon, 
  MailIcon, 
  Key01Icon, 
  FileTypeIcon, 
  Settings01Icon,
  CreditCardIcon,
  Layout01Icon,
  SearchVisualIcon
} from "@hugeicons/core-free-icons";

export function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, settings, accounts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
            <HugeiconsIcon icon={BarChartIcon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>Dashboard</span>
              <span className="text-xs text-secondary/70">Overview of your relay limits and recent activity</span>
            </div>
          </CommandItem>
          
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/accounts"))}>
            <HugeiconsIcon icon={MailIcon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>Gmail Accounts</span>
              <span className="text-xs text-secondary/70">Manage connected Gmails and authentication</span>
            </div>
          </CommandItem>
          
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/keys"))}>
            <HugeiconsIcon icon={Key01Icon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>API Keys</span>
              <span className="text-xs text-secondary/70">Generate and revoke API keys for your applications</span>
            </div>
          </CommandItem>

          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/templates"))}>
            <HugeiconsIcon icon={Layout01Icon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>Templates</span>
              <span className="text-xs text-secondary/70">Build welcome, OTP, invoice, and reset emails</span>
            </div>
          </CommandItem>

          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/debugger"))}>
            <HugeiconsIcon icon={SearchVisualIcon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>Debugger</span>
              <span className="text-xs text-secondary/70">Trace send steps, variables, and HTML warnings</span>
            </div>
          </CommandItem>
          
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/logs"))}>
            <HugeiconsIcon icon={FileTypeIcon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>Email Logs</span>
              <span className="text-xs text-secondary/70">Track recent emails, bounces, and deliverability</span>
            </div>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <HugeiconsIcon icon={Settings01Icon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>Settings</span>
              <span className="text-xs text-secondary/70">Manage personal details and workspace preferences</span>
            </div>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
            <HugeiconsIcon icon={CreditCardIcon} size={16} color="currentColor" strokeWidth={1.5} className="mr-2 text-secondary" />
            <div className="flex flex-col">
              <span>Billing & Plans</span>
              <span className="text-xs text-secondary/70">Manage subscription, upgrade to Pro, and billing details</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
