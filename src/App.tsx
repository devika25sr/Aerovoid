import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import FanControl from './components/FanControl';

type AppPage = 'landing' | 'control';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToPage = (page: AppPage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 300);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={() => navigateToPage('control')} />;
      case 'control':
        return <FanControl onBack={() => navigateToPage('landing')} />;
      default:
        return <LandingPage onStart={() => navigateToPage('control')} />;
    }
  };

  useEffect(() => {
    // Preload speech synthesis voices
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {renderCurrentPage()}
    </div>
  );
}

export default App;