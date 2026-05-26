const Submission = require("../models/Submission");
const { isDatabaseConnected } = require("../config/database");

async function saveSubmission(payload) {
  if (isDatabaseConnected()) {
    await Submission.create(payload);
  } else {
    console.info(`Received ${payload.type} submission from ${payload.email} (DB not connected)`);
  }

  // Forward to Formspree if environment variables are configured
  const formspreeUrl = payload.type === "feedback"
    ? process.env.FORMSPREE_FEEDBACK_URL
    : process.env.FORMSPREE_CONTACT_URL;

  if (formspreeUrl) {
    try {
      const response = await fetch(formspreeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          subject: payload.subject || "Feedback",
          message: payload.message,
          _subject: `New Travl.com ${payload.type} submission`
        })
      });
      if (!response.ok) {
        console.error(`Formspree forwarding failed: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Error forwarding to Formspree:", err);
    }
  }

  return { stored: true };
}

module.exports = {
  saveSubmission,
};
