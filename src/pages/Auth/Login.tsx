export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input className="w-full p-2 border mb-3" placeholder="Email" />
        <input className="w-full p-2 border mb-3" placeholder="Password" type="password" />

        <button className="w-full bg-blue-500 text-white p-2">
          Se connecter
        </button>
      </div>
    </div>
  );
}