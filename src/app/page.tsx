import { HeroSection } from './_components/HeroSection'
import { FeaturesSection } from './_components/FeaturesSection'
import { HowItWorksSection } from './_components/HowItWorksSection'
import { DemoSection } from './_components/DemoSection'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Header />
      <main className="w-full">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  )
}
