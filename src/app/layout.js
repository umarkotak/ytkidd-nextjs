import './globals.css'
import { Inter } from 'next/font/google'

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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossOrigin="anonymous"></script>
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
