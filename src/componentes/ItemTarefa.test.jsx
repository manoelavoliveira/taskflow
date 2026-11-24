import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemTarefa from "./ItemTarefa";

describe("ItemTarefa", () => {
  test("mostra o texto e o rótulo da prioridade", () => {
    render(<ItemTarefa texto="Estudar Vitest" rotuloPrioridade="Alta" />);

    expect(screen.getByText("Estudar Vitest")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
  });

  test('sem prioridade, mostra "Sem prioridade"', () => {
    render(<ItemTarefa texto="Estudar Vitest" />);

    expect(screen.getByText("Sem prioridade")).toBeInTheDocument();
  });

  test("no modo lista, não mostra as setas", () => {
    render(<ItemTarefa texto="Estudar Vitest" />);

    const setaEsquerda = screen.queryByRole("button", { name: "←" });
    const setaDireita = screen.queryByRole("button", { name: "→" });
    const botaoX = screen.getByRole("button", { name: "×" });

    expect(setaEsquerda).not.toBeInTheDocument();
    expect(setaDireita).not.toBeInTheDocument();
    expect(botaoX).toBeInTheDocument();
  });

  test("na primeira coluna, só mostra a seta →", () => {
    render(
      <ItemTarefa
        texto="Estudar Vitest"
        onMover={vi.fn()}
        colunaProxima="andamento"
      />,
    );

    const setaEsquerda = screen.queryByRole("button", { name: "←" });
    const setaDireita = screen.getByRole("button", { name: "→" });

    expect(setaEsquerda).not.toBeInTheDocument();
    expect(setaDireita).toBeInTheDocument();
  });

  test("clicar na seta → chama onMover com a proxima coluna", async () => {
    const user = userEvent.setup();
    const onMover = vi.fn();
    render(
      <ItemTarefa
        texto="Estudar Vitest"
        onMover={onMover}
        colunaProxima="andamento"
      />,
    );

    await user.click(screen.getByRole("button", { name: "→" }));

    expect(onMover).toHaveBeenCalledTimes(1);
    expect(onMover).toHaveBeenCalledWith("andamento");
  });

  test("clicar no X chama o onDeletar", async () => {
    const user = userEvent.setup();
    const onDeletar = vi.fn();

    render(<ItemTarefa texto="Estudar" onDeletar={onDeletar} />);

    await user.click(screen.getByRole("button", { name: "×" }));

    expect(onDeletar).toHaveBeenCalledTimes(1);
  });

  test("duplo clique no texto chama o onEditar", async () => {
    const user = userEvent.setup();
    const onEditar = vi.fn();

    render(<ItemTarefa texto="Estudar" onEditar={onEditar} />);

    await user.dblClick(screen.getByText("Estudar"));

    expect(onEditar).toHaveBeenCalledTimes(1);
  });
});
