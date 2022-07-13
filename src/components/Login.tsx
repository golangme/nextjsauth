import { useState } from "react";
import { trpc } from "../utils/trpc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupkey, setSignUpKey] = useState("");
  const [signup, setSignUp] = useState(false);
  const [error, setError] = useState("");
  const authMutation = trpc.useMutation(["auth.signUp"]);
  const toogleSignup = () => {
    setSignUp(!signup);
  };

  const handleAuth = async () => {
    if (signup) {
      const payload = {
        email,
        password,
        signupkey,
      };
      const mutation = await authMutation.mutateAsync(payload);
      console.log(mutation);
    } else {
      console.log("Login In");

      const payload = {
        email,
        password,
      };
      const authenthicate = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log(authenthicate);
      if (!authenthicate?.error) {
        router.push("/auth");
      }
    }
  };
  return (
    <div className="flex items-center justify-center flex-col bg-slate-500 h-screen p-5">
      <h1 className="text-2xl font-bold">Auth</h1>
      <div className="flex items-center justify-center flex-col p-5 bg-zinc-600 rounded">
        <input
          className="w-full my-2"
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full my-2"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {
          signup ? (
            <input
              className="w-full my-2"
              type="text"
              placeholder="signup key"
              onChange={(e) => setSignUpKey(e.target.value)}
            />
          ) : null
          // <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        }
        <input
          className="w-5 h-5 m-2 rounded"
          type="checkbox"
          name="signup"
          onChange={() => toogleSignup()}
        />
        <p>{error}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded"
          onClick={() => handleAuth()}
        >
          {signup ? "SignUp" : "Login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
