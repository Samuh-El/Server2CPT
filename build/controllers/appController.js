"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const router = Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
class AppController {
    listBanner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default.query('');
            res.json(data);
        });
    }
    listSalas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default.query('');
            res.json(data);
        });
    }
    listHorarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.default.query('');
            res.json(data);
        });
    }
    guardarCompraEvento(req, res) {
        console.log('ingreso en guardar compra de evento en rest api');
        console.log(req);
        console.log(req.body);
        res.json({ text: "entro" });
    }
    //metodos de practica
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { run, transaccion } = req.body;
            console.log(run);
            console.log(transaccion);
            if (run == 'x' && transaccion == "12345") {
                console.log('esta bien');
                const token = jsonwebtoken_1.default.sign({ _id: transaccion }, 'secretkey', {
                    expiresIn: "60000" // it will be expired after 10 hours
                    //expiresIn: "20d" // it will be expired after 20 days
                    //expiresIn: 120 // it will be expired after 120ms
                });
                //aqui el token puede tener mas opciones, como su tiempo de vida, cosa que tengo que modificar, para que calze con la hora de inicio y de termino de un espectaculo
                return res.status(200).json({ token });
            }
            else {
                console.log('run es= ' + run + ' y no es x');
                console.log('transaccion es= ' + transaccion + ' y no es 12345');
                return res.status(418).send("correo o contraseña incorrecta");
            }
        });
    }
    sendEmailContact(req, res) {
        var contentHTML;
        const { nombre, email, celular, mensaje } = req.body;
        contentHTML = `
          Mensaje de contacto de cultura para todos
          Nombre: ${nombre}
          Email: ${email}
          Celular: ${celular}
          Mensaje: ${mensaje}
         `;
        console.log(contentHTML);
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
            subject: 'Contacto modal CPT de ' + nombre,
            text: contentHTML
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.json({ error: error });
            }
            res.json({ text: 'enviado correctamente' });
        });
    }
    getInfoEspectaculos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.json('entre en la ruta !!');
            console.log('getInfoEspectaculos en serverdsad');
            const data = yield database_1.default.query('SELECT e.nombreEspectaculo as nombre,e.descripcionEspectaculo as descripcionCompleta,e.desdeHorario as horaInicio,e.hastaHorario as horaTermino,DATE_FORMAT(e.fechaEspectaculo,\'%d/%m/%Y\') as fecha,e.descripcionResumida,e.valor as precio,e.rutaImagenBanner as rutaBanner,e.rutaImagenAfiche as rutaAfiche,t.nombreTipo as tipoEspectaculo,o.nombreOrganizador as organizador,a.nombreArtistas as artista FROM `espectaculo` e INNER JOIN `tipoespectaculo` t ON e.tipoEspectaculo_idTipoEspectaculo = t.idTipoEspectaculo INNER JOIN `organizador` o ON e.organizador_idOrganizador = o.idOrganizador INNER JOIN `artistas` a ON e.artistas_idArtistas = a.idArtistas WHERE e.visible = 1');
            if (data.length > 0) {
                return res.json(data);
            }
            res.status(404).json({ text: "no retorna nada" });
        });
    }
}
const appController = new AppController();
exports.default = appController;
