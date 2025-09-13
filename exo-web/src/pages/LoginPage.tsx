import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppDispatch } from "@/store/index"
import { login } from "@/store/slices/auth/loginSlice"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = () => {
    if (!email || !password) {
      return alert("Please enter name, email and password")
    }
    // replace with real auth call later
    dispatch(login({ email, password }))
    navigate("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold">Login</h2>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <Button type="submit">Login</Button>

          <div className="text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="underline underline-offset-2"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
