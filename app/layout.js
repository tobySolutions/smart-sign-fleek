import { Inter, Dancing_Script, Homemade_Apple } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

// Add signature fonts
const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing-script'
})

const homemadeApple = Homemade_Apple({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-homemade-apple'
})

export const metadata = {
  title: 'SmartSignGPT - AI-Powered Contract Management',
  description: 'Transform your contract workflow with AI-powered summaries, analysis, and improvements.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="handle-grammarly" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              const observer = new MutationObserver(() => {
                document.querySelectorAll('[data-new-gr-c-s-check-loaded], [data-gr-ext-installed]')
                  .forEach(el => {
                    el.removeAttribute('data-new-gr-c-s-check-loaded');
                    el.removeAttribute('data-gr-ext-installed');
                  });
              });
              
              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true
              });
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} ${dancingScript.variable} ${homemadeApple.variable}`}>
        {children}
      </body>
    </html>
  )
}