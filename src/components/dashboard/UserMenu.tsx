"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  email: string;
  fullName?: string | null;
  isPremium: boolean;
}

export function UserMenu({ email, fullName, isPremium }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initial = (fullName || email).trim().charAt(0).toUpperCase() || "?";
  const display = fullName?.trim() || email;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm transition-colors hover:bg-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[160px] truncate text-left sm:block">
          <span className="block text-sm font-medium text-slate-900">
            {display}
          </span>
          <span className="block text-xs text-slate-500">
            {isPremium ? "Premium" : "Gratuit"}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl bg-white p-1.5 shadow-card ring-1 ring-slate-100"
        >
          <div className="border-b border-slate-100 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-slate-900">
              {display}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{email}</p>
          </div>

          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
            role="menuitem"
          >
            <UserIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
            Mon dashboard
          </Link>

          <div className="my-1 border-t border-slate-100" />

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-danger-50 hover:text-danger-700"
              role="menuitem"
            >
              <LogOut className="h-4 w-4 text-slate-400" aria-hidden="true" />
              Se déconnecter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
