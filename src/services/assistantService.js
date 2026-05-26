const destinationService = require("./destinationService");

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

async function answer(message) {
  const text = String(message || "").trim();
  const normalized = text.toLowerCase();

  if (!text) {
    return {
      reply: "Ask me about destinations, maps, food, login, currency conversion, feedback, or how to use Travl.com.",
      results: [],
    };
  }

  const matches = await destinationService.searchDestinations(text);

  if (matches.length) {
    const [first] = matches;
    return {
      reply: `${first.name} is in ${first.region || "India"}. Open its guide for facts, food, stories, gallery, and map. Destination guides are unlocked after login so your saved journey can grow later.`,
      results: matches.slice(0, 3),
    };
  }

  if (hasAny(normalized, ["login", "sign in", "register", "account"])) {
    return {
      reply: "Use Login or Sign Up from the header. Destination guides and the library are protected, so sign in first and Travl will bring you back to the page you wanted.",
      results: [],
    };
  }

  if (hasAny(normalized, ["currency", "money", "convert", "rate"])) {
    return {
      reply: "Open Currency from the header. Rates come through the backend, so provider keys stay private instead of living in browser JavaScript.",
      results: [],
    };
  }

  if (hasAny(normalized, ["feedback", "contact", "message"])) {
    return {
      reply: "Use the contact section or the feedback tab to send corrections, suggestions, and destination ideas. Admins can review submissions from the admin panel.",
      results: [],
    };
  }

  if (hasAny(normalized, ["admin", "panel", "api", "analytics"])) {
    return {
      reply: "Admins can open the Admin panel to review destination count, feedback/contact volume, API status, and add or update destination content from the backend.",
      results: [],
    };
  }

  return {
    reply: "I can guide you around Travl.com, explain where to find maps and food notes, help with currency conversion, or suggest destinations like Taj Mahal, Hampi, Amer Fort, and Ellora Caves.",
    results: [],
  };
}

module.exports = {
  answer,
};
