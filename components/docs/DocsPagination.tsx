import Link from "next/link";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

interface NavItem {
  title: string;
  href: string;
}

interface DocsPaginationProps {
  prev?: NavItem;
  next?: NavItem;
}

export function DocsPagination({ prev, next }: DocsPaginationProps) {
  return (
    <div className="mt-16 pt-8 border-t border-outline-variant/60 flex items-center justify-between gap-4">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col items-start p-4 rounded-xl border border-outline-variant/60 bg-surface-container hover:bg-surface-container-high hover:border-outline-variant/80 transition-all min-w-[160px]"
        >
          <span className="text-xs font-semibold text-secondary flex items-center gap-1 group-hover:text-white transition-colors">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" />
            Previous
          </span>
          <span className="font-bold text-sm text-primary-sendlib mt-1">
            {prev.title}
          </span>
        </Link>
      ) : <div />}

      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end p-4 rounded-xl border border-outline-variant/60 bg-surface-container hover:bg-surface-container-high hover:border-outline-variant/80 transition-all text-right min-w-[160px] ml-auto"
        >
          <span className="text-xs font-semibold text-secondary flex items-center gap-1 group-hover:text-white transition-colors">
            Next
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" />
          </span>
          <span className="font-bold text-sm text-primary-sendlib mt-1">
            {next.title}
          </span>
        </Link>
      ) : <div />}
    </div>
  );
}
