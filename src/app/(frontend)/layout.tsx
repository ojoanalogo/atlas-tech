import '@/styles/globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MatrixBackground } from '@/components/layout/MatrixBackground'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="font-sans w-full min-h-screen flex flex-col relative bg-background text-secondary selection:bg-accent selection:text-accent-foreground">
        <MatrixBackground movementDirection="up-left" movementSpeed={0.4} />
        <Header />
        <main id="main" className="flex-1 md:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
