import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Garden from '../pages/Garden';
import Meditate from '../pages/Meditate';
import About from '../pages/About';
import Paths from '../pages/Paths';
import PathWalk from '../pages/Paths/PathWalk';
import Thinkers from '../pages/Thinkers';
import { ThinkerPage, TraditionPage } from '../pages/Thinkers/Voice';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paths" element={<Paths />} />
      <Route path="/paths/:pathId" element={<PathWalk />} />
      <Route path="/thinkers" element={<Thinkers />} />
      <Route path="/thinkers/:thinkerId" element={<ThinkerPage />} />
      <Route path="/traditions/:tradition" element={<TraditionPage />} />
      <Route path="/garden" element={<Garden />} />
      <Route path="/loved" element={<Navigate to="/garden" replace />} />
      <Route path="/meditate" element={<Meditate />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
