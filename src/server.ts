import app from "./app.js";
import  odooService  from "./services/odooService.js";

const PORT =  3000;


app.listen(PORT, () => {
  console.log(`Servidor rodando! http://localhost:${PORT}`);
});
