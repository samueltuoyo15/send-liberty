"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Code2, Key, Mail, Shield, Zap } from "lucide-react";

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    links: [
      { name: "Introduction", href: "/docs", icon: BookOpen },
      { name: "Quick Start", href: "/docs/quickstart", icon: Zap },
    ],
  },
  {
    title: "Authentication",
    links: [
      { name: "Connecting Gmail", href: "/docs/gmail", icon: Shield },
      { name: "API Keys", href: "/docs/keys", icon: Key },
    ],
  },
  {
    title: "Sending Emails",
    links: [
      { name: "Basic Send", href: "/docs/send", icon: Mail },
      { name: "Batch Sending", href: "/docs/batch", icon: Code2 },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 h-[calc(100vh-64px)] overflow-y-auto border-r border-[#222] bg-[#050505] p-6 hidden md:block">
      <div className="space-y-8">
        {DOC_SECTIONS.map((section, idx) => (
          <div key={idx}>
            <h4 className="font-bold text-xs uppercase tracking-[0.15em] text-[#666] mb-3">
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
                          ? "bg-[#1A1A1A] text-white"
                          : "text-[#888] hover:bg-[#111] hover:text-[#ccc]"
                      }`}
                    >
                      <link.icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-[#555]"}`} />
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
