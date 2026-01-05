import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function mailer(to, subject, code, name, expires_in) {
  const html = `<!--
  Light-mode only email template.
  Replaces {{CODE}}, {{NAME}}, {{EXPIRE_MINUTES}}, {{VERIFY_URL}} before sending.
-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Your verification code</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      /* Force light mode in capable clients */
      :root {
        color-scheme: light;
        supported-color-schemes: light;
      }

      /* Basic resets */
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background: #ffffff !important;
      }
      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      a {
        color: inherit;
        text-decoration: none;
      }

      /* Mobile */
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 16px !important;
        }
        .column {
          display: block !important;
          width: 100% !important;
        }
        .code {
          font-size: 32px !important;
          letter-spacing: 10px !important;
        }
      }

      /* REMOVED DARK MODE MEDIA QUERY */
    </style>
  </head>

  <body
    style="
      background: #ffffff !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
    "
  >
    <!-- Preheader (hidden) -->
    <div
      style="
        display: none;
        max-height: 0px;
        overflow: hidden;
        mso-hide: all;
        font-size: 1px;
        line-height: 1px;
        color: #ffffff;
        opacity: 0;
      "
    >
      Your verification code is ${code} — it expires in ${expires_in}
      minutes.
    </div>

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      aria-hidden="false"
      style="background: #ffffff !important"
    >
      <tr>
        <td align="center" style="padding: 24px 12px">
          <!-- Outer container -->
          <table
            class="container"
            width="600"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="width: 600px; background: #ffffff !important"
          >
            <tr>
              <td align="center" style="padding: 10px 0">
                <!-- Logo -->
                <img
                  src="cid:reckon-logo"
                  alt="Company Logo"
                  width="140"
                  style="display: block; border: 0"
                />
              </td>
            </tr>

            <tr>
              <td>
                <!-- Card -->
                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  class="card"
                  style="
                    background: #ffffff !important;
                    border-radius: 12px;
                    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.08);
                    overflow: hidden;
                    color: #0f172a !important;
                  "
                >
                  <tr>
                    <td style="padding: 28px 36px; color: #0f172a !important">
                      <!-- Greeting -->
                      <p
                        style="
                          margin: 0 0 18px 0;
                          font-size: 16px;
                          color: #0f172a !important;
                        "
                      >
                        Hi ${name},
                      </p>

                      <!-- Headline -->
                      <h1
                        style="
                          margin: 0 0 18px 0;
                          font-size: 20px;
                          line-height: 1.25;
                          color: #0f172a !important;
                        "
                      >
                        Your verification code ${code}
                      </h1>

                      <!-- Copy -->
                      <p
                        style="
                          margin: 0 0 24px 0;
                          color: #475569 !important;
                          font-size: 15px;
                          line-height: 1.5;
                        "
                      >
                        Use the 6-digit code below to verify your email. This
                        code will expire in
                        <strong>${expires_in} minutes</strong>. If you
                        didn't request this, you can safely ignore this email.
                      </p>

                      <!-- Code block -->
                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        style="width: 100%; margin: 18px 0 26px 0"
                      >
                        <tr>
                          <td align="center">
                            <div
                              style="
                                display: inline-block;
                                padding: 18px 24px;
                                background: #f8fafc !important;
                                border-radius: 10px;
                                border: 1px solid #e6eef6;
                              "
                            >
                              <span
                                class="code"
                                style="
                                  display: inline-block;
                                  font-family: 'Courier New', Courier, monospace;
                                  font-size: 40px;
                                  letter-spacing: 14px;
                                  font-weight: 700;
                                  color: #0b1220 !important;
                                "
                              >
                                ${code}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA button -->
                      <table
                        role="presentation"
                        cellpadding="0"
                        cellspacing="0"
                        align="center"
                        style="margin: 0 auto 20px auto"
                      >
                        <tr>
                          <td align="center">
                            <a
                              href=""
                              class="primary-btn"
                              style="
                                display: inline-block;
                                background: #2563eb;
                                color: #ffffff !important;
                                padding: 12px 22px;
                                font-size: 16px;
                                font-weight: 600;
                                border-radius: 8px;
                                text-decoration: none;
                              "
                            >
                              Verify Email
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Alternate instructions -->
                      <p
                        style="
                          margin: 0;
                          color: #475569 !important;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        Or enter the code manually in the app if the button
                        doesn't work.
                      </p>

                      <hr
                        style="
                          border: none;
                          border-top: 1px solid #eef2f7;
                          margin: 22px 0;
                        "
                      />

                      <!-- Footer note -->
                      <p
                        style="
                          margin: 0;
                          color: #64748b !important;
                          font-size: 13px;
                          line-height: 1.5;
                        "
                      >
                        Need help? Reply to this email or contact our support.
                        This message was sent to the email you provided.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Small footer -->
            <tr>
              <td align="center" style="padding-top: 12px">
                <p
                  style="margin: 0; color: #9aa4b2 !important; font-size: 12px"
                >
                  © <span id="year">2025</span> Your Company. All rights
                  reserved.
                </p>
                <p
                  style="
                    margin: 6px 0 0 0;
                    color: #9aa4b2 !important;
                    font-size: 11px;
                  "
                >
                  If you did not request this code, you can safely ignore this
                  email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Optional JS for supported clients -->
    <script type="text/javascript">
      try {
        document.getElementById("year").innerText = new Date().getFullYear();
      } catch (e) {}
    </script>
  </body>
</html>
`;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"RECKON" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
      attachments: [
        {
          filename: "landingPage.png",
          path: "../backend/images/logo.png",
          cid: "reckon-logo",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message Sent: " + info.messageId);
  } catch (error) {
    console.log("Error Found: " + error);
    throw new Error(error);
  }
}

export default mailer;
