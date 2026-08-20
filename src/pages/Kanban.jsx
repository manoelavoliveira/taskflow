import Header from "../componentes/Header.jsx";
import { useState, useEffect } from "react";
import ListaTarefas from "../componentes/ListaTarefas.jsx";
import axios from "axios";
import ModalTarefa from "../componentes/ModalTarefa.jsx";

const URL_API = "https://6a85aadd9c451dc67a63ec39.mockapi.io/tarefas";

function Kanban() {
  // const [tarefas, setTarefas] = useState(() => {
  //   const salvas = localStorage.getItem("taskflow-tarefas");
  //   return salvas ? JSON.parse(salvas) : [];
  // });
  // const [proximoId, setProximoId] = useState(1);
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [cidade, setCidade] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [cep, setCep] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true); 

  // useEffect(() => {
  //   localStorage.setItem("taskflow-tarefas", JSON.stringify(tarefas));
  // }, [tarefas]);
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

  // const adicionarTarefa = () => {
  //   if (texto.trim() === "") return;
  //   const nova = {
  //     id: proximoId,
  //     texto: texto.trim(),
  //     concluida: false,
  //     prioridade: prioridade,
  //     coluna: "afazer",
  //     cidade: cidade,
  //   };
  //   //setTarefas((prevTarefas) => [...prevTarefas, nova]);
  //   setTarefas([...tarefas, nova]);
  //   setProximoId(proximoId + 1);
  //   setTexto("");
  //   setPrioridade("media");
  //   setErroCep("");
  //   setCep("");
  //   setCidade("");
  // };

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

  /*const concluirTarefa = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };*/

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

  /*async function incluirCep(cep) {
    try {
      const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      console.log("CEP Data", resposta.data);
    } catch (erro) {
      console.log(erro.message);
    }
  }*/
  async function buscarCep(cepDigitado) {
    const cepLimpo = cepDigitado.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      setCidade("");
      setErroCep("Digite um CEP válido.");
      return;
    }

    setBuscandoCep(true);
    setErroCep("");

    try {
      const resposta = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );

      console.log("Response", resposta);
      console.log("Response Data", resposta.data);
      console.log("Status", resposta.status);

      const data = resposta.data;

      if (data.erro) {
        throw new Error("CEP não encontrado");
      }

      setCidade(data.localidade + "/" + data.uf);

      console.log("Cidade:", data.localidade);
      console.log("UF:", data.uf);
      console.log("Logradouro:", data.logradouro);
      console.log("Bairro:", data.bairro);
    } catch {
      setErroCep("CEP inválido ou não encontrado");
      setCidade("");
    } finally {
      setBuscandoCep(false);
    }
  }
  /*const totalTarefas = tarefasFiltradas.length;
  const pendentes = tarefasFiltradas.filter((t) => !t.concluida).length;
  const concluidas = tarefasFiltradas.filter((t) => t.concluida).length;*/

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

  // function salvarTarefa(dados) {
  //   if (dados.id !== undefined) {
  //     setTarefas(
  //       tarefas.map((tarefa) =>
  //         (tarefa.id === dados.id ? { ...tarefa, ...dados } : tarefa)),
  //     );
  //   } else {
  //     const novaTarefa = {
  //       ...dados,
  //       id: proximoId
  //     };
  //     setTarefas([...tarefas, novaTarefa]);
  //     setProximoId ( proximoId + 1 );
  //   }
  // }

  return (
    <div id="app">
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        /*total={totalTarefas}
      pendentes={pendentes}
      concluidas={concluidas}*/
        tarefas={tarefas}
      />
      <main className="container">
        {/* Feedback de carregamento */}
        {carregando && (
          <p style={{ textAlign: "center", color: "#94A3B8" }}>
            Carregando tarefas...
          </p>
        )}

        {/* Feedback de erro */}
        {erro && (
          <p style={{ textAlign: "center", color: "#EF4444" }}>{erro}</p>
        )}

        {/* Quadro Kanban — so aparece quando nao esta carregando */}

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
