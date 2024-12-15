import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, SignUpPage, InterestPage, FinishingPage, HomePage, SurveyCreate, SurveyList, TakeSurvey, PersonalSurveys,Admin, SurveyPending,ViewSurvey, PendingPage, ApprovePage,DeclinePage,ResultPage, RedeemPage, Verification, EditSurvey} from "./pages";
import AdminCategories from "./pages/create-category";

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
        <Route path="/surveys-pending" element={<SurveyPending/>} />
        <Route path="/view-survey/:id" element={<ViewSurvey />} />
        <Route path="/pending" element={<PendingPage/>} />
        <Route path="/approve" element={<ApprovePage/>} />
        <Route path="/decline" element={<DeclinePage/>} />
        <Route path="/redeem" element={<RedeemPage/>} />
        <Route path="/result/:id" element={<ResultPage/>} />
        <Route path="/verification" element={<Verification/>} />
        <Route path="/admin-categories" element={<AdminCategories/>} />
        <Route path="/edit-survey/:id" element={<EditSurvey/>} />


      </Routes>
    </Router>
  );
}

export default App;