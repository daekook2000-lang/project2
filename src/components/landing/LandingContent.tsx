'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { CTA } from './CTA';

export function LandingContent() {
  return (
    <div className="bg-white text-gray-800">
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
    </div>
  );
}
