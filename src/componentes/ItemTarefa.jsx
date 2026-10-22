import styles from "./ItemTarefa.module.css";

function ItemTarefa({
  texto,
  //prioridade = "media",
  concluida = false,
  rotuloPrioridade = "",
  corPrioridade = null,
  onEditar,
  onDeletar,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
  usuario = null,
  projeto = null
}) {
  const classeItem = `${styles.tarefa} ${concluida ? styles.concluida : ""} ${styles[prioridade]}`;
  const classeTexto = concluida
    ? styles.textoTarefaConcluida
    : styles.textoTarefa;
  const classePrioridade = `${styles["badge-prioridade"]} ${styles["badge-" + prioridade]}`;

  return (
    <li className={classeItem}>
      <div className={styles.conteudoTarefa}>
        <span className={classeTexto} onDoubleClick={onEditar}>
          {texto}
        </span>
      </div>

      <div className={styles.painelDireito}>
        <span className={classePrioridade}>{rotuloPrioridade || prioridade}</span>

        <div className={styles.acoes}>
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
      </div>
    </li>
  );
}

export default ItemTarefa;
