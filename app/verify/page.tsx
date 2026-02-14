'use client'

export const dynamic = 'force-dynamic'

import dynamicImport from 'next/dynamic'

const VerifyClient = dynamicImport(() => import('./VerifyClient'), { ssr: false })

export default function Page() {
  return <VerifyClient />
}
