import styles from "./ItemTarefa.module.css";

function ItemTarefa({
  texto,
  prioridade = "media",
  concluida = false,
  cidade,
  onEditar,
  onDeletar,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  const classeItem = `${styles.tarefa} ${concluida ? styles.concluida : ""} ${styles[prioridade]}`;
  const classeTexto = concluida
    ? styles.textoTarefaConcluida
    : styles.textoTarefa;
  const classePrioridade = `${styles["badge-prioridade"]} ${styles["badge-" + prioridade]}`;

  return (
    <li className={classeItem}>
      {/* Conteúdo Principal (Texto + Cidade) */}
      <div className={styles.conteudoTarefa}>
        <span className={classeTexto} onDoubleClick={onEditar}>
          {texto}
        </span>

        {cidade && <span className={styles.cidadeTag}>📍 {cidade}</span>}
      </div>

      {/* Lado Direito (Badge + Ações) */}
      <div className={styles.painelDireito}>
        <span className={classePrioridade}>{prioridade}</span>

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
