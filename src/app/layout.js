import './globals.css'
import { Inter } from 'next/font/google'
import { useCronitor } from '@cronitorio/cronitor-rum-nextjs'

import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'YT Kidd',
  description: 'A youtube content library curated by human for kids',
}

export default function RootLayout({ children }) {
  useCronitor('3f97b0a02f683b7af499e046f0495786', {
    debug: false
  })

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body className={inter.className} suppressHydrationWarning={true}>
        <Navbar />
        <div className="mt-[64px] flex">
          <Sidebar />
          <div id="content-section" className="ml-[200px] w-full overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
