'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'

export default function Verificar() {
  const [id, setId] = useState('')
  const [cupones, setCupones] = useState([])

  const buscar = async () => {
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('client_id', id)
      .eq('is_used', false)

    setCupones(data)
  }

  return (
    <div>
      <h1>Consulta tu cupón</h1>

      <input placeholder="Tu ID" onChange={e => setId(e.target.value)} />
      <button onClick={buscar}>Consultar</button>

      {cupones.map(c => (
        <div key={c.id}>
          <p>Descuento: {c.discount_percent}%</p>
          <p>Días restantes: {dayjs(c.expires_at).diff(dayjs(), 'day')}</p>
        </div>
      ))}
    </div>
  )
}
