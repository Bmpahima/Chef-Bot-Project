import sgMail from "@sendgrid/mail";

const key = process.env.SENDGRID_API_KEY;
if (!key) {
  console.log("Sendgrid API key is INVALID!");
}
sgMail.setApiKey(key);

export const sendMail = async (msg) => {
  try {
    console.log(key);
    const [res] = await sgMail.send(msg);
    console.log(res);
    return { ok: true, message: "Email sent.", status: res?.statusCode };
  } catch (err) {
    const sgErrors = err?.response?.body?.errors;
    const reason =
      sgErrors?.map((e) => e.message).join("; ") ||
      err.message ||
      "Unknown error";
    return { ok: false, message: "Failed sending the mail: " + reason };
  }
};
