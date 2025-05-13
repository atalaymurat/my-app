"use client";
import { ArrowPathIcon, DocumentTextIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading, checkSession, authChecked } = useAuth();

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-zinc-100 via-neutral-100 to-stone-100 text-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Bussiness Documents Creater</h1>
            <p className="text-xl md:text-2xl mb-8">
              Seamlessly integrate with your companies and contacts
            </p>
            <Link href={user ? "shield/profile" : "/auth"}>
              <button className="bg-fuchsia-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-fuchsia-700 transition">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <ArrowPathIcon className="h-12 w-12 text-fuchsia-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-zinc-900">Future Integration</h3>
              <p className="text-zinc-600">
                Connect your Airtable base and automatically generate invoices from your data
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <DocumentTextIcon className="h-12 w-12 text-fuchsia-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-zinc-900">Custom Templates</h3>
              <p className="text-zinc-600">
                Choose from multiple professional templates for invoices and proposals
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <ArrowDownTrayIcon className="h-12 w-12 text-fuchsia-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-zinc-900">Easy Export</h3>
              <p className="text-zinc-600">
                Export your documents in PDF format with just one click
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
