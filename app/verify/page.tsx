import { Suspense } from 'react'
import VerifyClient from './VerifyClient'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: 'Arial' }}>Cargando...</div>}>
      <VerifyClient />
    </Suspense>
  )
}
