import { Link, NavLink, Outlet } from "react-router-dom";

const claseEnlace = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"
  }`;

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-bold">
            Atlas de Anatomía
          </Link>
          <div className="flex gap-2">
            <NavLink to="/musculos" className={claseEnlace}>
              Músculos
            </NavLink>
            <NavLink to="/huesos" className={claseEnlace}>
              Huesos
            </NavLink>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}