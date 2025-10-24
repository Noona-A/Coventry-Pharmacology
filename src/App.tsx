import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SelectDeck from './pages/SelectDeck'
import Game from './pages/Game'
import Lists from './pages/Lists'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import Cosmetics from './pages/Cosmetics'
import ParticleBackground from './components/ParticleBackground'

export default function App() {
  return (
    <>
      <ParticleBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<SelectDeck />} />
        <Route path="/game" element={<Game />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cosmetics" element={<Cosmetics />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
