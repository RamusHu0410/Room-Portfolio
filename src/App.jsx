import { AwardsModal } from './components/AwardsModal';
import { ComputerScreen } from './components/ComputerScreen';
import { Experience } from './components/Experience';
import { Hud } from './components/Hud';
import { ResumeModal } from './components/ResumeModal';
import { SettingsPanel } from './components/SettingsPanel';
import { VideoModal } from './components/VideoModal';

export default function App() {
  return (
    <>
      <Experience />
      <Hud />
      <ComputerScreen />
      <SettingsPanel />
      <ResumeModal />
      <AwardsModal />
      <VideoModal />
    </>
  );
}
