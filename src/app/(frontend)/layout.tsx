import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1 lg:px-20 xl:px-8">
        {children}
      </main>
      <Footer />
    </>
  )
}
