import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Loved from '../pages/Loved';
import Meditate from '../pages/Meditate';
import About from '../pages/About';
import Paths from '../pages/Paths';
import PathWalk from '../pages/Paths/PathWalk';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/paths" element={<Paths />} />
      <Route path="/paths/:pathId" element={<PathWalk />} />
      <Route path="/loved" element={<Loved />} />
      <Route path="/meditate" element={<Meditate />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
