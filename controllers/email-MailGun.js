// load models
const models = require('../models')
const tmp_email = models.template_email

// include libary
const mailgun = require("mailgun-js");
const handlebars = require('handlebars')
const path = require('path')
const fs = require('fs')

// global envi variable
const fromEmail = process.env.FROM_EMAIL
const userEmail = process.env.USER_AUTH_EMAIL
const userPass = process.env.USER_AUTH_PASSWORD

const filePath = path.join(__dirname, '../emails/template.html');
const source = fs.readFileSync(filePath, 'utf-8').toString();
const templated = handlebars.compile(source);


function subject(params) {
    switch (params.action) {
        case "User Activation":
            return "Link Aktivasi Pengguna Baru"
            break;
        case "User Verification":
            return "Informasi Login Pengguna"
            break;
        case "Forgot Password":
            return "Link perubahan password baru"
            break;
        default:
            break;
    }
}

exports.SEND = (data, templates) => new Promise((resolve, reject) => {

    const DOMAIN = 'sandbox3f1517ac852d490b8cde5f7a1df9eb20.mailgun.org';
    const mg = mailgun({ apiKey: 'b5a6637ba56df151f1dfadf7cdc7d09d-5dcb5e36-d63b8785', domain: DOMAIN });
    const data = {
        from: 'MettaDC <info@nodebuilder.id>',
        to: 'fajarizaf@gmail.com',
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!'
    };
    mg.messages().send(data, function (error, body) {

        if (error == '') {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'Email sent: ' + body,
                    }
                })
            )
        } else {
            resolve(
                convertToJson({
                    respond: {
                        status: 'error',
                        response: 'Email sent: ' + error,
                    }
                })
            )
        }


    });



})


function getTemplate(template, context) {

    const template_bodys = handlebars.compile(template)

    const body_template = template_bodys(context)

    const section = {
        body: body_template
    }
    return templated(section)

}


exports.queryTemplate = (action) => new Promise((resolve, reject) => {
    tmp_email.findAll({
        where: { template_name: action },
    })
        .then((respond) => {
            if (respond != '') {
                resolve(convertToJson(respond))
            } else {
                resolve(convertToJson({ status: 'failed', response: 'template tidak ditemukan' }))
            }
        })
        .catch((e) => {
            reject(
                convertToJson(
                    { status: 'failed', response: 'ada kesalahan pada proses penarikan' }
                )
            )
        })
})


//controller update template email
exports.ADD = (data) => new Promise((resolve, reject) => {
    tmp_email.create({
        template_name: data.template_name,
        template_body: data.template_body,
    })
        .then((respond) => {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'create template email telah berhasil',
                        id: respond.id,
                    }
                })
            )
        })
        .catch((e) => {
            resolve(
                convertToJson(
                    { status: 'failed' }
                )
            )
        })
})


//controller update template email
exports.UPDATE = (data) => new Promise((resolve, reject) => {
    tmp_email.update({
        template_name: data.template_name,
        template_body: data.template_body,
    }, {
        where: {
            id: data.id
        }
    })
        .then((respond) => {
            if (respond != '') {
                resolve(
                    convertToJson({
                        respond: {
                            status: 'success',
                            response: 'update template email telah berhasil',
                        }
                    })
                )
            } else {
                convertToJson({
                    respond: {
                        status: 'failed',
                        response: 'update template email gagal dilakukan',
                    }
                })
            }
        })
        .catch((e) => {
            resolve(
                convertToJson(
                    { status: 'error' }
                )
            )
            console.log(e)
        })
})


//controller update template email
exports.DELETE = (data) => new Promise((resolve, reject) => {
    tmp_email.destroy({
        where: {
            id: data.id
        }
    })
        .then((respond) => {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'delete template email telah berhasil',
                    }
                })
            )
        })
        .catch((e) => {
            resolve(
                convertToJson(
                    { status: 'failed' }
                )
            )
            console.log(e)
        })
})


function convertToJson(strings) {
    let string = JSON.stringify(strings)
    return JSON.parse(string)
}