const PASSWORD = "lesm1lls";
const COOKIE_NAME = "anna_auth";

const PASSWORD_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Anna Macherkevich</title>
  <link href="https://fonts.googleapis.com/css2?family=Kalnia:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      font-family: 'DM Sans', sans-serif;
      overflow: hidden;
      background: #0e0a1a;
    }

    /* Background image — same as portfolio, rotated */
    #bg {
      position: fixed; inset: 0; z-index: 0;
      background: url('https://raw.githubusercontent.com/BigSquid/Anna-portfolio/main/AdobeStock_618400349.jpeg') center center / cover no-repeat;
      transform: rotate(90deg) scale(1.6);
    }
    #bg-overlay {
      position: fixed; inset: 0; z-index: 1;
      background: rgba(14, 10, 26, 0.72);
    }

    /* Layout */
    .page {
      position: relative; z-index: 2;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
    }

    /* Name lockup */
    .name-block {
      text-align: center;
      margin-bottom: 52px;
    }
    .name-first {
      display: block;
      font-family: 'Kalnia', serif;
      font-size: clamp(13px, 2.2vw, 18px);
      font-weight: 400;
      color: #9bb3d4;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .name-last {
      display: block;
      font-family: 'Kalnia', serif;
      font-size: clamp(36px, 7vw, 82px);
      font-weight: 600;
      color: #f0ead8;
      letter-spacing: -0.01em;
      line-height: 1;
    }
    .name-role {
      display: block;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 400;
      color: rgba(240,234,216,0.4);
      letter-spacing: 0.28em;
      text-transform: uppercase;
      margin-top: 14px;
    }

    /* Divider */
    .divider {
      width: 32px;
      height: 1px;
      background: rgba(155, 179, 212, 0.3);
      margin: 0 auto 40px;
    }

    /* Form card */
    .card {
      width: 100%;
      max-width: 360px;
      text-align: center;
    }
    .card-label {
      font-size: 9px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: rgba(240,234,216,0.38);
      margin-bottom: 20px;
    }

    .input-row {
      display: flex;
      gap: 0;
      border: 1px solid rgba(155,179,212,0.25);
      border-radius: 6px;
      overflow: hidden;
      background: rgba(26, 46, 74, 0.4);
      backdrop-filter: blur(12px);
      transition: border-color 0.2s;
    }
    .input-row:focus-within {
      border-color: rgba(155,179,212,0.6);
    }

    input[type="password"] {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      padding: 14px 18px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px;
      font-weight: 400;
      color: #f0ead8;
      letter-spacing: 0.1em;
    }
    input[type="password"]::placeholder {
      color: rgba(240,234,216,0.22);
      letter-spacing: 0.22em;
      font-size: 11px;
    }

    button[type="submit"] {
      background: #f0ead8;
      color: #1a2e4a;
      border: none;
      padding: 14px 22px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      white-space: nowrap;
    }
    button[type="submit"]:hover {
      background: #9bb3d4;
    }

    .error {
      margin-top: 14px;
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(240,100,100,0.75);
    }

    /* Footer */
    .footer {
      position: fixed;
      bottom: 28px;
      left: 0; right: 0;
      text-align: center;
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.15);
      font-family: 'DM Sans', sans-serif;
    }
  </style>
</head>
<body>
  <div id="bg"></div>
  <div id="bg-overlay"></div>

  <div class="page">
    <div class="name-block">
      <span class="name-first">Anna</span>
      <span class="name-last">Macherkevich</span>
      <span class="name-role">Product Designer · Portfolio</span>
    </div>

    <div class="divider"></div>

    <div class="card">
      <div class="card-label">Password required</div>
      <form method="POST">
        <div class="input-row">
          <input type="password" name="password" placeholder="Enter password" autofocus autocomplete="current-password"/>
          <button type="submit">Enter</button>
        </div>
        {{ERROR}}
      </form>
    </div>
  </div>

  <div class="footer">www.annamacherkevich.com &nbsp;·&nbsp; 2026</div>
</body>
</html>`;

export async function onRequest(context) {
  const { request, next, env } = context;

  // Check cookie
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes(`${COOKIE_NAME}=granted`)) {
    return next();
  }

  // Handle POST
  if (request.method === "POST") {
    const formData = await request.formData();
    const attempt = formData.get("password");
    if (attempt === PASSWORD) {
      const response = new Response(null, {
        status: 302,
        headers: {
          Location: request.url,
          "Set-Cookie": `${COOKIE_NAME}=granted; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
        }
      });
      return response;
    }
    // Wrong password
    const html = PASSWORD_PAGE.replace("{{ERROR}}", `<div class="error">Incorrect password — try again</div>`);
    return new Response(html, { status: 401, headers: { "Content-Type": "text/html" } });
  }

  // Show password page
  const html = PASSWORD_PAGE.replace("{{ERROR}}", "");
  return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
}
