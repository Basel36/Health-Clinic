'use client'

import { useState } from 'react'
import SearchSection from './SearchSection'
import AIThinking from './AIThinking'
import { createPortal } from 'react-dom'

export default function SearchWrapper() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <>
      {isAnalyzing && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[9999] flex items-center justify-center">
          <AIThinking />
        </div>,
        document.body
      )}
      {!isAnalyzing && <SearchSection onAnalyzing={(analyzing) => setIsAnalyzing(analyzing)} />}
    </>
  )
}

