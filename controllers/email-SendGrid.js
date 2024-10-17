// load models
const models = require('../models')
const tmp_email = models.template_email

// include libary
const sgMail = require('@sendgrid/mail')
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

    sgMail.setApiKey('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')
    const msg = {
        to: 'regeditsq@gmail.com', // Change to your recipient
        from: 'info@mettadc.com', // Change to your verified sender
        subject: subject(data),
        text: 'terimakasih',
        html: '<p>terimakasih sudah bisa</p>',
    }

    sgMail
        .send(msg)
        .then((response) => {
            resolve(
                convertToJson({
                    respond: {
                        status: 'success',
                        response: 'Email sent: ' + response,
                    }
                })
            )
        })
        .catch((e) => {
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