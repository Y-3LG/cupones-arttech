"use client";

export const dynamic = "force-dynamic";

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const codeFromQR = searchParams?.get('code') ?? null


  const [clientId, setClientId] = useState('')
  const [coupon, setCoupon] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

const verifyCoupon = async () => {
  setLoading(true)
  setError('')
  setCoupon(null)

  let query = supabase
    .from('coupons')
    .select('*')
    .eq('is_used', false)
    .gt('expires_at', new Date().toISOString())

  if (codeFromQR) {
    query = query.eq('coupon_code', codeFromQR)
  } else {
    query = query.eq('client_id', clientId)
  }

  const { data, error } = await query.maybeSingle()

  if (error || !data) {
    setError('No se encontró un cupón válido')
    setLoading(false)
    return
  }

  setCoupon(data)
  setLoading(false)
}


  const daysLeft =
    coupon ? dayjs(coupon.expires_at).diff(dayjs(), 'day') : 0

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      padding: 40,
      fontFamily: 'Arial'
    }}>
      <div style={{
        background: '#fff',
        maxWidth: 500,
        margin: '0 auto',
        padding: 30,
        borderRadius: 8
      }}>
        <h1>🎟 Verificar cupón</h1>

        {!codeFromQR && (
          <>
            <input
              placeholder="Ingresa tu ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                marginBottom: 15
              }}
            />
            <button onClick={verifyCoupon}>Verificar</button>
          </>
        )}

        {codeFromQR && (
          <button onClick={verifyCoupon}>
            Verificar cupón
          </button>
        )}

        {loading && <p>Verificando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {coupon && (
          <div style={{ marginTop: 20 }}>
            <h3>✅ Cupón válido</h3>
            <p><b>Descuento:</b> {coupon.discount_percent}%</p>
            <p><b>Días restantes:</b> {daysLeft}</p>
          </div>
        )}
      </div>
    </div>
  )
}
