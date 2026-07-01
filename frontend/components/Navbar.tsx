"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Brand } from "./Brand";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link href="/tarefas">
          <Brand className="text-xl" />
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden font-mono text-xs text-bone-dim sm:inline">
              {user.nome}
            </span>
          )}
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-1.5 rounded-md border border-hairline px-3 py-1.5 text-xs text-bone-dim transition-colors hover:border-stamp hover:text-stamp"
          >
            <LogOut size={13} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
