// NOTE: nodemailer ttypescript support is not great!
// @ts-nocheck

import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export default transporter;