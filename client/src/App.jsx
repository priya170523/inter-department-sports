import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Brackets from './pages/Brackets';
import Results from './pages/Results';
import Announcements from './pages/Announcements';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CaptainDashboard from './pages/CaptainDashboard';
import ScoringDashboard from './pages/ScoringDashboard';
import Volunteer from './pages/Volunteer';
import CreateTeam from './pages/CreateTeam';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/brackets" element={<Brackets />} />
        <Route path="/results" element={<Results />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/match/:id/score" element={<ScoringDashboard />} />
        <Route path="/dashboard" element={<CaptainDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
