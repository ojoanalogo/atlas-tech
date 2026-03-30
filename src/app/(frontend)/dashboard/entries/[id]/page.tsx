import type { Metadata } from 'next'
import { EditEntryForm } from './EditEntryForm'

export const metadata: Metadata = {
  title: 'Editar entrada',
  robots: { index: false },
}

export default function EditEntryPage() {
  return <EditEntryForm />
}
