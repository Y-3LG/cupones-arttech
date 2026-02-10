'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'

export default function Admin() {
  const [clientId, setClientId] = useState('')
  const [cupon, setCupon] = useState(null)

  const crearCupon = async () => {
    const code = 'ART-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const expires = dayjs().add(90, 'day').toISOString()

    await supabase.from('coupons').insert({
      client_id: clientId,
      coupon_code: code,
      expires_at: expires
    })

    setCupon(code)
  }

  return (
    <div>
      <h1>Panel Arttech</h1>

      <input
        placeholder="ID del cliente"
        onChange={e => setClientId(e.target.value)}
      />

      <button onClick={crearCupon}>Crear cupón</button>

      {cupon && <p>Cupón creado: {cupon}</p>}
    </div>
  )
}
