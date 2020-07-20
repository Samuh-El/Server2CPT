import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import indexRoutes from "./routes/indexRoutes";
import appRoutes from "./routes/appRoutes";

class Server {
     public app: Application;

     constructor() {
          this.app = express();
          this.config();
          this.routes();
     }

     config(): void {
          const corsOptions = {
               origin: '*',
               optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
          };
          this.app.set('port', process.env.PORT || 3000);
          this.app.use(morgan('dev'));
          this.app.use(cors(corsOptions));
          this.app.use(express.json());
          this.app.use(express.urlencoded({extended:false}));
          
     }

     routes(): void {
          this.app.use("/" , indexRoutes);
          this.app.use("/api/app" , appRoutes);
     }

     start(): void {
          this.app.listen(this.app.get('port'), () => {
               console.log("Server on port ", this.app.get('port'));
          })
     }
}

const server = new Server();
server.start();