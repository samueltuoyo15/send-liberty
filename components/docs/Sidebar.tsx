"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from '@hugeicons/react';
import { BookOpenIcon, FileTypeIcon, Key01Icon, MailIcon, ShieldIcon, ZapIcon } from '@hugeicons/core-free-icons';

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    links: [
      { name: "Introduction", href: "/docs", icon: BookOpenIcon },
      { name: "Quick Start", href: "/docs/quickstart", icon: ZapIcon },
      { name: "Limits & Quotas", href: "/docs/limits", icon: FileTypeIcon },
    ],
  },
  {
    title: "Authentication",
    links: [
      { name: "Connecting Gmail", href: "/docs/gmail", icon: ShieldIcon },
      { name: "API Keys", href: "/docs/keys", icon: Key01Icon },
    ],
  },
  {
    title: "Sending Emails",
    links: [
      { name: "Basic Send", href: "/docs/send", icon: MailIcon },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-[calc(100vh-64px)] overflow-y-auto border-r border-outline-variant bg-[#f7f9fb] p-6 hidden md:block">
      <div className="space-y-8">
        {DOC_SECTIONS.map((section, idx) => (
          <div key={idx}>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] text-[#75777d]/80 mb-3">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors ${
                        isActive
                          ? "bg-primary-sendlib/10 text-primary-sendlib font-bold"
                          : "text-[#505f76] hover:bg-primary-sendlib/5 hover:text-primary-sendlib"
                      }`}
                    >
                      <HugeiconsIcon 
                        icon={link.icon} 
                        size={16} 
                        color='currentColor' 
                        strokeWidth={1.5} 
                        className={isActive ? "text-primary-sendlib" : "text-[#75777d]"}
                      />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
