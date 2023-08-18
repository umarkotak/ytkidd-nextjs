import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YT Kidd',
  description: 'A youtube content library curated by human for kids',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>

      <body className={inter.className} suppressHydrationWarning={true} >
        <Script src="/scripts/custom.js" strategy="beforeInteractive" />

        <Navbar/>

        <div className='mt-[64px] flex'>
          <Sidebar/>

          <div id="content-section" className='ml-[200px] w-full'>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
