const https = require("https");

const API_KEY = "afsdfsfafsfs";
const FROM = '"Sendlib" <samueltuoyo9082@gmail.com>';
const BASE_URL = "sendlib.samueltuoyo.com";

const AFFECTED_USERS = [];

function sendEmail(to, name) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      from: FROM,
      to,
      subject: "Quick update regarding your Sendlib Gmail connection",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111;">
          <p>Hi ${name},</p>
          <p>We recently rolled out an update to our Gmail integration that might have temporarily disconnected your connected email accounts on Sendlib.</p>
          <p>If you notice any of your accounts aren't sending emails, you can easily restore them by visiting your <a href="https://sendlib.samueltuoyo.com/dashboard/accounts">Gmail Accounts page</a> and reconnecting.</p>
          <p>We apologize for the interruption! The system has been fully updated to prevent this from happening again.</p>
          <p>Thanks,<br/>The Sendlib Team</p>
        </div>
      `,
    });

    const options = {
      hostname: BASE_URL,
      path: "/api/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log(`[${to}] Status: ${res.statusCode} — ${data}`);
        resolve();
      });
    });

    req.on("error", (err) => {
      console.error(`[${to}] Error: ${err.message}`);
      reject(err);
    });

    req.write(body);
    req.end();
  });
}

async function main() {
  console.log("Sending reconnection emails to affected users...\n");
  for (const user of AFFECTED_USERS) {
    await sendEmail(user.email, user.name);
  }
  console.log("\nDone.");
}

main();
