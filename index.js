// Vamos construir um sevidor usano o modulo do Express.
//Este modo possue fuções para executar e malipular um servidor Node
//iniciamos e criando uma referencia do Express com a importação do modulo
const express = require("express")


// Vamos importar o modulo Mongoose que fara a interface entre o
//nodejs e o banco de dados Mongoose
const mongoose = require("mongoose");


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

app.post("/api/cliente/cadastro",(req,res)=>{
    
    const cliente = new Cliente(req.body);
    cliente.save().then(()=>{
         res.status(201).send({oninput:`Cliente cadastrado`})
    })
    .catch((erro)=>res.status(400).send({oninput:`Erro ao tentar cadastrar o cliente -> ${erro}`}))

});

app.put("/api/cliente/atualizar/:id",(req,res)=>{
    Cliente.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
      if(erro){
        return res.status(400).send({output:`Erro ao tentar atualizar ->${erro}`});
    }
    res.status(200).send({output:`Dados atualizados`}); 
})

});

app.delete("/api/cliente/apagar/:id",(req,res)=>{
    Cliente.findByIdAndDelete(req.params.id,(erro,dados)=>{
      if(erro){
          return res.status(400).send({output:`Erro ao tentar apagar o cliente->${erro}`})
      }
      res.status(204).send({});
    });

});

app.listen(3000,()=>console.log("Servidor online em http://localhost:3000"));

