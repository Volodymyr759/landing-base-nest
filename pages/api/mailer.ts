import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { IEmailObject } from '../../infrastructure/interfaces/email-object.interface';

export default function (req: NextApiRequest, res: NextApiResponse): void {
	const transporter = createTransport({
		port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 2525,
		host: process.env.SMTP_HOST,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
		secure: false,
	});
	const email: IEmailObject = req.body.emailObject;
	try {
		const mailData = {
			from: process.env.SMTP_BASE_ADDRESS,
			...email
		};
		transporter.sendMail(mailData, function (err, info) {
			err ? console.log(err) : console.log(info);
		});
		res.status(200);
	} catch (e) {
		res.status(500);
	}
}