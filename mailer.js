nodeMailer = require('nodemailer');
async function sendMail(appl,mess){
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'anastasiya.krasnova2017@gmail.com',
            pass: '****'
        }
    });
    let result = await transporter.sendMail({
        from: '"Node js" <anastasiya.krasnova2017@gmail.com>',
        to: appl,
        subject: "Message from Node js",
        text: mess,
      });
    console.log(result);
    return result;
}


module.exports = {sendMail}
