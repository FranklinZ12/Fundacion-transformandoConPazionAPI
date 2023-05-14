import nodemailer from 'nodemailer';

export const enviarEmailDeVerificacion = async (email, name, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Transformando con pazion" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verificación de correo electrónico',
            html: `
        <h1>Hola ${name},</h1>
        <p>Para verificar tu correo electrónico, haz clic en el siguiente enlace:</p>
        <a href="${process.env.CLIENT_URL}/verify-email/${token}">${process.env.CLIENT_URL}/verify-email/${token}</a>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
