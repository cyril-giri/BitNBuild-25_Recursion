import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button className="bg-blue-500 text-white">Click me</Button>
      </div>
    </Router>
  )
}

export default App