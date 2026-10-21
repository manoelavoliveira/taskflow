import { useState, useEffect } from "react";
import styles from "./ModalTarefa.module.css";
import { mensagensDeErro } from "../api";
import { useAuth } from "../contexts/AuthContext";

function paraNumero(valor) {
  return valor ? Number(valor) : null;
}

function ModalTarefa({
  aberto,
  onFechar,
  onSalvar,
  tarefa = null,
  coluna = "afazer",
  prioridades = [],
  usuarios = [],
  projetos = [],
}) {
  const { usuario } = useAuth();
  const [texto, setTexto] = useState("");
  const [idPrioridade, setIdPrioridade] = useState(2);
  const [idUsuario, setIdUsuario] = useState("");
  const [idProjeto, setIdProjeto] = useState("");
  const [erros, setErros] = useState([]);
  const [salvando, setSalvando] = useState(false);
  // const [cep, setCep] = useState("");
  // const [cidade, setCidade] = useState("");
  // const [prioridade, setPrioridade] = useState("media");

  useEffect(() => {
    setErros([]);
    if (tarefa) {
      setTexto(tarefa.texto);
      setIdPrioridade(tarefa.idprioridade);
      setIdUsuario(tarefa.usuario_id);
      setIdProjeto(tarefa.projeto_id);
      // setCidade(tarefa.cidade || "");
      // setPrioridade(tarefa.prioridade);
    } else {
      setTexto("");
      setIdPrioridade(2);
      setIdUsuario(usuario?.id || usuarios[0]?.id || "");
      setIdProjeto(projetos[0]?.id || "");
      // setCidade("");
      // setPrioridade("media");
    }
  }, [tarefa, aberto]);

  useEffect(() => {
    console.log(aberto);
    if (!aberto) return;

    function handleEsc(e) {
      if (e.key === "Escape") onFechar();
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [aberto, onFechar]);

  // async function consultarCidade(cepDigitado) {
  //   if (cepDigitado.trim().length < 8) return;
  //   try {
  //     const { data } = await axios.get(
  //       `https://viacep.com.br/ws/${cepDigitado}/json/`,
  //     );
  //     if (!data.erro) setCidade(data.localidade + "/" + data.uf);
  //   } catch (e) {
  //     console.error("Erro ao consultar o CEP:", e);
  //   }
  // }

  async function handleSalvar() {
    setErros([]);
    setSalvando(true);
    try {
      await onSalvar({
        ...tarefa,
        id: tarefa?.id,
        texto,
        coluna: tarefa?.coluna || coluna,
        idprioridade: paraNumero(idPrioridade),
        usuario_id: paraNumero(idUsuario),
        projeto_id: paraNumero(idProjeto),
      });
      onFechar();
    } catch (e) {
      setErros(mensagensDeErro(e));
    } finally {
      setSalvando(false);
    }
    // // if (texto.trim() === "") return;
    // onSalvar({
    //   id: tarefa?.id,
    //   texto,
    //   // cidade,
    //   // prioridade,
    //   coluna: tarefa?.coluna || coluna,
    // });
    // onFechar();
  }

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h2>{tarefa ? "Editar tarefa" : "Nova tarefa"}</h2>
        <input
          placeholder="Texto da tarefa"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <div className={styles.campo}>
          <label htmlFor="tarefa-texto">Tarefa</label>

          <input
            id="tarefa-texto"
            placeholder="Descreva a tarefa"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="tarefa-responsavel">Responsável</label>

          <select
            id="tarefa-responsavel"
            value={idUsuario}
            onChange={(e) => setIdUsuario(e.target.value)}
          >
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="projeto">Projeto</label>

          <select
            id="projeto"
            value={idProjeto}
            onChange={(e) => setIdProjeto(e.target.value)}
          >
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <label htmlFor="prioridade">Prioridade</label>

          <select
            id="prioridade"
            value={idPrioridade}
            onChange={(e) => setIdPrioridade(e.target.value)}
          >
            {prioridades.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.nome}
              </option>
            ))}
          </select>
        </div>
        {/* <input
          placeholder="CEP (Opcional)"
          value={cep}
          onChange={(e) => {
            setCep(e.target.value);
            consultarCidade(e.target.value);
          }}
        />
        {cidade && <p className={styles.cidade}>{cidade}</p>} */}
        {/* <select
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
        >
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select> */}
        {erros.length > 0 && (
          <ul className={styles.erros}>
            {erros.map((mensagem, i) => (
              <li key={i}>{mensagem}</li>
            ))}
          </ul>
        )}
        <div className={styles.botoes}>
          <button onClick={onFechar}>Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTarefa;
