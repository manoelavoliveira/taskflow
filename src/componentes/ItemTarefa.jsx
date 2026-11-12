import styles from "./ItemTarefa.module.css";

function ItemTarefa({
  texto,
  tarefa,
  concluido = false,
  rotuloPrioridade = "",
  corPrioridade = null,
  onEditar,
  onDeletar,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
  usuario = null,
  projeto = null,
}) {
  const classeItem = concluido
    ? styles.tarefa + " " + styles.concluido
    : styles.tarefa;

  const estiloCor = corPrioridade
    ? { "--cor-prioridade": corPrioridade }
    : undefined;

  const classeTexto = concluido
    ? styles.textoTarefa + " " + styles["texto-tarefa"]
    : styles.textoTarefa;

  const corFinal =
    corPrioridade ||
    tarefa?.prioridade?.cor ||
    tarefa?.prioridade_cor ||
    "#e0e0e0";
  const prioridadeObj = tarefa?.prioridade || rotuloPrioridade;
  const textoPrioridade =
    typeof prioridadeObj === "object"
      ? prioridadeObj?.nome ||
        prioridadeObj?.titulo ||
        prioridadeObj?.descricao ||
        "Sem prioridade"
      : prioridadeObj || "Sem prioridade";

  return (
    <li className={classeItem} style={{ borderLeft: `5px solid ${corFinal}` }}>
      <div className={styles.conteudoTarefa}>
        <span className={classeTexto} onDoubleClick={onEditar}>
          {texto}
        </span>
      </div>

      {(usuario || projeto) && (
        <div className={styles.info}>
          {usuario && (
            <span className={styles.infoItem}>
              <span className={styles.infoRotulo}>Responsável</span>
              {usuario}
            </span>
          )}
          {projeto && (
            <span className={styles.infoItem}>
              <span className={styles.infoRotulo}>Projeto</span>
              {projeto}
            </span>
          )}
        </div>
      )}

      <span className={styles.prioridade} style={{ backgroundColor: corFinal }}>
        {textoPrioridade}
      </span>

      <div className={styles.acoesRodape}>
        {colunaAnterior && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaAnterior)}
            title="Mover para coluna anterior"
          >
            ←
          </button>
        )}

        {colunaProxima && (
          <button
            className={styles.btnMover}
            onClick={() => onMover(colunaProxima)}
            title="Mover para próxima coluna"
          >
            →
          </button>
        )}

        <button
          className={styles.btnDeletar}
          onClick={onDeletar}
          title="Excluir"
        >
          ×
        </button>
      </div>
    </li>
  );
}

export default ItemTarefa;
