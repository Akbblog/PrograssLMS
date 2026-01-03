import { redirect } from 'next/navigation'

export default function PresentationPage() {
  // Redirect to the static presentation HTML in `public/`
  redirect('/presentation.html')
}
