import { LandingContent } from '@/components/landing/LandingContent';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense>
      <LandingContent />
    </Suspense>
  );
}