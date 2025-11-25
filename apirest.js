// --- IMPORTAÇÕES DE MÓDULOS ---
// Express: framework para criar servidor HTTP e rotas
import express from 'express';
// Path: manipulação de caminhos de arquivos e diretórios
import path from 'path';
// fileURLToPath: converte URL em caminho físico (necessário em ES Modules)
import { fileURLToPath } from 'url';
// App: classe personalizada onde você implementou as funções CRUD (consultas ao banco)
import { App } from './app.js';
// CORS: middleware para permitir acesso da API por aplicações externas (ex: frontend)
import cors from 'cors';

// --- CONFIGURAÇÃO DO SERVIDOR ---
const rota = express();              // Cria a aplicação Express (agora chamada "rota")
const porta = 3000;                  // Define a porta onde o servidor vai rodar

// --- CONFIGURAÇÃO DE DIRETÓRIOS ---
// Em ES Modules não existe __dirname por padrão, então precisamos recriar:
const __filename = fileURLToPath(import.meta.url); // Pega o caminho completo do arquivo atual
const __dirname = path.dirname(__filename);        // Extrai apenas o diretório
const rootDirectory = path.join(__dirname, 'public'); // Define a pasta "public" como raiz para arquivos estáticos

// --- MIDDLEWARES ---
// Permite que o servidor entenda requisições com corpo JSON
rota.use(express.json());
// Configuração do CORS: define quais origens podem acessar a API
rota.use(cors({ origin: 'http://localhost:5173' }));

// --- INSTÂNCIA DO CRUD ---
// Cria um objeto da classe App, que contém os métodos para acessar o banco de dados
const crud = new App();

// --- ROTA DE HOMEPAGE ---
// Quando acessar http://localhost:3000/ ele retorna o arquivo index.html da pasta public
rota.get('/', (req, res) => {
    res.sendFile('index.html', { root: rootDirectory });
});

// --- ROTAS RESTFUL DE USUÁRIOS ---
// Cada rota abaixo corresponde a uma operação CRUD

// READ → Listar todos os usuários
rota.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await crud.executeSearchQuery(); // Busca todos os usuários no banco
        res.status(200).json(usuarios);                   // Retorna em formato JSON
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao listar usuários.' });
    }
});

// READ → Buscar usuário por ID
rota.get('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id); // Pega o ID da URL e converte para número
    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuário inválido.' });

    try {
        const usuario = await crud.searchQueryById(id); // Busca usuário específico
        if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado.' });
        res.status(200).json(usuario);
    } catch (error) {
        console.error(`Erro ao buscar usuário ${id}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar usuário.' });
    }
});

// CREATE → Inserir novo usuário
rota.post('/usuarios', async (req, res) => {
    const { nome, email } = req.body; // Pega dados enviados no corpo da requisição
    if (!nome || !email) return res.status(400).json({ message: 'Nome e email são obrigatórios.' });

    try {
        const novoUsuario = await crud.insertQuery(nome, email); // Insere no banco
        res.status(201).json({ message: 'Usuário inserido com sucesso!', usuario: novoUsuario });
    } catch (error) {
        console.error('Erro ao inserir usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao inserir usuário.' });
    }
});

// UPDATE → Atualizar usuário existente
// OBS: aqui o ID vem no corpo da requisição, mas seria mais RESTful usar /usuarios/:id
rota.put('/usuarios', async (req, res) => {
    const { id, nome, email } = req.body; // Pega dados enviados no corpo

    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuário inválido.' });
    if (!nome && !email) return res.status(400).json({ message: 'Informe ao menos nome ou email para atualização.' });

    try {
        await crud.updateQuery(id, nome, email); // Atualiza no banco
        res.status(200).json({ message: `Usuário ${id} atualizado com sucesso!` });
    } catch (error) {
        console.error(`Erro ao atualizar usuário ${id}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
    }
});

// DELETE → Remover usuário
rota.delete('/usuarios/:id', async (req, res) => {
    const id = parseInt(req.params.id); // Pega ID da URL
    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuário inválido.' });

    try {
        await crud.deleteQuery(id); // Remove do banco
        res.status(204).send();     // 204 = No Content (sem corpo de resposta)
    } catch (error) {
        console.error(`Erro ao deletar usuário ${id}:`, error);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar usuário.' });
    }
});

// --- INICIAR SERVIDOR ---
// Faz o servidor começar a escutar na porta definida
rota.listen(porta, () => {
    console.log(`API RESTful rodando em: http://localhost:${porta}`);
});
