import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const { token, logout } = useAuth();
  const linkClass = ({ isActive }) =>
    isActive ? styles.link + " " + styles.ativo : styles.link;
  const { usuario } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className={styles.Sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>
      <nav className={styles.nav}>
        {token && (
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>
        )}
        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
      </nav>
      <div className="sidebar-usuario">
        <span>Olá, {usuario?.nome ?? "Usuário"}</span>
        <button onClick={handleLogout}>Sair</button>
      </div>
    </aside>
  );
}

export default Sidebar;
