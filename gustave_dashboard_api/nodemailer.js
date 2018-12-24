
const nodemailer = require('nodemailer');
// we use the gamil smtp server after creating a personal gmail account
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //
    port: 465,
    auth: {
        user: 'this.is.a.test.for.dev@gmail.com',
        pass: '123456789Abc'
    }
});


var sendMail = (command, decision) => {
    let message ;
    // if we accepted the command the decision variable will be 1 else -1 
    if(decision === 1) 
        message = 'Votre commande a été traité par Gustave. Un coursier vous contactera et vous livrera la commande le plus tôt possible. Merci de bien vouloir choisir Gustave.';
    else
        message = 'Merci de bien vouloir choisir Gustave. Malheuresement votre demande n\'a pas été acceptée.';


    let mailOptions = {
        from: '"Gustave 👻"', // sender address
        to: command.email, // list of receivers
        subject: '-- Votre commande chez Gustave --', // Subject line
        text: message, // plain text body
        html: `<p>Bonjour ${command.nom[0].toUpperCase() + command.nom.substring(1)},</p><p>${message}</p><p>A très bientot<br/>Merci Gustave</p>` // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
}

module.exports = { send: sendMail};