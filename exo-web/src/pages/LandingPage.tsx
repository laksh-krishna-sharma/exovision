import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store/index"
import { logout } from "@/store/slices/auth/loginSlice"

const LandingPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, access_token } = useAppSelector((state) => state.loginData)
  const isAuthenticated = !!access_token

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gray-50 p-6">
      <h1 className="text-4xl font-bold">Exovision</h1>
      <p className="text-gray-600 max-w-xl text-center">
        Landing page for Exovision. Please login or sign up to continue.
      </p>

      {isAuthenticated ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg">Hello, <span className="font-medium">{user?.name || user?.email}</span> 👋</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            <Button variant="destructive" onClick={() => dispatch(logout())}>
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button variant="outline" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </div>
      )}
    </div>
  )
}

export default LandingPage