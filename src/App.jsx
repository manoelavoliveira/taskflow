import { Route, Routes } from "react-router";
import "./App.css";
import Kanban from "./pages/Kanban";
import Sobre from "./pages/Sobre";
import Login from "./pages/Login";
import Sidebar from "./componentes/Sidebar";
import { useState } from "react";
import RotaPrivada from "./componentes/RotaPrivada";
import { useAuth } from "./contexts/AuthContext";

function App() {

  const { token } = useAuth();
  //console.log(useAuth())
  return (
    <div className="app-layout">
      {token && <Sidebar />}

      <main className="app-conteudo" style={{ marginLeft: token ? '220px' : '0' }}>
        <Routes>
          <Route
            path="/"
            element={
              <RotaPrivada>
                {" "}
                <Kanban />{" "}
              </RotaPrivada>
            }
          />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}
export default App;
