import { supabase } from '@/lib/supabase'
import dayjs from 'dayjs'

export default async function Cupon({ params }) {
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('coupon_code', params.code)
    .single()

  if (!data) return <p>Cupón inválido</p>

  return (
    <div>
      <h1>Cupón Arttech</h1>
      <p>Descuento: {data.discount_percent}%</p>
      <p>Vence en {dayjs(data.expires_at).diff(dayjs(), 'day')} días</p>
    </div>
  )
}
