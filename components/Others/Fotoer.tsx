"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"

export default function Footer() {
  const [formData, setFormData] = useState({
    firstName: "",
    phoneNumber: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ firstName: "", phoneNumber: "" })
  }

  return (
    <footer className="bg-black text-white pt-16 pb-10 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sleek Studio</h2>
            <p className="text-base text-gray-300 font-light max-w-xs leading-relaxed">Best in what we do</p>
            <div className="pt-12">
              <ul className="space-y-3 text-xs uppercase tracking-wide">
                <li>
                  <Link href="/terms" className="hover:opacity-80 transition-opacity">
                    Terms of service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:opacity-80 transition-opacity">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:opacity-80 transition-opacity">
                    Cancel & Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Get In Touch Section */}
          <div className="space-y-8">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Timings</h3>
            <div className="space-y-2">
              <p className="text-sm uppercase text-gray-300">Mon-Saturday</p>
              <p className="text-sm uppercase text-gray-300">10am-4pm EST</p>
            </div>
            <div className="space-y-4 pt-6">
              <h4 className="text-sm uppercase font-medium">Contact</h4>
              <ul className="space-y-3 text-sm uppercase">
                <li>
                  <Link href="https://instagram.com" className="hover:text-gray-300 transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="https://pinterest.com" className="hover:text-gray-300 transition-colors">
                    Whatsapp
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mailing List Section */}
          <div className="space-y-8">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Get In Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-xs uppercase block text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/30 pb-2 pt-1 focus:outline-none focus:border-white text-white text-base"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-xs uppercase block text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/30 pb-2 pt-1 focus:outline-none focus:border-white text-white text-base"
                  required
                />
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  className="border border-white rounded-full px-8 py-3 text-sm uppercase font-medium hover:bg-white hover:text-black transition-all duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Explore Section */}
          <div className="space-y-8">
            <h3 className="text-sm uppercase tracking-wider font-semibold">Explore</h3>
            <ul className="space-y-3 text-sm uppercase">
              <li>
                <Link href="/" className="hover:text-gray-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gray-300 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/our-story" className="hover:text-gray-300 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/works" className="hover:text-gray-300 transition-colors">
                  Works
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="hover:text-gray-300 transition-colors">
                  Glossary
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="pt-12">
              <ul className="space-y-3 text-sm uppercase">
                <li>
                  <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="https://instagram.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="https://pinterest.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Pinterest
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Sleek Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}