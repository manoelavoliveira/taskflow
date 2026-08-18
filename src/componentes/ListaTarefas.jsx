import ItemTarefa from "./ItemTarefa";

function ListaTarefas({
  tarefas,
  onDeletar,
  onEditar,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  return (
    <section id="lista-section">
      {tarefas.length === 0 && (
        <p className="msg-vazia">
          Nenhuma tarefa cadastrada. Adicione uma no botão + acima!
        </p>
      )}

      {tarefas.length > 0 && (
        <ul id="lista-tarefas">
          {tarefas.map((tarefa) => (
            <ItemTarefa
              key={tarefa.id}
              texto={tarefa.texto}
              concluida={tarefa.concluida}
              prioridade={tarefa.prioridade}
              cidade={tarefa.cidade}
              onDeletar={() => onDeletar(tarefa.id)}
              onEditar={onEditar ? () => onEditar(tarefa) : undefined}
              onMover={
                onMover ? (novaColuna) => onMover(tarefa.id, novaColuna) : null
              }
              colunaAnterior={colunaAnterior}
              colunaProxima={colunaProxima}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default ListaTarefas;
