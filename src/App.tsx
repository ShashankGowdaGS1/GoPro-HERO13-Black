import React from 'react';
import { ProductNav } from './components/navigation/ProductNav';
import { Footer } from './components/navigation/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { EngineeringSection } from './components/sections/EngineeringSection';
import { PerformanceSection } from './components/sections/PerformanceSection';
import { LensesSection } from './components/sections/LensesSection';
import { StabilizationSection } from './components/sections/StabilizationSection';
import { DurabilitySection } from './components/sections/DurabilitySection';
import { MountingSection } from './components/sections/MountingSection';
import { PowerSection } from './components/sections/PowerSection';
import { FinaleSection } from './components/sections/FinaleSection';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-primary">
      <ProductNav />
      <main id="main-content">
        <HeroSection />
        <EngineeringSection />
        <PerformanceSection />
        <LensesSection />
        <StabilizationSection />
        <DurabilitySection />
        <MountingSection />
        <PowerSection />
        <FinaleSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
