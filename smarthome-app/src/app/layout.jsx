import { Inter } from 'next/font/google'
import { AuthProvider } from "./context/AuthProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SmartHome App',
  description: 'Projekt na PSW',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  )
}
