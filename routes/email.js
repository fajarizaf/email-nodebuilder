const EMAIL = require("../controllers/email-MailGun")

// include middleware
const { verifyToken } = require('../middleware/verifyToken')

//include lib
const { Op, QueryTypes } = require("sequelize");

const email = app => {

    app.post('/email/send', async (req, res) => {
        try {

            getTemplate = await EMAIL.queryTemplate(req.body.action)

            if (getTemplate != '') {


                let send = await EMAIL.SEND(req.body, getTemplate[0].template_body)

                res.json(send)

            } else {
                res.json({ respond: { status: 'failed', response: 'template email tidak ditemukan' } })

            }
        } catch (error) {
            res.json({ respond: { status: 'error', response: 'err msg :' + error.message } })
        }
    })


    app.post('/email/send/attachments', async (req, res) => {
        try {
            getTemplate = await EMAIL.queryTemplate(req.body.action)

            if (getTemplate != '') {

                Subject = await EMAIL.subjectTemplate(req.body.action)

                let send = await EMAIL.SEND_ATTACHMENT(req.body, getTemplate[0].template_body, Subject, req.body.attachment)

                res.json(send)

            } else {
                res.json({ respond: { status: 'failed', response: 'template email tidak ditemukan' } })
            }
        } catch (error) {
            res.json({ respond: { status: 'error', response: 'err msg :' + error.message } })
        }
    })


    app.get('/email/send/tes', async (req, res) => {
        try {

            dataEmail = {
                action: 'COC Create',
                send_to: 'fajarizaf@gmail.com',
                name: 'Maulana',
                req_number: 'REQ/23Nov/1664782115230',
                attachment: {
                    filename: '/DOC-SO-23Nov-192.pdf',
                    path: 'https://dev.mettadc.com:4010/document/collect/1/DOC-SO-23Nov-192.pdf'
                }
            }

            getTemplate = await EMAIL.queryTemplate(dataEmail.action)

            if (getTemplate != '') {

                Subject = await EMAIL.subjectTemplate(dataEmail.action)

                let send = await EMAIL.SEND_ATTACHMENT(dataEmail, getTemplate[0].template_body, Subject, dataEmail.attachment)

                res.json(send)

            } else {
                res.json({ status: 'failed', response: 'template email tidak ditemukan' })
            }
        } catch (error) {
            res.json(error)
        }
    })


    app.get('/email/list', verifyToken, async (req, res) => {
        try {
            let send = await EMAIL.LIST()
            res.json(send)
        } catch (error) {
            res.json(error)
        }
    })


    app.get('/email/detail', verifyToken, async (req, res) => {
        try {
            let send = await EMAIL.DETAIL(req.query.idtemplate)
            res.json(send)
        } catch (error) {
            res.json(error)
        }
    })


    app.post('/email/add', verifyToken, async (req, res) => {
        try {
            let send = await EMAIL.ADD(req.body)
            res.json(send)
        } catch (error) {
            res.json(error)
        }
    })

    app.put('/email/update', verifyToken, async (req, res) => {
        try {
            let send = await EMAIL.UPDATE(req.body)
            res.json(send)
        } catch (error) {
            res.json(error)
        }
    })

    app.delete('/email/delete', verifyToken, async (req, res) => {
        try {
            let send = await EMAIL.DELETE(req.body)
            res.json(send)
        } catch (error) {
            res.json(error)
        }
    })

    app.get('/email/log', verifyToken, async (req, res) => {
        try {

            var where = {}
            var stream = "DESC"
            var order = "createdAt"

            if (req.query.order) {
                var order = req.query.order
            }

            if (req.query.stream) {
                var stream = req.query.stream
            }

            where.subject = { [Op.ne]: null }

            let data = await EMAIL.Log(parseInt(req.query.page_number), parseInt(req.query.page_size), order, stream, where)

            res.send(data)

        } catch (error) {
            res.send(error)
        }
    })

}

module.exports = email