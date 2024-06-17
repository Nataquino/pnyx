import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage, InterestPage, FinishingPage, HomePage, SurveyCreate, SurveyList, TakeSurvey, PersonalSurveys, Admin} from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/finish" element={<FinishingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-survey" element={<SurveyCreate />} />
        <Route path="/survey-list" element={<SurveyList />} />
        <Route path="/take-survey/:id" element={<TakeSurvey />} />
        <Route path="/personal-surveys" element={<PersonalSurveys />} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
  );
}

export default App;