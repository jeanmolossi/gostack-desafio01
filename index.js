const express = require('express');

const server = express();

server.use(express.json());

/**
 * Variavel que irá armazenar os projetos e tarefas
 */
const projetos = [];
/**
 * MIDDLEWARE QUE VERIFICA SE EXISTE O PROJETO
 */
function checkProjetoExiste(req, res, next){
  const { id } = req.params;
  const project = projetos.find(p => p.id == id);

  if( !project ) return res.status(400).json( {error: "Projeto não encontrado"} );
  //SE NAO DER ERRO POSSIBILITA O ACESSO AO PROJECT RETORNADO PARA LISTAGEM
  res.project = project;

  return next();
}
/**
 * ROTA DE LISTAGEM DE PROJETOS
 */
server.get('/projects', (req, res) => {
  return res.json( projetos );
});
/**
 * ROTA DE LISTAGEM DE PROJETOS POR ID
 */
server.get('/projects/:id',checkProjetoExiste, (req, res) => {
  return res.json(res.project);
});
/**
 * ROTA DE CADASTRO DE NOVO PROJETO
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const newProject = { id, title, tasks: [] };
  projetos.push(newProject);
  return res.json(projetos);
});
/**
 * ROTA QUE ALTERA O TITULO DO PROJETO
 */
server.put('/projects/:id',checkProjetoExiste, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projeto = projetos.find( proj => proj.id == id );
  projeto.title = title;
  return res.json(projeto);
});
/**
 * ROTA QUE DELETA O PROJETO BASEADO NO ID DO ROUTE PARAM
 */
server.delete('/projects/:id', checkProjetoExiste, (req, res) => {
  const { id } = req.params;
  const projetoToDelete = projetos.findIndex( project => project.id == id );
  projetos.splice(projetoToDelete, 1);
  return res.json(projetos);
});
/**
 * ROTA QUE ADICIONA TAREFA AO PROJETO
 */
server.post('/projects/:id/tasks', checkProjetoExiste, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projeto = projetos.find( proj =>proj.id == id );
  projeto.tasks.push(title);
  return res.json( projeto );
});


server.listen(3000);