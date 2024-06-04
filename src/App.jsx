import React from 'react';
import SampleChat from './demo/SampleChat';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from './pages/NoPage';
import History from './demo/History';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="/:userId" element={<SampleChat />} />
          <Route path="/history/:userId" element={<History />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


