"use client"

import React, { useEffect } from 'react'
import { useLocale } from 'next-intl'

type LanguageWrapperProps = {
  children: React.ReactNode
}

export default function LanguageWrapper({ children }: LanguageWrapperProps) {
  const locale = useLocale()

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div className={`${locale === 'ar' ? 'rtl' : 'ltr'}`}>
      {children}
    </div>
  )
}