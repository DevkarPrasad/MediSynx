"use client"

import Generator from "./generator"

interface SyntheticPageProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function SyntheticPage({ currentPage, onPageChange }: SyntheticPageProps) {
  return <Generator currentPage={currentPage} onPageChange={onPageChange} />
}
