import ejs from "ejs";
import { Account } from "../models";
import transporter from "./mail";
import { readFileSync } from "fs";

const templates = {
    verifyAccount: ejs.compile(readFileSync("./src/templates/verifyEmail.ejs").toString())
}

export async function sendVerificationEmail(account: Account, token: string) {
    const url = `${process.env.SERVER_URL}/verify?token=${token}`
    await transporter.sendMail({
        to: {
            address: account.email,
            name: `${account.firstName} ${account.lastName}`
        },
        from: {
            name: 'BookVault',
            address: process.env.SMTP_USER!
        },
        subject: 'Verify your account',
        html: templates.verifyAccount({ url }),
        text: `Visit ${url} to verify your account`
    }, (error, info) => {
        if (error) {
            console.log(`🟧 Failed to send verification email for ${account.email}`)
        }
    })
}