"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ArrowPathIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-zinc-100 via-neutral-100 to-stone-100 text-zinc-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Invoice Generator</h1>
            <p className="text-xl md:text-2xl mb-8">Seamlessly integrate with Airtable to create professional invoices and proposals</p>
            <button className="bg-fuchsia-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-fuchsia-700 transition">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">See It In Action</h2>
          <div className="relative rounded-lg overflow-hidden bg-zinc-100 aspect-video max-w-4xl mx-auto">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="https://videos.pexels.com/video-files/5527588/5527588-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <ArrowPathIcon className="h-12 w-12 text-fuchsia-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-zinc-900">Airtable Integration</h3>
              <p className="text-zinc-600">Connect your Airtable base and automatically generate invoices from your data</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <DocumentTextIcon className="h-12 w-12 text-fuchsia-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-zinc-900">Custom Templates</h3>
              <p className="text-zinc-600">Choose from multiple professional templates for invoices and proposals</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <ArrowDownTrayIcon className="h-12 w-12 text-fuchsia-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-zinc-900">Easy Export</h3>
              <p className="text-zinc-600">Export your documents in PDF format with just one click</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-stone-50 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-zinc-900">Basic</h3>
              <p className="text-4xl font-bold mb-6 text-zinc-900">$9<span className="text-lg text-zinc-500">/month</span></p>
              <ul className="space-y-3 text-zinc-600">
                <li>✓ 50 invoices/month</li>
                <li>✓ Basic templates</li>
                <li>✓ PDF export</li>
              </ul>
            </div>
            <div className="p-8 bg-stone-50 rounded-lg shadow-sm border-2 border-fuchsia-500">
              <h3 className="text-2xl font-bold mb-4 text-zinc-900">Pro</h3>
              <p className="text-4xl font-bold mb-6 text-zinc-900">$19<span className="text-lg text-zinc-500">/month</span></p>
              <ul className="space-y-3 text-zinc-600">
                <li>✓ Unlimited invoices</li>
                <li>✓ All templates</li>
                <li>✓ Custom branding</li>
              </ul>
            </div>
            <div className="p-8 bg-stone-50 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-zinc-900">Enterprise</h3>
              <p className="text-4xl font-bold mb-6 text-zinc-900">Custom</p>
              <ul className="space-y-3 text-zinc-600">
                <li>✓ Everything in Pro</li>
                <li>✓ API access</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Image
                  src="/postiva-logo.png"
                  alt="Postiva Logo"
                  width={120}
                  height={50}
                  className=""
                />
              </div>
              <p className="text-gray-400 text-sm">Seemless İntegration</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Theme Tweak</li>
                <li>Pre-sale FAQs</li>
                <li>Submit a Ticket</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase">Showcase</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Widgetkit</li>
                <li>Support</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase">About Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Affiliates</li>
                <li>Resources</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">RSS</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.8 16c0 2.3-1.9 4.2-4.2 4.2S4.4 18.3 4.4 16s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2zm6.5-12v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h13.3c1.1 0 2 .9 2 2zm-2 0H4v16h13.3V4z"/>
                </svg>
              </a>
            </div>
            <p className="text-center text-gray-400 text-sm">©Copyright. All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
