import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage, InterestPage, FinishingPage, HomePage, OwnSurvey, Admin, PendingPage, ApprovePage, DeclinePage } from "./pages";

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
        <Route path="/pending" element={<PendingPage/>} />
        <Route path="/approve" element={<ApprovePage/>} />
        <Route path="/decline" element={<DeclinePage/>} />
      </Routes>
    </Router>
  );
}



export default App;
