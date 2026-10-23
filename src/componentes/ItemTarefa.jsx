import styles from "./ItemTarefa.module.css";

function ItemTarefa({
  texto,
  //prioridade = "media",
  concluido = false,
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
  // const classeItem = `${styles.tarefa} ${concluida ? styles.concluida : ""} ${styles[prioridade]}`;
  // const classeTexto = concluida
  //   ? styles.textoTarefaConcluida
  //   : styles.textoTarefa;
  //const classePrioridade = `${styles["badge-prioridade"]} ${styles["badge-" + prioridade]}`;

  const classeItem = concluido ? styles.tarefa + " " + styles.concluido : styles.tarefa;

  const estiloCor = corPrioridade ? {"--cor-prioridade": corPrioridade} : undefined;

  const classeTexto = concluido ? styles.textoTarefa + " " + styles["texto-tarefa"] : styles.textoTarefa;

  return (
    <li className={classeItem} style={estiloCor}>
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

  

      <div className={styles.rodape}>
        <span className={styles["badge-prioridade"]}>{rotuloPrioridade || "Sem prioridade"}</span>

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
