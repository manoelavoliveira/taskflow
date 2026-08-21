import Header from "../componentes/Header.jsx";
import { useState, useEffect } from "react";
import ListaTarefas from "../componentes/ListaTarefas.jsx";
import axios from "axios";
import ModalTarefa from "../componentes/ModalTarefa.jsx";

const URL_API = "https://6a85aadd9c451dc67a63ec39.mockapi.io/tarefas";

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");

        const resposta = await axios.get(URL_API);

        setTarefas(resposta.data);
      } catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexao.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

  useEffect(() => {
    const pendentes = tarefas.filter(
      (tarefa) => tarefa.coluna === "afazer",
    ).length;
    if (pendentes > 0) {
      document.title = `(${pendentes}) TaskFlow`;
    } else {
      document.title = "TaskFlow";
    }
  }, [tarefas]);

  async function deletarTarefa(id) {
    const confirmado = window.confirm(
      "Tem certeza que deseja deletar esta tarefa?",
    );
    if (!confirmado) return;
    try {
      await axios.delete(URL_API + "/" + id);

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.filter((tarefa) => tarefa.id !== id),
      );
    } catch (e) {
      setErro("Erro ao deletar tarefa. Tente novamente.");
      console.error(e);
    }
  }

  async function moverTarefa(id, novaColuna) {
    try {
      const { data: tarefaMovida } = await axios.put(URL_API + "/" + id, {
        coluna: novaColuna,
      });

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefa) =>
          tarefa.id === id ? tarefaMovida : tarefa,
        ),
      );
    } catch (e) {
      setErro("Erro ao mover tarefa. Tente novamente.");
      console.error(e);
    }
  }

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroPrioridade === "todas") return true;
    return tarefa.prioridade === filtroPrioridade;
  });

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  async function salvarTarefa(dados) {
    try {
      if (dados.id !== undefined) {
        const { data: tarefaEditada } = await axios.put(
          URL_API + "/" + dados.id,
          {
            texto: dados.texto,
            prioridade: dados.prioridade,
            cidade: dados.cidade,
            coluna: dados.coluna,
          },
        );
        setTarefas((tarefasAtuais) =>
          tarefasAtuais.map((tarefa) =>
            tarefa.id === dados.id ? tarefaEditada : tarefa,
          ),
        );
      } else {
        const { data: novaTarefa } = await axios.post(URL_API, {
          texto: dados.texto,
          prioridade: dados.prioridade,
          cidade: dados.cidade,
          coluna: dados.coluna,
        });
        setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
      }
    } catch (e) {
      setErro("Erro ao salvar tarefa. Tente novamente.");
      console.error(e);
    }
  }

  return (
    <div id="app">
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />
      <main className="container">
        {carregando && (
          <p style={{ textAlign: "center", color: "#94A3B8" }}>
            Carregando tarefas...
          </p>
        )}

        {erro && (
          <p style={{ textAlign: "center", color: "#EF4444" }}>{erro}</p>
        )}

        <div className="filtro-prioridade">
          <label>Filtrar por prioridade: </label>
          <select
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="alta" className="alta">
              Alta
            </option>
            <option value="media">Media</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
        {!carregando && !erro && (
          <div className="kanban-quadro">
            <div className="kanban-coluna afazer">
              <div className="kanban-coluna-header">
                <h2>A fazer</h2>
                <span className="kanban-contador">
                  {
                    tarefas.filter((tarefa) => tarefa.coluna === "afazer")
                      .length
                  }
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("afazer")}
                >
                  {" "}
                  +{" "}
                </button>
              </div>
              <div className="kanban-lista tarefa">
                <ListaTarefas
                  tarefas={tarefasFiltradas.filter(
                    (tarefa) => tarefa.coluna === "afazer",
                  )}
                  onDeletar={deletarTarefa}
                  onEditar={abrirModalEditar}
                  onMover={moverTarefa}
                  colunaAnterior={null}
                  colunaProxima="andamento"
                />
              </div>
            </div>

            <div className="kanban-coluna andamento">
              <div className="kanban-coluna-header">
                <h2>Em andamento</h2>
                <span className="kanban-contador">
                  {
                    tarefas.filter((tarefa) => tarefa.coluna === "andamento")
                      .length
                  }
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("andamento")}
                >
                  {" "}
                  +{" "}
                </button>
              </div>
              <ListaTarefas
                tarefas={tarefasFiltradas.filter(
                  (tarefa) => tarefa.coluna === "andamento",
                )}
                onDeletar={deletarTarefa}
                onEditar={abrirModalEditar}
                onMover={moverTarefa}
                colunaAnterior="afazer"
                colunaProxima="concluido"
              />
            </div>

            <div className="kanban-coluna concluido">
              <div className="kanban-coluna-header">
                <h2>Concluído</h2>
                <span className="kanban-contador">
                  {
                    tarefas.filter((tarefa) => tarefa.coluna === "concluido")
                      .length
                  }
                </span>
                <button
                  className="kanban-btn-add"
                  onClick={() => abrirModalCriar("concluido")}
                >
                  {" "}
                  +{" "}
                </button>
              </div>
              <ListaTarefas
                tarefas={tarefasFiltradas.filter(
                  (tarefa) => tarefa.coluna === "concluido",
                )}
                onDeletar={deletarTarefa}
                onEditar={abrirModalEditar}
                onMover={moverTarefa}
                colunaAnterior="andamento"
                colunaProxima={null}
              />
            </div>
          </div>
        )}
        <ModalTarefa
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onSalvar={salvarTarefa}
          tarefa={tarefaEditando}
          coluna={colunaAtiva}
        />
      </main>
      <footer>
        <p>
          TaskFlow &copy; 2026 - Manoela Vitória Lemos de Oliveira - SENAI
          CTGAS-ER
        </p>
      </footer>
    </div>
  );
}
export default Kanban;
