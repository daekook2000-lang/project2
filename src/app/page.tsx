import { HeroSection } from './_components/HeroSection'
import { ProblemSection } from './_components/ProblemSection'
import { SolutionSection } from './_components/SolutionSection'
import { DemoSection } from './_components/DemoSection'
import { BenefitsSection } from './_components/BenefitsSection'
import { CTASection } from './_components/CTASection'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DemoSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}