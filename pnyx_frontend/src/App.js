import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage, InterestPage, FinishingPage, HomePage,OwnSurvey,Admin } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/finish" element={<FinishingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/ownSurvey" element={<OwnSurvey />} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
  );
}



export default App;
