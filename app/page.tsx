import { Header } from "@/components/header"
import { InputSection } from "@/components/input-section"
import { ProcessingSection } from "@/components/processing-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          <InputSection />
          <ProcessingSection />
        </div>
      </main>
    </div>
  )
}
