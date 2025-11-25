import { connection } from './bd.js'

export class App {
  async executeSearchQuery() {
    /** @type {import("mysql2/promise").Connection} */
    let conn;
    try {
      conn = await connection();
      let sql = "select * from estudante";

      //const [rows] = await conn.execute(sql)
      const [rows] = await conn.query(sql);

      console.log("Registro: total de tuplas", rows);

      return rows;
    } catch (error) {
      console.error("Não encontrado");
      throw error;
    } finally {
      if (conn) {
        conn.end();
      }
    }
  }

  async searchQueryById(id) {
    /** @type {import("mysql2/promise").Connection} */
    let conn;
    try {
      conn = await connection();
      let sql = "select * from estudante where id = ?";

      //const [rows] = await conn.execute(sql, [id])
      const [rows] = await conn.query(sql, id);

      console.log("Registro: total de tuplas", rows);

      return rows;
    } catch (error) {
      console.error("Não encontrado");
      throw error;
    } finally {
      if (conn) {
        conn.end();
      }
    }
  }

  async insertQuery(valor1, valor2) {
    /** @type {import("mysql2/promise").Connection} */
    let conn;
    try {
      conn = await connection();
      let sql = "INSERT INTO estudante SET ? ";
      let myname = valor1;
      let mymail = valor2;

      let dd = { nome: myname, email: mymail };

      const [rows] = await conn.query(sql, dd);

      console.log("Inserção bem-sucedida!");
      console.log(`Linhas afetadas: ${rows.affectedRows}`);
    } catch (error) {
      console.error("Não encontrado");
      throw error;
    } finally {
      if (conn) {
        conn.end();
      }
    }
  }

  async updateQuery(id, nome, email) {
    /** @type {import("mysql2/promise").Connection} */
    let conn;
    try {
      // 1. Conexão com o banco de dados
      conn = await connection();

      // 2. Criação do objeto de dados para o MySQL
      // Filtra campos que são nulos ou undefined para evitar atualizar o campo do BD com null
      let dadosParaAtualizar = {};
      if (nome) dadosParaAtualizar.nome = nome;
      if (email) dadosParaAtualizar.email = email;

      // Verifica se há algo para atualizar
      if (Object.keys(dadosParaAtualizar).length === 0) {
        console.log("Nenhum dado fornecido para atualização.");
        return { affectedRows: 0 }; // Retorna 0 se não houver o que atualizar
      }

      // 3. Consulta SQL - Usa '??' para o identificador da tabela/coluna e '?' para os valores.
      // Se a sua biblioteca mysql2/promise aceita o objeto diretamente:
      let sql = "UPDATE estudante SET ? WHERE id = ?";

      // 4. Execução da consulta, passando o objeto de dados e o ID
      const [result] = await conn.query(sql, [dadosParaAtualizar, id]); // Usa 'dadosParaAtualizar' e 'id' recebidos

      console.log("Alteração bem-sucedida!");
      console.log(`Linhas afetadas: ${result.affectedRows}`);

      // Retorna o resultado para a rota do Express
      return result;
    } catch (error) {
      console.error("Erro ao atualizar registro:", error);
      throw error;
    } finally {
      if (conn) {
        conn.end();
      }
    }
  }

  async deleteQuery(id) {
    /** @type {import("mysql2/promise").Connection} */
    let conn;
    try {
      conn = await connection();
      let sql = "delete from estudante where id = ?";
      let ids = id;

      const [rows] = await conn.query(sql, ids);

      console.log("Remoção bem-sucedida!");
      console.log(`Linhas afetadas: ${rows.affectedRows}`);
    } catch (error) {
      console.error("Não encontrado");
      throw error;
    } finally {
      if (conn) {
        conn.end();
      }
    }
  }
}




const myapp = new App()

//myapp.executeSearchQuey()

//myapp.SearchQueyById(3)

//myapp.InsertQuey()

//myapp.UpdatetQuey()

//myapp.DeletetQuey(5)


