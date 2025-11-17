import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;