import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store";
import { signup } from "@/store/slices/auth/signupSlice";
// If you want auto-login after signup:
import { login } from "@/store/slices/auth/loginSlice";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirm) {
      return alert("Please fill all fields");
    }
    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    try {
      // ✅ Call signup API
      console.log("Signing up", { name, email, password });
      const result = await dispatch(signup({ name, email, password }));
      console.log(result);

      if (signup.fulfilled.match(result)) {
        // ✅ Optional: auto-login after signup
        await dispatch(login({ email, password }));
        console.log("User signed up and logged in");
        navigate("/");
      } else {
        alert((result.payload as string) || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold">Create account</h2>

        <div className="flex flex-col gap-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
          />
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
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            placeholder="Confirm password"
          />

          <Button onClick={handleSignup}>Sign up</Button>

          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="underline underline-offset-2"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
