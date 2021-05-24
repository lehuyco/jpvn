const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)

var mail = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: SENDER_MAIL,
      pass: SENDER_PASSWORD
    }
});

const hr = async (candidate, position) => {
    try {
        let text =
            'Vị trí: ' +
            (position && position.title) +
            ', Họ tên: ' +
            candidate.name +
            ', Điện thoại: ' +
            candidate.phone +
            ', Email: ' +
            candidate.email +
            ', Địa chỉ: ' +
            candidate.address +
            ', Nguyện vọng: ' +
            candidate.comment +
            ', Đính kèm: https://luathungviet.vn/uploads/careers/' +
            candidate._id +
            '/original.pdf'
        let html =
            '<p>Hr</p><p>Vị trí: ' +
            (position && position.title) +
            '</p><p>Họ tên: ' +
            candidate.name +
            '</p><p>Điện thoại: ' +
            candidate.phone +
            '</p><p>Email: ' +
            candidate.email +
            '</p><p>Địa chỉ: ' +
            candidate.address +
            '</p><p>Nguyện vọng: ' +
            candidate.comment +
            "</p><p>Đính kèm: <a href='https://luathungviet.vn/uploads/careers/" +
            candidate._id +
            "/original.pdf', target='_blank'>Link</a></p><p>Chi tiết: <a href='https://luathungviet.vn/admin/candidates/" +
            candidate._id +
            "', target='_blank'>Link</a></p>"

        var mailOptions = {
            from: SENDER_MAIL,
            to: RECEIVER_MAIL,
            subject:'Ứng viên mới',
            text,
            html
          };
          
        return await mail.sendMail(mailOptions);
    } catch (err) {
        console.log(err)
    }
}

// company_name, address, email, phone, service_request, country_of_origin, country_of_destination, cargo_quantity, specific_comment

const quote = async (quote) => {
    try {
        let text =
            'Tên công ty : ' +
            quote.company_name +
            ', Địa chỉ: ' +
            quote.address +
            ', Điện thoại: ' +
            quote.phone +
            ', Email: ' +
            quote.email
        let html =
            '<p>Báo giá</p><p>Tên công ty : ' +
            quote.company_name +
            '</p><p>Địa chỉ: ' +
            quote.address +
            '</p><p>Điện thoại: ' +
            quote.phone +
            '</p><p>Email: ' +
            quote.email +
            "</p><p>Chi tiết: <a href='https://luathungviet.vn/admin/quotes/" +
            quote._id +
            "', target='_blank'>Link</a></p>"

        var mailOptions = {
            from: SENDER_MAIL,
            to: RECEIVER_MAIL,
            subject:'Yêu cầu báo giá',
            text,
            html
          };
          
        return await mail.sendMail(mailOptions);
    } catch (err) {
        console.log(err)
    }
}

const contact = async (enquiry) => {
    try {
        let text =
            'Tên: ' +
            enquiry.name +
            ', Địa chỉ: ' +
            enquiry.address +
            ', Điện thoại: ' +
            enquiry.phone +
            ', Email: ' +
            enquiry.email +
            ', Yêu cầu: ' +
            enquiry.request
        let html =
            '<p>Liên hệ</p><p>Tên: ' +
            enquiry.name +
            '</p><p>Địa chỉ: ' +
            enquiry.address +
            '</p><p>Điện thoại: ' +
            enquiry.phone +
            '</p><p>Email: ' +
            enquiry.email +
            '</p><p>Yêu cầu: ' +
            enquiry.request +
            "</p><p>Chi tiết: <a href='https://luathungviet.vn/admin/enquiries/" +
            enquiry._id +
            "', target='_blank'>Link</a></p>"

        var mailOptions = {
            from: SENDER_MAIL,
            to: RECEIVER_MAIL,
            subject: 'Luathungviet.vn: Liên hệ mới',
            text,
            html
          };
          
        return await mail.sendMail(mailOptions);
    } catch (err) {
        console.log(err)
    }
}

module.exports = { hr, quote, contact }
