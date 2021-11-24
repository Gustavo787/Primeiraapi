// Vamos construir um sevidor usano o modulo do Express.
//Este modo possue fuções para executar e malipular um servidor Node
//iniciamos e criando uma referencia do Express com a importação do modulo
const express = require("express");


// Vamos importar o modulo Mongoose que fara a interface entre o
//nodejs e o banco de dados Mongoose
const mongoose = require("mongoose");


// Importar do modulo bcrpt para criptografia de senhas
const bcrypt = require("bcrypt");

//Jsonwebtiken é um hash que garante  a seção segura em página ou grupos de páginas
//permitindo ou não o acesso aos conteúdos desta página. Ele é gerando a partir de alguns
//elementos, tais: dados  que importam ao token(payload), chave secreta, tempo de
//expiração e método de criptografia.
const jwt = require("jsonwebtoken");

const cfn = require("./config");


const url = "mongodb+srv://gustavo:Gustavo18@clustercliente.zrloi.mongodb.net/primeiraapi?retryWrites=true&w=majority"

mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true });


// Vamos criar a estrutura da tebela clientes com o comando de Schema
const tabela = mongoose.Schema({
    nome:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    cpf:{type:String, required:true,unique:true},
    usuario:{type:String, required:true,unique:true},
    senha:{type:String, required:true,unique:true},
});

// Aplicação da criptografia do bcrypt a tabela de cadastro
// de clientes será um passo antes do salvamento
// vamos usar o comando pre
tabela.pre("save",function(next){
    let cliente = this;
    if(!cliente.isModified(`senha`)) return next()
    bcrypt.hash(cliente.senha,10,(erro,rs)=>{
        if(erro) return console.log(`erro ao gerar senha ->${erro}`);
        cliente.senha = rs
        return next();
    });
});


// execução da tabela
const Cliente = mongoose.model("tbcliente",tabela);



// criar uma referência do servidor express para utilizá-lo
const app = express();

// fazer o servidor express receber e traatr dados em formato json
app.use(express.json());

/*
Abaixo, iremos criar as 4 rotas para os verbos GET, POST, PUT, DELETE:
    -GET -> Esse verbo é ultilizado todas as vezes que o usuário requisita
    alguma informação ao servidor e, este por sua vez responde;

    -POST -> É ultilizado todas as vezes q o usuario quiser cadastrar um cliente 
    ou eviar uym dado importante ao servidor
    
    -PUT -> É usado qunadfo se deseja atualizar algum dado sobre um objeto

    DELETE -> É usado para apoagar um dado sobre um objeto

    Ao final das rotas iremos aolicar ao servidor uma porta de comunicação. No nosso 
    caso será a porta 3000
*/


app.get("/api/cliente/",(req,res)=>{
    Cliente.find((erro,dados)=>{
        if (erro){
            return res.status(400).send({oninput:`Erro ao temtar ler os clientes -> ${erro}`});
        }
        res.status(200).send({oninput:dados});
    }
        
    );
});

app.get("/api/cliente/:id",(req,res)=>{
    Cliente.findById(req.params.id,(erro,dados)=>{
        if (erro){
            return res.status(400).send({output:`Erro ao temtar ler os clientes -> ${erro}`});
        }
        res.status(201).send({oninput:dados})
    }
        
    );
});



app.post("/api/cliente/cadastro",(req,res)=>{
    
    const cliente = new Cliente(req.body);
    cliente.save().then(()=>{
        const gerado = criarToken(req.body.usuario, req.body.nome);
        res.status(201).send({oninput:`Cliente cadastrado`, token:gerado});
    })
    .catch((erro)=>res.status(400).send({oninput:`Erro ao tentar cadastrar o cliente -> ${erro}`}))

});



app.post("/api/cliente/login",(req,res)=>{
    const us = req.body.usuario;
    const sh = req.body.senha;
    Cliente.findOne({usuario:us},(erro,dados)=>{
        if(erro){
           return res.status(400).send({output:`Usuario não localizado ->${erro}`})
        }
        
        bcrypt.compare(sh,dados.senha,(erro,igual)=>{
            if(erro) return res.status(400).send({output:`Erro ao tentar logar->${erro}`});
            if(!igual) return res.status(400).send({output:`Erro ao tentar logar senha->${erro}`});
            const gerado = criarToken(dados.usuario,dados.nome);
            res.status(200).send({output:`Logado`,palyload:dados, token:gerado});
        })

    })
});

app.put("/api/cliente/atualizar/:id", verifica, (req,res)=>{
    Cliente.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
      if(erro){
        return res.status(400).send({output:`Erro ao tentar atualizar ->${erro}`});
    }
    res.status(200).send({output:`Dados atualizados`}); 
});

});

app.delete("/api/cliente/apagar/:id", verifica, (req,res)=>{
    Cliente.findByIdAndDelete(req.params.id,(erro,dados)=>{
      if(erro){
          return res.status(400).send({output:`Erro ao tentar apagar o cliente->${erro}`})
        }
      res.status(204).send({});
    });

});

// Gerar token
const criarToken=(usuario, nome)=>{
    return jwt.sign({usuario:usuario, nome:nome}, cfn.jwt_key,{expiresIn:cfn.jwt_expires});
    
};


// Validção do token
function verifica(req,res,next){
    const token_gerado = req.headers.token;
    if(!token_gerado)
        return res.status(401).send({output:"Token não encontrado"});

    jwt.verify(token_gerado, cfn.jwt_key,(erro,dados)=>{
        if(erro){
            return res.status(401).send({output:"Token inválido"});
        }
         res.status(200).send({output:`Autorizado`,palyload:`Olá ${dados.nome}`});
         next();
    });
};

app.listen(3000,()=>console.log("Servidor online em http://localhost:3000"));

