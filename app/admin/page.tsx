'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'
import { QRCodeCanvas } from 'qrcode.react'

export default function Admin() {
  const [clientId, setClientId] = useState('')
  const [coupon, setCoupon] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login'
      }
    })
  }, [])

  const crearCupon = async () => {
    const code = 'ART-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const expires = dayjs().add(90, 'day').toISOString()

    const { data, error } = await supabase.from('coupons').insert({
      client_id: clientId,
      coupon_code: code,
      expires_at: expires
    }).select().single()

    if (error) {
      alert('Error creando cupón')
    } else {
      setCoupon(data)
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Panel de Cupones – Arttech</h1>

      <input
        placeholder="ID del cliente"
        onChange={e => setClientId(e.target.value)}
      />
      <br /><br />

      <button onClick={crearCupon}>Crear cupón</button>

      {coupon && (
        <div style={{ marginTop: 20 }}>
          <p><b>Cupón:</b> {coupon.coupon_code}</p>
          <p><b>Descuento:</b> {coupon.discount_percent}%</p>
          <p><b>Vence:</b> {dayjs(coupon.expires_at).format('DD/MM/YYYY')}</p>

          <QRCode
            value={`http://localhost:3000/cupon/${coupon.coupon_code}`}
          />
        </div>
      )}
    </div>
  )
}
