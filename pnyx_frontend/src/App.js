import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage, InterestPage, FinishingPage, HomePage } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/finish" element={<FinishingPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
}



export default App;