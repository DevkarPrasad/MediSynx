import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/register", { email, password })
      localStorage.setItem("token", res.data.access_token)
      alert("Logged in!")
    } catch (err: any) {
      alert("Login failed: " + (err.response?.data?.detail || err.message))
    }
  }

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={login}>Login</button>
    </div>
  )
} 