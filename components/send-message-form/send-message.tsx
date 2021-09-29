import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createNotification } from '../../infrastructure/notification';
import { IMessage } from '../../infrastructure/interfaces/message.interface';
import React from 'react';
import { IEmailObject } from '../../infrastructure/interfaces/email-object.interface';
import { NotificationType } from '../../infrastructure/enums/notification-types.enum';

export const SendMessageForm = (): JSX.Element => {
	const submitHandler = async (message: IMessage) => {
		try {
			const email: IEmailObject = {
				to: message.email,
				subject: 'Re: ' + message.subject,
				text: '',
				html: `<div>Thanks for your message, our manager will replay soon.</div>`
			};
			fetch('/api/mailer', {
				method: 'POST',
				headers: {
					'Accept': 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ emailObject: email })
			}).then((res) => {
				if (!res.ok) {
					throw new Error('Error of sending email.');
				}
			});
			createNotification('Email confirmation has sent.', NotificationType.Success);
		} catch (e) {
			createNotification('So sorry, sending email failed.', NotificationType.Error);
			console.log(e);
		}
	};

	return (
		<>
			<div className="col-lg-6 d-flex align-items-stretch contact-form-wrap">
				<Formik
					initialValues={{
						fullName: '',
						subject: '',
						email: '',
						messageText: '',
					}}
					validationSchema={Yup.object({
						fullName: Yup.string()
							.required('Required')
							.min(4, 'Full name must be 4-30 characters')
							.max(50, 'Full name must be 4-50 characters'),
						subject: Yup.string()
							.required('Required')
							.min(3, 'Company name must be 3-50 characters')
							.max(50, 'Company name must be 3-50 characters'),
						email: Yup.string()
							.required('Required')
							.email('Invalid email')
							.min(4, 'Email address must be 4-50 characters')
							.max(50, 'Email address must be 4-50 characters'),
						messageText: Yup.string()
							.required('Required')
							.min(10, 'Message text must be 10-500 characters')
							.max(500, 'Message text must be 10-500 characters')
					})
					}
					onSubmit={
						(values, { setSubmitting, resetForm }) => {
							submitHandler(values);
							resetForm();
							setSubmitting(false);
						}
					}
					validateOnMount
				>
					{props => (
						<Form method="post" role="form" className="php-email-form">
							<div className="row">
								<div className="col-md-6 form-group">
									<label htmlFor="name">Your Name</label>
									<Field name="fullName" className="form-control" type="text" placeholder="Your Name" />
									<ErrorMessage name="fullName" render={msg => <div className="form-error-message">{msg}</div>} />
								</div>
								<div className="col-md-6 form-group mt-3 mt-md-0">
									<label htmlFor="email">Your Email</label>								{/* <input tyaceholder="Your Email" required /> */}
									<Field name="email" className="form-control" type="email" placeholder="Your Email" />
									<ErrorMessage name="email" render={msg => <div className="form-error-message">{msg}</div>} />
								</div>
							</div>
							<div className="form-group mt-3">
								<label htmlFor="subject">Subject</label>
								<Field name="subject" className="form-control" type="text" placeholder="Subject" />
								<ErrorMessage name="subject" render={msg => <div className="form-error-message">{msg}</div>} />
							</div>
							<div className="form-group mt-3">
								<label htmlFor="message">Message</label>
								<Field
									as="textarea"
									name="messageText"
									className="form-control"
									rows={8}
									minLength={10}
									maxLength={500}
								/>
								<ErrorMessage
									name="messageText"
									render={msg => <div className="form-error-message">{msg}</div>}
								/>
							</div>
							<br />
							<div className="text-center">
								<button type="submit" disabled={!props.isValid || props.isSubmitting}>
									{
										props.isSubmitting ?
											<>
												<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
												<span> Loading...</span>
											</>
											:
											<span>Send Message</span>
									}
								</button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</>
	);
};
