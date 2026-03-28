import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MatrixBackground } from '@/components/layout/MatrixBackground'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MatrixBackground movementDirection="up-left" movementSpeed={0.04} />
      <Header />
      <main id="main" className="flex-1 lg:px-20 xl:px-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
