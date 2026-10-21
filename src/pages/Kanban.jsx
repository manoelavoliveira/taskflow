import Header from "../componentes/Header.jsx";
import { useState, useEffect } from "react";
import ListaTarefas from "../componentes/ListaTarefas.jsx";
//import axios from "axios";
import ModalTarefa from "../componentes/ModalTarefa.jsx";
import api, { mensagensDeErro } from "../api";

//const URL_API = "https://6a85aadd9c451dc67a63ec39.mockapi.io/tarefas";

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [listaPrioridades, setListaPrioridades] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaProjetos, setListaProjetos] = useState([]);

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");

        const [resPrioridades, respTarefas, respUsuarios, respProjetos] =
          await Promise.all([
            api.get("/prioridades"),
            api.get("/tarefas"),
            api.get("/usuarios"),
            api.get("/projetos"),
          ]);

        setListaPrioridades(resPrioridades.data);
        setTarefas(respTarefas.data);
        setListaUsuarios(respUsuarios.data);
        setListaProjetos(respProjetos.data);
        // const resposta = await api.get("/tarefas");

        // setTarefas(resposta.data);
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
    // const confirmado = window.confirm(
    //   "Tem certeza que deseja deletar esta tarefa?",
    // );
    // if (!confirmado) return;
    try {
      await api.delete(`/tarefas/${id}`);

      setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
    } catch (e) {
        alert (mensagensDeErro(e).join('\n'));
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
    if (dados.id) {
      const resposta = await api.put(`/tarefas/${dados.id}`, dados);
      setTarefas(tarefas.map((t) => (t.id === dados.id ? resposta.data : t)))
      // try {
      //   const resposta = await api.post("/tarefas", dados);
      //   setTarefas([...tarefas, resposta.data]);
      // } catch (err) {
      //   setErro("Erro ao criar tarefa.");
      // }
    } else {
      const resposta = await api.post('/tarefas', dados);
      setTarefas([...tarefas, resposta.data]);
    }
      // try {
      //   const resposta = await api.put(`/tarefas/${dados.id}`, dados);
      //   setTarefas(tarefas.map((t) => (t.id === dados.id ? resposta.data : t)));
      // } catch (err) {
      //   setErro("Erro ao editar tarefa.");
      // }
    }

  async function moverTarefa(id, novaColuna) {
    const tarefa = tarefas.find(tarefa => tarefa.id === id); 
    try {
      const resposta = await api.put(`/tarefas/${id}`,
      {...tarefa, coluna: novaColuna });
      
    setTarefas(
      tarefas.map(tarefa => tarefa.id === id ? resposta.data : tarefa),
    );
    } catch (e) {
      alert (mensagensDeErro(e).join('\n'));
    }
  }

  //       {
  //         texto: dados.texto,
  //         prioridade: dados.prioridade,
  //         cidade: dados.cidade,
  //         coluna: dados.coluna,
  //       },
  //     );
  //     setTarefas((tarefasAtuais) =>
  //       tarefasAtuais.map((tarefa) =>
  //         tarefa.id === dados.id ? tarefaEditada : tarefa,
  //       ),
  //     );
  //   } else {
  //     const { data: novaTarefa } = await axios.post(URL_API, {
  //       texto: dados.texto,
  //       prioridade: dados.prioridade,
  //       cidade: dados.cidade,
  //       coluna: dados.coluna,
  //     });
  //     setTarefas((tarefasAtuais) => [...tarefasAtuais, novaTarefa]);
  //   }
  // } catch (e) {
  //   setErro("Erro ao salvar tarefa. Tente novamente.");
  //   console.error(e);

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
                  prioridades={listaPrioridades}
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
                prioridades={listaPrioridades}
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
                prioridades={listaPrioridades}
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
          prioridades={listaPrioridades}
          usuarios={listaUsuarios}
          projetos={listaProjetos}
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
