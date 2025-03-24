// app/(routes)/wishlist/page.tsx

"use client";

import React from 'react';

export default function Page() {
  return (
    <div className="w-[90%] mx-auto max-w-[1300px] min-h-[600px]">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 my-8">Wishlist</h1>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">Your Wishlist is Empty</h2>
        <p className="text-gray-500 max-w-md">Start adding items to your wishlist to keep track of products you love. They'll be saved here for when you're ready to purchase.</p>
      </div>
    </div>
  );
}