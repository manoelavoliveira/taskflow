//import './App.css';
import { useState, useEffect } from "react";
import Header from "./Header";
import ListaTarefas from "./ListaTarefas";
import ItemTarefa from "./ItemTarefa";
import axios from "axios";
import ConsultarCEP from "./consultaCEP";

function TarefasV1() {
  /*const [tarefas, setTarefas] = useState((useEffect(() => {
  const tarefasSalvas = localStorage.getItem('taskflow-tarefas');
  if (tarefasSalvas){
    const dados = JSON.parse(tarefasSalvas);
    setTarefas(dados);

    if (dados.length > 0){
      setProximoId(dados[dados.length - 1].id + 1);
    }
  }
}, []);))*/

        /* <section id="formulario">
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
            placeholder="Inclua o seu CEP"
            value={cep}
            onChange={(e) => {
              setCep(e.target.value);
              buscarCep(e.target.value);
            }}
            maxLength={9}
          />

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
        </section> */

  // useEffect(() => {
  //   localStorage.setItem("taskflow-tarefas", JSON.stringify(tarefas));
  // }, [tarefas]);

    // const [tarefas, setTarefas] = useState(() => {
  //   const salvas = localStorage.getItem("taskflow-tarefas");
  //   return salvas ? JSON.parse(salvas) : [];
  // });
  // const [proximoId, setProximoId] = useState(1);

  //const [tarefas, setTarefas] = useState([]);

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

  
  /*const concluirTarefa = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  };*/
    /*async function incluirCep(cep) {
    try {
      const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      console.log("CEP Data", resposta.data);
    } catch (erro) {
      console.log(erro.message);
    }
  }*/
  // async function buscarCep(cepDigitado) {
  //   const cepLimpo = cepDigitado.replace(/\D/g, "");

  //   if (cepLimpo.length !== 8) {
  //     setCidade("");
  //     setErroCep("Digite um CEP válido.");
  //     return;
  //   }

  //   setBuscandoCep(true);
  //   setErroCep("");

  //   try {
  //     const resposta = await axios.get(
  //       `https://viacep.com.br/ws/${cepLimpo}/json/`,
  //     );

  //     console.log("Response", resposta);
  //     console.log("Response Data", resposta.data);
  //     console.log("Status", resposta.status);

  //     const data = resposta.data;

  //     if (data.erro) {
  //       throw new Error("CEP não encontrado");
  //     }

  //     setCidade(data.localidade + "/" + data.uf);

  //     console.log("Cidade:", data.localidade);
  //     console.log("UF:", data.uf);
  //     console.log("Logradouro:", data.logradouro);
  //     console.log("Bairro:", data.bairro);
  //   } catch {
  //     setErroCep("CEP inválido ou não encontrado");
  //     setCidade("");
  //   } finally {
  //     setBuscandoCep(false);
  //   }
  // }
  /*const totalTarefas = tarefasFiltradas.length;
  const pendentes = tarefasFiltradas.filter((t) => !t.concluida).length;
  const concluidas = tarefasFiltradas.filter((t) => t.concluida).length;*/

  
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

          /*total={totalTarefas}
      pendentes={pendentes}
      concluidas={concluidas}*/
  const [proximoId, setProximoId] = useState(1); 
  const [texto, setTexto] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [filtroAtual, setFiltroAtual] = useState("todas");
  const [coluna, setColuna] = useState("afazer");
  //const [carregado, setCarregado] = useState(false);

  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("taskflow-tarefas");
    if (!tarefasSalvas) {
      return [];
    }
    const tarefasConvertidas = JSON.parse(tarefasSalvas);
    return Array.isArray(tarefasConvertidas) ? tarefasConvertidas : [];
  });

  /*useEffect(() => {
  const tarefasSalvas = localStorage.getItem('taskflow-tarefas');
  if (tarefasSalvas){
    const dados = JSON.parse(tarefasSalvas);
    setTarefas(dados);

    if (dados.length > 0){
      setProximoId(dados[dados.length - 1].id + 1);
    }
  }
}, setCarregado(true));*/

  useEffect(() => {
    //if(!carregado) return;
    localStorage.setItem("taskflow-tarefas", JSON.stringify(tarefas));

    const pendentes = tarefas.filter((t) => !t.concluida).length;
    if (pendentes > 0) {
      document.title = "(" + pendentes + ") TaskFlow";
    } else {
      document.title = "TaskFlow";
    }
  }, [tarefas]);

  function adicionarTarefa() {
    if (texto.trimEnd() === "") return;

    const nova = {
      id: proximoId,
      texto: texto.trim(),
      concluida: false,
      prioridade: prioridade,
      coluna: "afazer",
    };

    setTarefas([...tarefas, nova]);
    setProximoId(proximoId + 1);
    setTexto("");
    setPrioridade("media");
    setColuna("afazer");
  }
  <ConsultarCEP />;

  function moverTarefa(id, novaColuna) {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, coluna: novaColuna } : tarefa,
      ),
    );
  }

  function deletarTarefa(id) {
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  }

  function concluirTarefa(id) {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,
      ),
    );
  }

  const filtrarTarefas = (novoFiltro) => {
    setFiltroAtual(novoFiltro);
  };

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtroAtual === "pendentes") {
      return !tarefa.concluida;
    }

    if (filtroAtual === "concluidas") {
      return tarefa.concluida;
    }

    return true;
  });
  const [cep, setCep] = useState("");

  async function consultaCep(cep) {
    try {
      const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json`);

      console.log("CEP Data", resposta.data);
    } catch (erro) {
      console.log(erro.message);
    }
  }

  return (
    <div id="app">
      {/*<Contador />*/}
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefasFiltradas}
      />

      <main className="container">
        <section id="formulario">
          <input
            id="input-tarefa"
            type="text"
            value={texto}
            placeholder="Nova tarefa..."
            required
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()}
          />
          <input
            type="text"
            placeholder="Digite o seu CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <button onClick={() => consultaCep(cep)}>Consultar CEP</button>
          <select
            id="sel-prioridade"
            name="prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
          >
            <option value="alta">🔴Alta</option>
            <option value="media">🟡Média</option>
            <option value="baixa">🟢Baixa</option>
          </select>
          <button id="btn-adicionar" type="button" onClick={adicionarTarefa}>
            Adicionar
          </button>
        </section>

        {/*<section id="filtros">
            <button type='button' className={`btn-filtro ${filtroAtual === 'todas'?'ativo' : ''}`} onClick={() =>setFiltroAtual('todas')}>Todas</button>
            <button type='button' className={`btn-filtro ${filtroAtual === 'pendentes'?'ativo' : ''}`} onClick={() =>setFiltroAtual('pendentes')}>Pendentes</button> 
            <button type='button' className={`btn-filtro ${filtroAtual === 'concluidas'?'ativo' : ''}`} onClick={() =>setFiltroAtual('concluidas')}>Concluídas</button>
        </section>*/}
        <div className="quadro">
          <div className="coluna">
            <div className="coluna-header">
              <h2>A fazer</h2>
            </div>
            {tarefas
              .filter((tarefa) => tarefa.coluna === "afazer")
              .map((tarefa) => (
                <div key={tarefa.id} className="card">
                  <ItemTarefa
                    key={tarefa.id}
                    texto={tarefa.texto}
                    prioridade={tarefa.prioridade}
                    coluna={tarefa.coluna}
                    onDeletar={() => deletarTarefa(tarefa.id)}
                    onConcluir={() => concluirTarefa(tarefa.id)}
                  />
                  {
                    <button onClick={() => moverTarefa(tarefa.id, "andamento")}>
                      →
                    </button>
                  }
                </div>
              ))}
            {/*<ListaTarefas tarefas={tarefasFiltradas} onDeletar={deletarTarefa} onConcluir={concluirTarefa}/>*/}
          </div>
          <div className="coluna">
            <div className="coluna-header">
              <h2>Em andamento</h2>
              {tarefas
                .filter((tarefa) => tarefa.coluna === "andamento")
                .map((tarefa) => (
                  <div key={tarefa.id} className="card">
                    <ItemTarefa
                      key={tarefa.id}
                      texto={tarefa.texto}
                      prioridade={tarefa.prioridade}
                      coluna={tarefa.coluna}
                      onDeletar={() => deletarTarefa(tarefa.id)}
                      onConcluir={() => concluirTarefa(tarefa.id)}
                    />
                    <button onClick={() => moverTarefa(tarefa.id, "afazer")}>
                      {" "}
                      ←{" "}
                    </button>
                    <button onClick={() => moverTarefa(tarefa.id, "concluido")}>
                      {" "}
                      →{" "}
                    </button>
                  </div>
                ))}
            </div>
            {/*<ListaTarefas tarefas={tarefasFiltradas} onDeletar={deletarTarefa} onConcluir={concluirTarefa}/>*/}
          </div>
          <div className="coluna">
            <div className="coluna-header">
              <h2>Concluídas</h2>
              {tarefas
                .filter((tarefa) => tarefa.coluna === "concluido")
                .map((tarefa) => (
                  <div key={tarefa.id} className="card">
                    <ItemTarefa
                      key={tarefa.id}
                      texto={tarefa.texto}
                      prioridade={tarefa.prioridade}
                      coluna={tarefa.coluna}
                      onDeletar={() => deletarTarefa(tarefa.id)}
                      onConcluir={() => concluirTarefa(tarefa.id)}
                    />
                    <button onClick={() => moverTarefa(tarefa.id, "andamento")}>
                      ←
                    </button>
                  </div>
                ))}
            </div>
            {/*<ListaTarefas tarefas={tarefasFiltradas} onDeletar={deletarTarefa} onConcluir={concluirTarefa}/>*/}
          </div>
        </div>
      </main>
      <footer>
        <p>TaskFlow &copy; 2026 - Manoela Vitória Lemos de Oliveira</p>
      </footer>
    </div>
  );
}

export default TarefasV1;
