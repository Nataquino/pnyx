import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SurveyCreate } from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SurveyCreate/>} />
      </Routes>
    </Router>
  );
}



export default App;