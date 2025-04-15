// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FlatFileIngest from "./pages/FlatFileIngest";
// import ClickHouseIngest from "./pages/ClickHouseIngest"; // coming next

const App = () => {
  return (
    <Router>
      <nav className="p-4 bg-gray-100 mb-4">
        <Link to="/" className="mr-4">Flat File → ClickHouse</Link>
        {/* <Link to="/clickhouse">ClickHouse → Flat File</Link> */}
      </nav>
      <Routes>
        <Route path="/" element={<FlatFileIngest />} />
        {/* <Route path="/clickhouse" element={<ClickHouseIngest />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
