// Vamos construir um sevidor usano o modulo do Express.
//Este modo possue fuções para executar e malipular um servidor Node
//iniciamos e criando uma referencia do Express com a importação do modulo
const express = require("express")

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

    res.send("Você esta na rota do GET");
});

app.post("/api/cliente/cadastro",(req,res)=>{
    
    res.send(`Os dados enviados foram ${req.body.nome}`);
});

app.put("/api/cliente/atualizar/:id",(req,res)=>{

    res.send(`O id passado foi ${req.params.id}
    e os dados ára atualizar são ${req.body}`);
});

app.delete("/api/cliente/apagar/:id",(req,res)=>{
    res.send(`O id passado foi ${req.params.id}`);
});

app.listen(3000,()=>console.log("Servidor online em http://localhost:3000"));
