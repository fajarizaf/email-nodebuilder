// include model
const models = require('../models')
const Emaillog = models.emaillog


exports.createLogs = (to, subject, req, res) => new Promise((resolve, reject) => {
    
    Emaillog.create({
        to: to,
        subject: subject,
        req: JSON.stringify(req.body),
        res: JSON.stringify(res),
    })
    .then((respond) => {
        resolve(
            convertToJson({
                respond: {
                    status: 'success'
                }
            })
        )
    })
    .catch((e) => {
        resolve(
            convertToJson(
                {respond: {status: 'error', response: e.message}}
            )
        )
    })

})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}