import ItemTarefa from "./ItemTarefa";
const CLASSE_PRIORIDADE = { 1: 'alta', 2: 'media', 3: 'baixa'};

function ListaTarefas({
  tarefas,
  prioridades = [],
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
            // const prioridade = prioridade.find(
            //   p => p.id === tarefa.idprioridade
            // ); //o erro esta aquiiiiii
            <ItemTarefa
              key={tarefa.id}
              texto={tarefa.texto}
              prioridade={CLASSE_PRIORIDADE[tarefa.idprioridade] || 'media'}
              rotuloPrioridade={prioridades?.descricao}
              corPrioridade={tarefa.prioridade_cor}
              //rotuloPrioridade={tarefa.prioridade}
              usuario={tarefa.usuario || 'Sem responsável'}
              projeto={tarefa.projeto || 'Sem projeto'}
              // concluida={tarefa.concluida}
              // prioridade={tarefa.prioridade}
              // cidade={tarefa.cidade}
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
