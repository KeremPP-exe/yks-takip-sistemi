import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { TrialProvider } from "./context/TrialContext";
import { StudyProvider } from "./context/StudyContext";
import Dashboard from "./pages/Dashboard";
import AddTrial from "./pages/AddTrial";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Calendar from "./pages/Calendar";
import CookiePolicy from "./pages/CookiePolicy";
import UserGuide from "./pages/UserGuide";
import RankCalculator from "./pages/RankCalculator";

function App() {
  return (
    <StudyProvider>
      <TrialProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddTrial />} />
              <Route path="/history" element={<History />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/kullanim-kilavuzu" element={<UserGuide />} />
              <Route path="/siralamam-ne" element={<RankCalculator />} />
            </Routes>
          </Layout>
        </Router>
      </TrialProvider>
    </StudyProvider>
  );
}

export default App;
