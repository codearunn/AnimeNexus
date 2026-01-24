import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎌 AnimeNexus
        </h1>
        <p className="text-gray-600 mb-6">
          Vite + React + Tailwind CSS Setup Complete!
        </p>
        <div className="grid grid-cols-2 gap-2">
          <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium text-center">⚡ Vite</span>
          <span className="px-3 py-2 bg-cyan-100 text-cyan-800 rounded-lg text-sm font-medium text-center">⚛️ React</span>
          <span className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium text-center">🎨 Tailwind</span>
          <span className="px-3 py-2 bg-pink-100 text-pink-800 rounded-lg text-sm font-medium text-center">🎭 Framer</span>
        </div>
      </div>
    </div>
  )
}

export default App