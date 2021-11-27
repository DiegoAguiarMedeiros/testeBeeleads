const router = require('express').Router()
const db = require("../db")
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = process.env
const { verifyToken } = require('../middlewares/auth.middlewares')
router.get('/auth',  async (req, res) => {
    const { user, password } = req.body
    const authUser = await db.userAuth(user, password)
    if(authUser == 1){

        const token = jwt.sign({ user, password }, JWT_SECRET, { expiresIn: '1800s' })
        res.send(token)
    }else{
        res.sendStatus(406)
    }
})

router.get('/usuario/:id', verifyToken, async (req, res) => {
    const usuario = await db.selectUsuario(req.params.id)
    res.send(usuario)
})
router.get('/usuarios', verifyToken, async (req, res) => {
    const usuario = await db.selectUsuarios()
    res.send(usuario)
})
router.post('/cadastroUsuario', verifyToken, async (req, res) => {

    let reposta = {
        success: 0,
        mensagem: "",
    };
    let repostaError = {
        error: 0,
        errorMensagem: "",
    };

    if (!req.body.nome) {
        repostaError.error = 1;
        repostaError.errorMensagem = "Nome (nome) não informado";
        res.send(repostaError)
    }
    if (!req.body.email) {
        repostaError.error = 2;
        repostaError.errorMensagem = "E-mail (email) não informado";
        res.send(repostaError)
    }
    if (!req.body.tel) {
        repostaError.error = 3;
        repostaError.errorMensagem = "Telefone (tel) não informado";
        res.send(repostaError)

    }
    if (!req.body.data_nasc) {
        repostaError.error = 4;
        repostaError.errorMensagem = "Data de Nascimento (data_nasc) não informado";
        res.send(repostaError)

    }
    if (!req.body.sexo) {
        repostaError.error = 5;
        repostaError.errorMensagem = "Sexo (sexo) não informado";
        res.send(repostaError)

    }
    if (req.body.sexo !== 0 && req.body.sexo !== 1) {
        repostaError.error = 6;
        repostaError.errorMensagem = "Sexo inválido. Informar  0 - Feminino; 1 - Masculino";
        res.send(repostaError)

    }

    const { nome, email, tel, data_nasc, sexo } = req.body
    const usuario = {
        nome: nome,
        email: email,
        tel: tel,
        data_nasc: data_nasc,
        sexo: sexo
    }
    console.log(usuario)
    const insert = await db.insertUsuario(usuario)

    reposta.success = 1
    reposta.mensagem = "Usuário cadastrado com sucesso"
    res.send(reposta)
})


module.exports = router