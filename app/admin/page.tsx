'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'
import { QRCodeCanvas } from 'qrcode.react'
import { useRouter } from 'next/navigation'

const inputStyle = {
  width: '100%',
  padding: 10,
  marginBottom: 15,
  borderRadius: 5,
  border: '1px solid #ccc'
}

const buttonStyle = {
  width: '100%',
  padding: 12,
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer'
}

export default function AdminPage() {
  const [clientId, setClientId] = useState('')
  const [discount, setDiscount] = useState(10)
  const [days, setDays] = useState(90)
  const [couponCode, setCouponCode] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // 🔐 PASO 3 Y 4 — PROTECCIÓN DEL ADMIN
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const generateCoupon = async () => {
    setLoading(true)

    const code = crypto.randomUUID()
    const expiresAt = dayjs().add(days, 'day').toISOString()

    const { error } = await supabase.from('coupons').insert({
      client_id: clientId,
      coupon_code: code,
      discount_percent: discount,
      expires_at: expiresAt,
      is_used: false,
    })

    if (error) {
      alert('Error creando cupón')
      console.error(error)
    } else {
      setCouponCode(code)
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f8',
      padding: '40px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        maxWidth: 520,
        margin: '0 auto',
        padding: 30,
        borderRadius: 8,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ marginBottom: 20 }}>🎟 Panel de Cupones</h1>

        <label>ID del Cliente</label>
        <input
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder="Ej: 12345678"
          style={inputStyle}
        />

        <label>% de Descuento</label>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          style={inputStyle}
        />

        <label>Días de validez</label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={inputStyle}
        />

        <button
          onClick={generateCoupon}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? 'Generando...' : 'Crear cupón'}
        </button>

        {couponCode && (
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <h3>Cupón generado</h3>
            <p style={{ fontSize: 12 }}>{couponCode}</p>

            <QRCodeCanvas
              value={`${window.location.origin}/verify?code=${couponCode}`}
              size={180}
            />
          </div>
        )}
      </div>
    </div>
  )
}
