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
          const { correo, transaccion,espectaculo } = req.body;
          console.log(correo)
          console.log(transaccion)
          console.log(espectaculo)
         

          const datos = await pool.query('SELECT  v.enlaceVideo FROM `transaccion` t inner join `espectaculo` e ON t.espectaculo_idEspectaculo = e.idEspectaculo inner join `video` v ON e.idVideo = v.idVideo WHERE (t.payer_email =\'' + correo + '\' AND t.codigoTransaccion =\'' + transaccion + '\' AND e.nombreEspectaculo =\'' + espectaculo + '\' AND e.visible =1 ) OR (t.payer_email =\'' + correo + '\' AND e.claveGenerica =\'' + transaccion + '\' AND e.nombreEspectaculo =\'' + espectaculo + '\' AND e.visible =1)')
          
           
          if(datos.length > 0){
               
               console.log(datos[0].enlaceVideo)
               const data=datos[0].enlaceVideo
               const token = jwt.sign({ _id: (datos[0].enlaceVideo) }, 'secretkey', {
                    expiresIn: "1d" // it will be expired after 10 hours
                    //expiresIn: "20d" // it will be expired after 20 days
                   //expiresIn: 120 // it will be expired after 120ms
             });
               //aqui el token puede tener mas opciones, como su tiempo de vida, cosa que tengo que modificar, para que calze con la hora de inicio y de termino de un espectaculo
               return res.status(200).json({ token,data })
          }else{
               return res.status(401).send("correo o contraseña incorrecta") 
          }
     }

     public async signinUsuario(req: any, res: any): Promise<void> {
          console.log('signinUsuario en server')
          const { run, password } = req.body;
          console.log(run)
          console.log(password)
         
          var Productor = {
               idProductor: '',
               admin:''
          }
 
          const productor = await pool.query('SELECT idProductor,admin FROM `productor` WHERE runProductor=\'' + run + '\' AND claveProductor=\'' + password + '\'')
          console.log('productor= '+productor)
          if (productor.length > 0) {
               Productor = productor[0]
               console.log('id= '+Productor.idProductor)
               console.log('admin?= '+Productor.admin)
               const user = jwt.sign({ _id: Productor.idProductor }, 'secretkey')
               return res.status(200).json({ Productor, user })
          } else {
               console.log('datos no coinciden')
               return res.status(401).send("run o password incorrecta")
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
          
          

          console.log('getInfoEspectaculos en server')
          const data = await pool.query('SELECT e.idEspectaculo as numeroEspectaculo,e.urlClipVideo, e.nombreEspectaculo as nombre,e.descripcionEspectaculo as descripcionCompleta,e.desdeHorario as horaInicio,e.hastaHorario as horaTermino,e.fechaEspectaculo as fecha,e.descripcionResumida,e.valor as precio,e.valorUSD as precioUSD,e.rutaImagenBanner as rutaBanner,e.rutaImagenAfiche as rutaAfiche,t.nombreTipo as tipoEspectaculo,p.nombreProductor as productor,a.nombreArtistas as artista FROM `espectaculo` e INNER JOIN `tipoespectaculo` t ON e.tipoEspectaculo_idTipoEspectaculo = t.idTipoEspectaculo INNER JOIN `productor` p ON e.productor_idProductor = p.idProductor INNER JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas WHERE e.visible = 1 order by e.idEspectaculo DESC');
          if (data.length > 0) {
               return res.json(data);
          }else{
               return res.status(404).json({ text: "no retorna nada" });
          }
          
     } 


     public async getInfoAdministrador(req: Request, res: Response) {
          //retorna todos los eventos
          console.log('getInfoAdministrador en server')
          const data = await pool.query('SELECT e.rutaImagenAfiche as rutaImagen,e.nombreEspectaculo as nombreEvento,e.fechaEspectaculo as fechaEvento,e.desdeHorario as horaInicioEvento,e.hastaHorario as horaTerminoEvento,e.descripcionEspectaculo as descripcionEvento,e.valor as valorEvento,e.valorUSD as valorEventoUSD,p.nombreProductor as productor,a.nombreArtistas as artista,COALESCE(SUM(t.valorTransaccion),0)as totalVentas,COALESCE(SUM(t.valorTransaccionUSD),0)as totalVentasUSD,COUNT(t.idTransaccion) as cantidadTicketsVendidos FROM `espectaculo` e inner JOIN `productor` p ON e.productor_idProductor = p.idProductor inner JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas left join `transaccion` t ON e.idEspectaculo = t.espectaculo_idEspectaculo WHERE e.visible = 1 group by e.idEspectaculo'); 
          if (data.length > 0) {
               return res.json(data);
          }else{
               return res.status(401).json({ text: "no existen eventos en db" });
          }
           
     } 

     public async getInfoProductor(req: Request, res: Response) {
          console.log('idProductor= '+req.params.id);
          var idProductor= req.params.id
          //retorna los eventos asociados a este productor
          console.log('getInfoProductor en server')
          const data = await pool.query('SELECT e.rutaImagenAfiche as rutaImagen,e.nombreEspectaculo as nombreEvento,e.fechaEspectaculo as fechaEvento,e.desdeHorario as horaInicioEvento,e.hastaHorario as horaTerminoEvento,e.descripcionEspectaculo as descripcionEvento,e.valor as valorEvento,e.valorUSD as valorEventoUSD,p.nombreProductor as productor,a.nombreArtistas as artista,COALESCE(SUM(t.valorTransaccion),0)as totalVentas,COALESCE(SUM(t.valorTransaccionUSD),0)as totalVentasUSD,COUNT(t.idTransaccion) as cantidadTicketsVendidos FROM `espectaculo` e inner JOIN `productor` p ON e.productor_idProductor = p.idProductor inner JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas left join `transaccion` t ON e.idEspectaculo = t.espectaculo_idEspectaculo WHERE e.visible = 1 and p.idProductor = '+idProductor+' group by e.idEspectaculo');
          if (data.length > 0) {
               return res.json(data);
          }else{
               return res.status(401).json({ text: "productor no posee eventos" });
          }
          
     } 


}

const appController = new AppController();
export default appController;