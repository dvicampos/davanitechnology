const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');  // Importa nodemailer


const app = express();
const port = 3000;

const mongoURI = 'mongodb+srv://davecamp:R8dy0LYFUlCh54lp@cluster0.fdwpzyb.mongodb.net/miapp?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexión a MongoDB Atlas exitosa'))
.catch(err => console.log('Error al conectar a MongoDB Atlas:', err));

const contactoSchema = new mongoose.Schema({
    nombre: String,
    correo: String,
    numero: Number,
    mensaje: String,
    nombreempresa: String
});
const Contacto = mongoose.model('Contacto', contactoSchema);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/services', (req, res) => {
    res.render('index');
});

app.post('/services/crear', async (req, res) => {
    try {
        const { nombre, correo, numero, mensaje, nombreempresa } = req.body;
        const nuevocontacto = new Contacto({ nombre, correo, numero, mensaje, nombreempresa });
        await nuevocontacto.save();
        console.log("Contacto guardado exitosamente");

        // Configura el transportador de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // Puedes cambiar esto según tu proveedor de correo
            auth: {
                user: 'mexwebtech@gmail.com',  // Tu correo
                pass: 'dlpf kdat ykec xavx'  // Tu contraseña
            }
        });

        // Configura el correo
        const mailOptions = {
            from: 'mexwebtech@gmail.com',  // Tu correo
            to: 'dvicamp@gmail.com',  // Correo del destinatario
            subject: 'Nuevo mensaje de contacto',
            text: `Nuevo mensaje recibido:\n\nNombre: ${nombre}\nCorreo: ${correo}\nNúmero: ${numero}\nMensaje: ${mensaje}\nNombre de la empresa: ${nombreempresa}`
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
        res.redirect('/services?success=true');
    } catch (err) {
        console.error('Error al crear un nuevo contacto:', err);
        res.status(500).send('Error interno del servidor');
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
