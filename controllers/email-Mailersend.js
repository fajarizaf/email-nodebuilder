import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
    apiKey: 'mlsn.e3135985baf5ec7bdf627ccfc529ffe7cfdbf2a8f35023db1e3ad774a7a45797',
});

exports.SEND = (data, templates) => new Promise((resolve, reject) => {

    const sentFrom = new Sender("info@nodebuilder.id", "Fajar");

    const recipients = [
        new Recipient("fajarizaf@gmail.com", "Fajar Riza Fauzi")
    ];

    const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("Tes Email dari mailersend")
        .setTemplateId('pxkjn4162oqgz781')

    mailerSend.email.send(emailParams)
        .then(response => {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'Email sent: ' + response,
                    }
                })
            )
        })
        .catch(error => {
            resolve(
                convertToJson({
                    respond: {
                        status: 'error',
                        response: 'Email sent: ' + e,
                    }
                })
            )
        })


})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}