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
  const [searchClientId, setSearchClientId] = useState('')
  const [clientCoupons, setClientCoupons] = useState<any[]>([])


  const router = useRouter()

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

  const searchClientCoupons = async () => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('client_id', searchClientId)
    .eq('is_used', false)
    .order('expires_at', { ascending: true })

  if (error || !data || data.length === 0) {
    alert('Este cliente no tiene cupones activos')
    setClientCoupons([])
    return
  }

  setClientCoupons(data)
}

  const markAsUsed = async (couponId: string) => {
  const { error } = await supabase
    .from('coupons')
    .update({
      is_used: true,
      used_at: new Date().toISOString()
    })
    .eq('id', couponId)

  if (error) {
    alert('Error marcando cupón')
  } else {
    alert('Cupón marcado como usado')
    setClientCoupons(prev => prev.filter(c => c.id !== couponId))
  }
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
        <hr style={{ margin: '30px 0' }} />

<h2>🧾 Validar cupones por cliente</h2>

<input
  placeholder="ID del cliente"
  value={searchClientId}
  onChange={(e) => setSearchClientId(e.target.value)}
  style={inputStyle}
/>

<button onClick={searchClientCoupons} style={buttonStyle}>
  Buscar cupones
</button>

{clientCoupons.map(coupon => (
  <div
    key={coupon.id}
    style={{
      marginTop: 15,
      padding: 15,
      border: '1px solid #ddd',
      borderRadius: 6
    }}
  >
    <p><b>Descuento:</b> {coupon.discount_percent}%</p>
    <p>
      <b>Vence:</b>{' '}
      {dayjs(coupon.expires_at).format('DD/MM/YYYY')}
    </p>

    <button
      onClick={() => markAsUsed(coupon.id)}
      style={{ ...buttonStyle, backgroundColor: '#dc2626' }}
    >
      Marcar como usado
    </button>
  </div>
))}
      </div>
    </div>
  )
}
