import { useEffect, useState } from "react";
import "./App.css";

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

const API = "http://localhost:3000/usuarios";

function App() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [id, setId] = useState<number | "">("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    listar();
  }, []);

  async function listar() {
    const res = await fetch(API);
    const data = await res.json();
    setUsuarios(data);
  }

  async function buscar() {
    if (!id) return alert("Informe o ID!");
    const res = await fetch(`${API}/${id}`);
    if (res.ok) {
      const data = await res.json();
      setUsuarios([data]);
    } else {
      alert("Usuário não encontrado.");
    }
  }

  async function inserir() {
    if (!nome || !email) return alert("Preencha nome e email!");
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email }),
    });
    const msg = await res.json();
    alert(msg.message);
    limparCampos();
    listar();
  }

  async function atualizar() {
    if (!id) return alert("Informe o ID!");
    const res = await fetch(`${API}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, nome, email }),
    });
    const msg = await res.json();
    alert(msg.message);
    limparCampos();
    listar();
  }

  async function deletar() {
    if (!id) return alert("Informe o ID!");
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    const msg = await res.json();
    alert(msg.message);
    limparCampos();
    listar();
  }

  function limparCampos() {
    setId("");
    setNome("");
    setEmail("");
  }

  return (
    <div className="container">
      <h1>Painel de Administração - CRUD Estudantes</h1>

      <label>ID</label>
      <input type="number" value={id} onChange={(e) => setId(Number(e.target.value) || "")} />

      <label>Nome</label>
      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

      <div className="buttons">
        <button onClick={listar}>Listar Todos</button>
        <button onClick={buscar}>Buscar por ID</button>
        <button onClick={inserir}>Inserir</button>
        <button onClick={atualizar}>Atualizar</button>
        <button className="btn-delete" onClick={deletar}>Excluir</button>
      </div>

      <table>
        <thead>
          <tr><th>ID</th><th>Nome</th><th>Email</th></tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nome}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
