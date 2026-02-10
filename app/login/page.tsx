'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

const login = async () => {
  const res = await supabase.auth.signInWithPassword({
    email,
    password
  })

  console.log(res)

  if (res.error) {
    alert(res.error.message)
  } else {
    router.push('/admin')
  }
}

  return (
    <div style={{ padding: 40 }}>
      <h1>Login Arttech</h1>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Entrar</button>
    </div>
  )
}
