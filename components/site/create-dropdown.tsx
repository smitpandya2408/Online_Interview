"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CreateDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white h-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        Create
        <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
          <Link
            href="/create"
            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            onClick={() => setIsOpen(false)}
          >
            Interview Room
          </Link>
          <Link
            href="/create-meeting"
            className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            onClick={() => setIsOpen(false)}
          >
            Meeting Room
          </Link>
        </div>
      )}
    </div>
  );
}
