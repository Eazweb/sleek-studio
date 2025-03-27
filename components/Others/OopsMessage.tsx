import React from 'react'
import Link from 'next/link'

interface OopsMessageProps {
  message: string
  title?: string
  backUrl?: string
  backText?: string
}

const OopsMessage = ({
  message,
  title = "Oops!",
  backUrl = "/",
  backText = "Go back to home"
}: OopsMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">{title}</h1>
        <p className="text-gray-700 mb-6">{message}</p>
        <Link 
          href={backUrl} 
          className="inline-block px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
        >
          {backText}
        </Link>
      </div>
    </div>
  )
}

export default OopsMessage 