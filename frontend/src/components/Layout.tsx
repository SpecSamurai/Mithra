import { NavLink, Outlet } from "react-router";

const links = [
  { to: "/application", label: "Application" },
  { to: "/interview", label: "Interview" },
  { to: "/evaluation", label: "Evaluation" },
];

export default function Layout() {
  return (
    <div className="layout">
      <header className="topbar">
        <span className="topbar__brand">Interviewer</span>
        <nav className="topbar__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `topbar__link${isActive ? " topbar__link--active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
