"use client";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AsyncLayoutDynamic from "@/containers/async-layout-dynamic";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='font-mono'>
      <AsyncLayoutDynamic>{children}</AsyncLayoutDynamic>

        </body>
    </html>
  )
}
