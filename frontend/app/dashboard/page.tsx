"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, MessageSquare, Users, Settings, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/auth/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-indigo-600">Meggy AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 px-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Welcome back, {user.username || user.email.split("@")[0]}!
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Ready to build something amazing?
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Agents Card */}
          <Link
            href="/agents"
            className="group relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 hover:border-indigo-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
              <Bot className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              My Agents
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create and manage your AI agents
            </p>
          </Link>

          {/* Chat Card */}
          <Link
            href="/chat"
            className="group relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 hover:border-emerald-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Conversations
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Chat with your AI agents
            </p>
          </Link>

          {/* Settings Card */}
          <Link
            href="/settings"
            className="group relative overflow-hidden rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 hover:border-purple-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <Settings className="h-7 w-7" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Settings
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Configure your preferences
            </p>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Total Agents
              </p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                0
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Conversations
              </p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                0
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Messages
              </p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">
                0
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
