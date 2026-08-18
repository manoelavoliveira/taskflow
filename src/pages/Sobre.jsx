import styles from "./Sobre.module.css";

function Sobre() {
  return (
    <div className={styles.sobre}>
      <h1>Sobre o TaskFlow</h1>

      <div className={styles.descricao}>
        <h2>O que o TaskFlow faz:</h2>
        <p>
          O TaskFlow é uma plataforma intuitiva de organização de tarefas que
          ajuda o usuário a gerenciar suas atividades do dia a dia em um quadro
          Kanban prático.
        </p>
      </div>

      <div className={styles.tecnologias}>
        <h3>Tecnologias usadas</h3>
        <ul>
          <li>React</li>
          <li>Vite</li>
          <li>Axios</li>
          <li>React Router</li>
        </ul>
      </div>

      <footer className={styles.footer}>
        <p>
          TaskFlow &copy; 2026 - Manoela Vitória Lemos de Oliveira - SENAI
          CTGAS-ER
        </p>
      </footer>
    </div>
  );
}

export default Sobre;
