import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Loading from "./components/Loading";
import Home from "./pages/Home";
import Photobooth from "./pages/Photobooth";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader only on initial app load
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photobooth" element={<Photobooth />} />
      </Routes>
    </Router>
  );
}

export default App;
