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

  useEffect(() => {

    setErros([]);

    if (tarefa) {
      setTexto(tarefa.texto);
      setIdPrioridade(tarefa.idprioridade);
      setIdUsuario(tarefa.usuario_id);
      setIdProjeto(tarefa.projeto_id);
    } else {
      setTexto("");
      setIdPrioridade(2);
      setIdUsuario(usuario?.id || usuarios[0]?.id || "");
      setIdProjeto(projetos[0]?.id || "");
    }
  }, [tarefa, aberto]);

  useEffect(() => {
   if (!aberto) return; 
   console.log(aberto);
    
    function handleEsc(e) {
      if (e.key === "Escape") onFechar();
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [aberto, onFechar]);

  async function handleSalvar() {
    setErros([]);

    if (!texto.trim()) {
      setErros(["O texto é obrigatório!"]);

      return;
    }

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
  }

  if (!aberto) return null;

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <h2>{tarefa ? "Editar tarefa" : "Nova tarefa"}</h2>
        <div className={styles.campo}>
          <label htmlFor="tarefa-texto">Tarefa</label>

          <textarea
            id="tarefa-texto"
            placeholder="Descreva a tarefa"
            rows={4}
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
                {pr.descricao}
              </option>
            ))}
          </select>
        </div>

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
