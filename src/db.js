const {HOST,USER,PASS,DB,PORT} = process.env

async function connect() {
    if (global.connection && global.connection !== 'disconnected') { return global.connection }
    const mysql = require("mysql2/promise")
    const connection = mysql.createConnection("mysql://"+USER+":"+PASS+"@"+HOST+":"+PORT+"/"+DB+"")
    console.log("Conectado ao banco de dados")
    global.connection = connection
    return connection
}

connect()


async function userAuth(user, password) {
    const conn = await connect()
    const sql = "SELECT id FROM user WHERE user = ? AND pass = ?"
    const where = [user, password]
    
    const [rows] = await conn.query(sql, where)
    const [resultado] = rows
    if (resultado !== undefined && resultado.id) {
        return 1
    } else {
        return 0
    }
}
async function selectUsuario(id) {
    const conn = await connect()
    const sql = "SELECT * FROM usuario WHERE id = ?"
    const where = [id]
    const [rows] = await conn.query(sql, where)
    return await rows
}
async function selectUsuarios() {
    const conn = await connect()
    const [rows] = await conn.query("SELECT * FROM usuario")
    return await rows
}
async function insertUsuario(usuario) {
    const conn = await connect()
    const sql = "INSERT INTO usuario(NOME,EMAIL,TEL,DATA_NASC,SEXO)VALUES(?,?,?,?,?)"
    const values = [usuario.nome, usuario.email, usuario.tel, usuario.data_nasc, usuario.sexo]
    const [rows] = await conn.query(sql, values)
    return await rows
}


module.exports = { selectUsuario,selectUsuarios, insertUsuario, userAuth }