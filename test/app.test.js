const assert = require("node:assert/strict");
const { Readable, Duplex } = require("node:stream");
const http = require("node:http");
const { test } = require("node:test");

process.env.NODE_ENV = "test";
process.env.SESSION_SECRET = "test-session-secret";
process.env.MDBKEY = "";
process.env.MONGODB_URI = "";

const app = require("../src/app");

const signedInUser = {
  id: "test-user",
  name: "Test Traveller",
  email: "traveller@example.com",
  role: "traveller",
};

class SilentSocket extends Duplex {
  _read() {}

  _write(_chunk, _encoding, callback) {
    callback();
  }
}

function inject(method, url, body, options = {}) {
  return new Promise((resolve, reject) => {
    const payload = typeof body === "string" ? Buffer.from(body) : null;
    let sentPayload = false;
    const req = new Readable({
      read() {
        if (payload && !sentPayload) {
          this.push(payload);
          sentPayload = true;
        }
        this.push(null);
      },
    });

    req.method = method;
    req.url = url;
    if (options.sessionUser) {
      req.session = { user: options.sessionUser };
    }
    if (body && typeof body === "object") {
      req.body = body;
    }
    req.headers = { host: "localhost" };
    if (payload) {
      req.headers["content-type"] = "application/x-www-form-urlencoded";
      req.headers["content-length"] = String(payload.length);
    }

    const res = new http.ServerResponse(req);
    const chunks = [];
    const socket = new SilentSocket();

    socket.encrypted = false;
    socket.remoteAddress = "127.0.0.1";
    req.socket = socket;
    req.connection = socket;
    res.assignSocket(socket);

    const originalWrite = res.write.bind(res);
    const originalEnd = res.end.bind(res);

    res.write = (chunk, encoding, callback) => {
      if (chunk) chunks.push(Buffer.from(chunk));
      return originalWrite(chunk, encoding, callback);
    };

    res.end = (chunk, encoding, callback) => {
      if (chunk) chunks.push(Buffer.from(chunk));
      return originalEnd(chunk, encoding, callback);
    };

    res.on("finish", () => {
      const text = Buffer.concat(chunks).toString("utf8");
      res.detachSocket(socket);
      socket.destroy();
      resolve({
        status: res.statusCode,
        headers: res.getHeaders(),
        text,
        json: () => JSON.parse(text),
      });
    });

    res.on("error", reject);
    app.handle(req, res, reject);
  });
}

function countDestinationCards(html) {
  return (html.match(/class="destination-card"/g) || []).length;
}

test("homepage renders from reusable content", async () => {
  const response = await inject("GET", "/");

  assert.equal(response.status, 200);
  assert.match(response.text, /Travl\.com/);
  assert.match(response.text, /Built For Better Travel/);
});

test("legacy destination routes redirect to scalable destination route", async () => {
  const response = await inject("GET", "/tajMahal");

  assert.equal(response.status, 301);
  assert.equal(response.headers.location, "/destinations/taj-mahal");
});

test("destination pages require login before showing full guide", async () => {
  const response = await inject("GET", "/destinations/taj-mahal");

  assert.equal(response.status, 302);
  assert.match(response.headers.location, /\/login\?next=/);
});

test("destination library renders for signed-in users", async () => {
  const response = await inject("GET", "/more?layout=alt", null, {
    sessionUser: signedInUser,
  });

  assert.equal(response.status, 200);
  assert.match(response.text, /Destination Library/);
  assert.doesNotMatch(response.text, /Travl hit a server issue/);
});

test("destination library fills grid pages from available destinations", async () => {
  const response = await inject("GET", "/more?layout=grid&page=1", null, {
    sessionUser: signedInUser,
  });

  assert.equal(response.status, 200);
  assert.equal(countDestinationCards(response.text), 8);
  assert.match(response.text, /page-current">1/);
});

test("auth pages render visible forms", async () => {
  const login = await inject("GET", "/login");
  const register = await inject("GET", "/register");

  assert.equal(login.status, 200);
  assert.match(login.text, /Sign In/);
  assert.match(login.text, /name="email"/);
  assert.equal(register.status, 200);
  assert.match(register.text, /Create Account/);
  assert.match(register.text, /name="confirmPassword"/);
});

test("currency page renders backend-driven tool shell", async () => {
  const response = await inject("GET", "/Moneyconvertor");

  assert.equal(response.status, 200);
  assert.match(response.text, /Currency Converter/);
  assert.match(response.text, /data-currency-tool/);
});

test("search API returns destination results", async () => {
  const response = await inject("GET", "/api/search?q=taj");
  const payload = response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.results[0].slug, "taj-mahal");
});

test("currency API does not require a browser-exposed key", async () => {
  const response = await inject("GET", "/api/currency/latest?base=USD");
  const payload = response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.base, "USD");
  assert.equal(typeof payload.rates.INR, "number");
});

test("AI guide answers site and destination questions", async () => {
  const response = await inject(
    "POST",
    "/api/assistant",
    { message: "How do I use Taj Mahal" }
  );
  const payload = response.json();

  assert.equal(response.status, 200);
  assert.match(payload.reply, /Taj Mahal|Travl/i);
});
