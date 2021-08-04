const nodemailer = require("nodemailer");

const EmailTemplate = require("email-templates").EmailTemplate;
const path = require("path");
const Promise = require("bluebird");

async function send_mail(email, subject, text, priority = 0) {
	
	let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "truskillpro@gmail.com", // generated ethereal user
          pass: "08108273445", // generated ethereal password
        },
      });
  
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Iyke" <truskillpro@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: text, // html body
      });
  
      console.log("Message sent: %s", info.messageId);
	
}
function loadTemplate(templateName, contexts) {
	let template = new EmailTemplate(
		path.join(__dirname, "Mailer", templateName)
	);
	return Promise.all(
		contexts.map((context) => {
			return new Promise((resolve, reject) => {
				template.render(context, (err, result) => {
					if (err) reject(err);
					else
						resolve({
							email: result,
							context,
						});
				});
			});
		})
	);
}


exports.sendInvoiceMail = async function (user) {
	loadTemplate("invoiceMail", user).then((results) => {
		return Promise.all(
			results.map((result) => {
				send_mail(
					result.context.email,
					result.email.subject,
					result.email.html,
					1
				);
			})
		);
	});
};

exports.sendRandomMail = async function(user){
    loadTemplate("randomMail", user).then((results) => {
		return Promise.all(
			results.map((result) => {
				send_mail(
					result.context.email,
					result.email.subject,
					result.email.html,
					1
				);
			})
		);
	});
}