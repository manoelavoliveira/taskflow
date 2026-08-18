import styles from './Header.module.css';

function Header({ titulo, subtitulo, tarefas=[]}) {

    const Total = tarefas.length;
    const Pendentes = tarefas.filter(tarefa => !tarefa.concluida).length;
    const Concluidas = tarefas.filter(tarefa => tarefa.concluida).length;

    return(
        <header className="header">
                <div className='logo'>
                    <h1>{titulo}</h1>
                    <p>{subtitulo}</p>   
                </div>        
                {/*<div id="contadores">
                    <span id="cont-total">Total: {Total}</span>
                    <span id="cont-pendentes">Pendentes: {Pendentes}</span>
                    <span id="cont-concluidas">Concluídas: {Concluidas}</span>
                </div>*/}
        </header>


    );
}

export default Header;