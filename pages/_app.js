import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />

      <div className="mt-[46px] flex">
        <Sidebar />
        {/* <div id="content-section" className="ml-[200px] w-full overflow-hidden"> */}
        <div id="content-section" className="pl-[200px] w-full">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  )
}
