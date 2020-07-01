import { Request, Response, Router } from 'express';
import pool from '../database';
import jwt from 'jsonwebtoken'
// const router = Router();
const nodemailer = require('nodemailer')
const fs = require('fs');
class AppController {


     public async listBanner(req: Request, res: Response) {
          const data = await pool.query('');
          res.json(data);
     }
     public async listSalas(req: Request, res: Response) {
          const data = await pool.query('');
          res.json(data);
     }
     public async listHorarios(req: Request, res: Response) {
          const data = await pool.query('');
          res.json(data);
     }
          

     
     public guardarCompraEvento(req: Request, res: Response) {
          console.log('ingreso en guardar compra de evento en rest api')
          console.log(req);
          console.log(req.body);
          res.json({text:"entro"})
     }

     //metodos de practica
     public async signin(req: any, res: any): Promise<void> {
          const { run, transaccion } = req.body;
          console.log(run)
          console.log(transaccion)
         

          if(run=='x' && transaccion=="12345"){
               console.log('esta bien')
               const token = jwt.sign({ _id: transaccion }, 'secretkey', {
                    expiresIn: "60000" // it will be expired after 10 hours
                    //expiresIn: "20d" // it will be expired after 20 days
                   //expiresIn: 120 // it will be expired after 120ms
             });
               //aqui el token puede tener mas opciones, como su tiempo de vida, cosa que tengo que modificar, para que calze con la hora de inicio y de termino de un espectaculo
               return res.status(200).json({ token })
          }else{
               console.log('run es= '+run+' y no es x')
               console.log('transaccion es= '+transaccion+' y no es 12345')
               return res.status(418).send("correo o contraseña incorrecta") 
          }
     }

     public sendEmailContact(req: Request, res: Response) {
          var contentHTML: any;
          const { nombre, email,celular, mensaje } = req.body;
          contentHTML = `
          Mensaje de contacto de cultura para todos
          Nombre: ${nombre}
          Email: ${email}
          Celular: ${celular}
          Mensaje: ${mensaje}
         `
          console.log(contentHTML)

          let transporter = nodemailer.createTransport({
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               requireTLS: true,
               auth: {
                    user: 'productochileoficial@gmail.com',
                    pass: 'p@123!..!'
               }
          });

          let mailOptions = {
               from: 'productochileoficial@gmail.com',
               to: 'contacto@culturaparatodos.cl',
               subject: 'Contacto modal CPT de ' + nombre, //este mensaje debe ir cambiando, asi no quedan todos juntos 
               text: contentHTML
          };

          transporter.sendMail(mailOptions, (error: any, info: any) => {
               if (error) {
                    res.json({ error: error })
               }
               res.json({ text: 'enviado correctamente' })
          });
     }

     public async getInfoEspectaculos(req: Request, res: Response) {
          const data = await pool.query('SELECT e.nombreEspectaculo as nombre,e.descripcionEspectaculo as descripcionCompleta,e.desdeHorario as horaInicio,e.hastaHorario as horaTermino,DATE_FORMAT(e.fechaEspectaculo,\'%d/%m/%Y\') as fecha,e.descripcionResumida,e.valor as precio,e.rutaImagenBanner as rutaBanner,e.rutaImagenAfiche as rutaAfiche,t.nombreTipo as tipoEspectaculo,o.nombreOrganizador as organizador,a.nombreArtistas as artista FROM `espectaculo` e INNER JOIN `tipoespectaculo` t ON e.tipoEspectaculo_idTipoEspectaculo = t.idTipoEspectaculo INNER JOIN `organizador` o ON e.organizador_idOrganizador = o.idOrganizador INNER JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas WHERE e.visible = 1');
          res.json(data);
     } 
}

const appController = new AppController();
export default appController;