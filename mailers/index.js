const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_API_KEY);

const welcome = async (email) => {
  console.log("Send welcome email to " + email);
  const msg = {
    to: email,
    from: COMPANY_EMAIL,
    templateId: "d-2a95011757064e5a88dfe8597128fa14",
    dynamic_template_data: {
      subject: "Chào mừng bạn đến với cổng việc làm hàng hải",
    },
  };
  sgMail.send(msg);
};

const newCompany = async () => {
  console.log("New company ");
  const msg = {
    to: COMPANY_EMAIL,
    from: COMPANY_EMAIL,
    templateId: "d-3e83f6c54f0c4779b71b40e6f4bff4d9",
    dynamic_template_data: {
      subject: "Có công ty mới đăng ký trên hệ thống",
    },
  };
  sgMail.send(msg);
};

const companyApproved = async (email) => {
  console.log("Company Approved " + email);
  const msg = {
    to: email,
    from: COMPANY_EMAIL,
    templateId: "d-b35c2c0fdef04be881deadfb6c44f07c",
    dynamic_template_data: {
      subject: "Công ty của bạn đã được duyệt",
    },
  };
  sgMail.send(msg);
};

const hr = async (candidate, position) => {
  try {
    let text =
      "Vị trí: " +
      (position && position.title) +
      ", Họ tên: " +
      candidate.name +
      ", Điện thoại: " +
      candidate.phone +
      ", Email: " +
      candidate.email +
      ", Địa chỉ: " +
      candidate.address +
      ", Nguyện vọng: " +
      candidate.comment +
      ", Đính kèm: https://jpvngroup.com/uploads/careers/" +
      candidate._id +
      "/original.pdf";
    let html =
      "<p>Hr</p><p>Vị trí: " +
      (position && position.title) +
      "</p><p>Họ tên: " +
      candidate.name +
      "</p><p>Điện thoại: " +
      candidate.phone +
      "</p><p>Email: " +
      candidate.email +
      "</p><p>Địa chỉ: " +
      candidate.address +
      "</p><p>Nguyện vọng: " +
      candidate.comment +
      "</p><p>Đính kèm: <a href='https://jpvngroup.com/uploads/careers/" +
      candidate._id +
      "/original.pdf', target='_blank'>Link</a></p><p>Chi tiết: <a href='https://jpvngroup.com/admin/candidates/" +
      candidate._id +
      "', target='_blank'>Link</a></p>";
    const msg = {
      to: COMPANY_EMAIL,
      from: COMPANY_EMAIL,
      cc: COMPANY_EMAIL,
      bcc: ["vuonganh91@gmail.com"],
      subject: "Ứng viên mới",
      text,
      html,
    };
    sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
};

// company_name, address, email, phone, service_request, country_of_origin, country_of_destination, cargo_quantity, specific_comment

const quote = async (quote) => {
  try {
    let text =
      "Tên công ty : " +
      quote.company_name +
      ", Địa chỉ: " +
      quote.address +
      ", Điện thoại: " +
      quote.phone +
      ", Email: " +
      quote.email;
    let html =
      "<p>Báo giá</p><p>Tên công ty : " +
      quote.company_name +
      "</p><p>Địa chỉ: " +
      quote.address +
      "</p><p>Điện thoại: " +
      quote.phone +
      "</p><p>Email: " +
      quote.email +
      "</p><p>Chi tiết: <a href='https://jpvngroup.com/admin/quotes/" +
      quote._id +
      "', target='_blank'>Link</a></p>";
    const msg = {
      to: COMPANY_EMAIL,
      from: COMPANY_EMAIL,
      cc: COMPANY_EMAIL,
      bcc: ["vuonganh91@gmail.com"],
      subject: "Yêu cầu báo giá",
      text,
      html,
    };
    sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
};

const contact = async (enquiry) => {
  try {
    let text =
      "Tên: " +
      enquiry.name +
      ", Địa chỉ: " +
      enquiry.address +
      ", Điện thoại: " +
      enquiry.phone +
      ", Email: " +
      enquiry.email +
      ", Yêu cầu: " +
      enquiry.request;
    let html =
      "<p>Liên hệ</p><p>Tên: " +
      enquiry.name +
      "</p><p>Địa chỉ: " +
      enquiry.address +
      "</p><p>Điện thoại: " +
      enquiry.phone +
      "</p><p>Email: " +
      enquiry.email +
      "</p><p>Yêu cầu: " +
      enquiry.request +
      "</p><p>Chi tiết: <a href='https://jpvngroup.com/admin/enquiries/" +
      enquiry._id +
      "', target='_blank'>Link</a></p>";
    const msg = {
      to: COMPANY_EMAIL,
      from: COMPANY_EMAIL,
      cc: COMPANY_EMAIL,
      bcc: ["vuonganh91@gmail.com"],
      subject: "Yêu cầu mới",
      text,
      html,
    };
    sgMail.send(msg);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { welcome, newCompany, companyApproved, hr, quote, contact };
