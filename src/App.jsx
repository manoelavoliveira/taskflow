import { Route, Routes } from "react-router";
import "./App.css";
import Kanban from "./pages/Kanban";
import Sobre from "./pages/Sobre";
import Login from "./pages/Login";
import Sidebar from "./componentes/Sidebar";
import { useState } from "react";
import RotaPrivada from "./componentes/RotaPrivada";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-conteudo">
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
