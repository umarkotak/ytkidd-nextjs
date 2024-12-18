import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Head from "next/head";
import { ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Primary Metadata */}
        <title>Cookie Kid</title>
        <meta name="description" content="Kumpulan koten yang relatif edukatif untuk anak" />
        <meta name="keywords" content="cookie kid, kid, kids." />
        <meta name="author" content="Cookie Kid" />

        {/* Google Metadata */}
        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
        <meta property="og:title" content="Cookie Kid" />
        <meta property="og:description" content="Kumpulan koten yang relatif edukatif untuk anak" />
        <meta property="og:url" content="https://cookiekid.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cookiekid.vercel.app/images/cookie_kid_logo_circle.png" />
        <meta property="og:image:alt" content="Cookie Kid" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cookie Kid" />
        <meta name="twitter:description" content="Kumpulan koten yang relatif edukatif untuk anak" />
        <meta name="twitter:image" content="https://cookiekid.vercel.app/images/cookie_kid_logo_circle.png" />

        {/* WhatsApp (via Open Graph) */}
        {/* WhatsApp uses Open Graph tags, so ensure `og:image` and `og:description` are optimized */}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/cookie_kid_logo_circle.png" />

        {/* Additional Metadata for Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Navbar />

      <div className="mt-[46px] flex">
        <Sidebar />
        {/* <div id="content-section" className="ml-[200px] w-full overflow-hidden"> */}
        <div id="content-section" className="pl-[200px] w-full">
          <Component {...pageProps} />
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}
