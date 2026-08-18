import Header from "./Header.jsx";
import { useState, useEffect } from "react";
import ListaTarefas from "./ListaTarefas.jsx";
import axios from "axios";

function Kanban() {
  const [tarefas, setTarefas] = useState(() => {
    const salvas = localStorage.getItem("taskflow-tarefas");
    return salvas ? JSON.parse(salvas) : [];
  });

  useEffect(() => {
    localStorage.setItem("taskflow-tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const [proximoId, setProximoId] = useState(1);
  const [texto, setTexto] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [filtroAtual, setFiltroAtual] = useState("todas");
  const [cidade, setCidade] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState("");
  const [cep, setCep] = useState("");
  useEffect(() => {
    const pendentes = tarefas.filter((t) => !t.concluida).length;
    document.title = pendentes > 0 ? `(${pendentes}) TaskFlow` : "TaskFlow";
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (texto.trim() === "") return;
    const nova = {
      id: Date.now(),
      texto: texto.trim(),
      concluida: false,
      prioridade: prioridade,
      coluna: "afazer",
      cidade: cidade
    };
    setTarefas((prevTarefas) => [...prevTarefas, nova]);
    setTexto("");
    setPrioridade("media");
    setErroCep("");
    setCep("");
    setCidade("")
  };

  const deletarTarefa = (id) => {
    setTarefas((prevTarefas) => prevTarefas.filter((tarefa) => tarefa.id !== id));
  };

  const concluirTarefa = (id) => {
    setTarefas((prevTarefas) => prevTarefas.map((tarefa) => (tarefa.id === id ? { ...t, concluida: !t.concluida } : tarefa)),
    );
  };

  const moverTarefa = (id, novaColuna) => {
    setTarefas((prevTarefas) => prevTarefas.map((tarefa) => (tarefa.id === id ? { ...tarefa, coluna: novaColuna } : tarefa)),
    );
  };

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroAtual === "pendentes") return !tarefa.concluida;
    if (filtroAtual === "concluidas") return tarefa.concluida;
    return true;
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
      setErroCep("Digite um CEP válido.")
      return;
    }

    setBuscandoCep(true);
    setErroCep("");

    try {
      const resposta = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
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

  return (
    <div id="app">
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
      /*total={totalTarefas}
      pendentes={pendentes}
      concluidas={concluidas}*/
      />
      <main className="container">
        <section id="formulario">
          <input
            id="input-tarefa"
            type="text"
            placeholder="Adicione suas tarefas..."
            required
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
          />
          <input
            id="input-Cep"
            type="text"
            placeholder="Inclua o seu CEP (Somente números)"
            value={cep}
            onChange={(e) => { setCep(e.target.value); buscarCep(e.target.value); }} maxLength={9} />

          {buscandoCep && <span>Buscando...</span>}
          {cidade && <span>{cidade}</span>}
          {erroCep && <span>{erroCep}</span>}

          <select
            id="sel-prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="alta">🔴Alta</option>
            <option value="media">🟡Média</option>
            <option value="baixa">🟢Baixa</option>
          </select>

          <button onClick={adicionarTarefa} type="button" id="btn-adicionar">
            Incluir
          </button>
          <br />
        </section>

        <div className="kanban-quadro">
          <div className="kanban-coluna afazer">
            <div className="kanban-coluna-header">
              <h2>A fazer</h2>
              <span className="kanban-contador">
                {tarefas.filter((tarefa) => tarefa.coluna === "afazer").length}
              </span>
            </div>
            <div className="kanban-lista tarefa">
              <ListaTarefas
                tarefas={tarefas.filter((tarefa) => tarefa.coluna === "afazer")}
                onDeletar={deletarTarefa}
                onConcluir={concluirTarefa}
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
                {tarefas.filter((t) => t.coluna === "andamento").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onConcluir={concluirTarefa}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          <div className="kanban-coluna concluido">
            <div className="kanban-coluna-header">
              <h2>Concluído</h2>
              <span className="kanban-contador">
                {tarefas.filter((t) => t.coluna === "concluido").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onConcluir={concluirTarefa}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>
        </div>
      </main>

      <footer>
        <p>TaskFlow &copy; 2026 - Manoela Vitória Lemos de Oliveira</p>
      </footer>
    </div>
  );
}
export default Kanban;
