import mysql from 'mysql2/promise'

export async function connection(){
    try {
        const connection = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "admin",
          database: "dados",
        });
              
        return connection
        
    } catch (error) {
        console.error('Não conectado')
        throw error
    }  
}

