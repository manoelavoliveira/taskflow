import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalTarefa from "./ModalTarefa";
import { AuthProvider } from "../contexts/AuthContext";

const prioridades = [
  { id: 1, descricao: "Alta" },
  { id: 2, descricao: "Media" },
  { id: 3, descricao: "Baixa" },
];
const usuarios = [
  { id: 1, nome: "Ana Lima" },
  { id: 4, nome: "Carlos Melo" },
];
const projetos = [
  { id: 10, nome: "TaskFlow" },
  { id: 26, nome: "Projeto da Dai" },
];

function abrirModal(props = {}) {
  render(
    <AuthProvider>
      <ModalTarefa
        aberto={true}
        onFechar={vi.fn()}
        onSalvar={vi.fn()}
        prioridades={prioridades}
        usuarios={usuarios}
        projetos={projetos}
        {...props}
      />
    </AuthProvider>,
  );
}

describe("ModalTarefa", () => {
  test("fechado, não mostra nada", () => {
    abrirModal({ aberto: false });

    expect(screen.queryByText("Nova tarefa")).not.toBeInTheDocument();
  });

  test("aberto para criar, mostra o título e os campos", () => {
    abrirModal();

    expect(
      screen.getByRole("heading", { name: "Nova tarefa" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Tarefa")).toHaveValue("");
    expect(screen.getByLabelText("Responsável")).toHaveValue("1");
    expect(screen.getByLabelText("Projeto")).toHaveValue("10");
    expect(screen.getByLabelText("Prioridade")).toHaveValue("2");
  });

  test("aberto para editar, vem preenchido", () => {
    const tarefa = {
      id: 7,
      texto: "Revisar a API",
      coluna: "andamento",
      idprioridade: 1,
      usuario_id: 4,
      projeto_id: 25,
    };
    abrirModal({ tarefa });

    expect(
      screen.getByRole("heading", { name: "Editar tarefa" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Tarefa")).toHaveValue("Revisar a API");
    expect(screen.getByLabelText("Responsável")).toHaveValue("4");
});
});
