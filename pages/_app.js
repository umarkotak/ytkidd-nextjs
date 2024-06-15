import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />

      <div className="mt-[64px] flex">
        <Sidebar />
        <div id="content-section" className="ml-[200px] w-full overflow-hidden">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  )
}
