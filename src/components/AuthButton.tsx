import { useAuth } from "../context/AuthContextProvider";

const AuthButton = () => {
  const { signIn } = useAuth();
  return (
    <button
      className="text-white border px-4 py-2 rounded-lg"
      onClick={() => signIn({ provider: "google" })}
    >
      Googleでログインする
    </button>
  );
};

export default AuthButton;
