import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#020b14]">

      <Sidebar />

      <div className="lg:ml-64">

        <Header />

        <main className="p-5 md:p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;