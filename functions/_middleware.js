const COOKIE_NAME = "__portfolio_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

async function hash(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function getLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anna Macherkevich — Portfolio</title>
<link href="https://fonts.googleapis.com/css2?family=Kalnia:wght@300;400;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">
<style>
  :root {
    --blue: #225991; --blue-dark: #1a4470; --blue-light: #7a9fd4;
    --white: #ffffff; --cream: #f0ead8; --ink: #0e1a2e;
    --muted: rgba(255,255,255,0.55); --border: rgba(255,255,255,0.12);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--blue); font-family: 'DM Sans', sans-serif;
    font-weight: 300; color: var(--white); min-height: 100vh;
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 40px 24px; overflow: hidden;
  }
  .bg-name {
    position: fixed; bottom: -40px; left: -20px;
    font-family: 'Kalnia', serif; font-size: clamp(80px, 18vw, 220px);
    font-weight: 700; color: rgba(255,255,255,0.045); line-height: 0.88;
    letter-spacing: -0.02em; pointer-events: none; user-select: none; white-space: nowrap;
  }
  .card {
    position: relative; z-index: 1; width: 100%; max-width: 440px;
    background: var(--blue-dark); border: 1px solid var(--border);
    border-radius: 12px; padding: 52px 48px 48px;
    box-shadow: 0 40px 100px rgba(14,26,46,0.55);
    animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .eyebrow {
    font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--blue-light); font-weight: 500; margin-bottom: 20px;
  }
  .title {
    font-family: 'Kalnia', serif; font-size: 32px; font-weight: 600;
    color: var(--cream); letter-spacing: -0.01em; line-height: 1.1; margin-bottom: 10px;
  }
  .subtitle { font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.55); margin-bottom: 36px; }
  .divider { height: 1px; background: var(--border); margin-bottom: 32px; }
  .input-label {
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--blue-light); font-weight: 500; display: block; margin-bottom: 8px;
  }
  .password-wrap { position: relative; margin-bottom: 12px; }
  input[type="password"], input[type="text"] {
    width: 100%; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
    padding: 14px 48px 14px 18px; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 300; color: var(--white); outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  input[type="password"]::placeholder, input[type="text"]::placeholder { color: rgba(255,255,255,0.22); }
  input:focus { border-color: var(--blue-light); background: rgba(255,255,255,0.09); }
  input.error { border-color: #e07070; animation: shake 0.35s ease; }
  @keyframes shake {
    0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); }
    60% { transform: translateX(6px); } 80% { transform: translateX(-3px); }
  }
  .toggle-pw {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3);
    padding: 4px; transition: color 0.2s; display: flex; align-items: center;
  }
  .toggle-pw:hover { color: rgba(255,255,255,0.7); }
  .error-msg { font-size: 12px; color: #e07070; margin-top: 8px; min-height: 16px; }
  .btn-enter {
    width: 100%; background: var(--blue-light); color: var(--ink);
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase; padding: 15px 24px;
    border-radius: 50px; border: none; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s; margin-top: 20px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-enter:hover { opacity: 0.88; }
  .btn-enter:active { transform: scale(0.98); }
  .or-row { display: flex; align-items: center; gap: 12px; margin: 28px 0 0; }
  .or-line { flex: 1; height: 1px; background: var(--border); }
  .or-text { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
  .request-section { margin-top: 24px; }
  .request-label { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 12px; line-height: 1.6; }
  .request-row { display: flex; gap: 8px; }
  input[type="email"] {
    flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px; padding: 12px 16px; font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 300; color: var(--white); outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  input[type="email"]::placeholder { color: rgba(255,255,255,0.22); }
  input[type="email"]:focus { border-color: var(--blue-light); background: rgba(255,255,255,0.09); }
  .btn-request {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px; color: rgba(255,255,255,0.7); font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 12px 18px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .btn-request:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.3); color: var(--white); }
  .request-success { display: none; font-size: 13px; color: #7acba8; margin-top: 10px; align-items: center; gap: 6px; }
  .request-success.visible { display: flex; }
  .card-footer {
    margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--border);
    font-size: 11px; color: rgba(255,255,255,0.2); letter-spacing: 0.06em; text-align: center;
  }
  @media (max-width: 480px) {
    .card { padding: 40px 28px 36px; }
    .title { font-size: 26px; }
    .request-row { flex-direction: column; }
    .btn-request { width: 100%; }
  }
</style>
</head>
<body>
  <div class="bg-name">ANNA<br>MACHER<br>KEVICH</div>
  <div class="card">
    <div class="eyebrow">Portfolio · Protected</div>
    <h1 class="title">ANNA <span style="color: var(--blue-light);">MACHERKEVICH</span></h1>
    <p class="subtitle">Product Designer / Doodler — San Francisco</p>
    <div class="divider"></div>
    <form method="POST" action="/cfp_login" id="login-form">
      <label class="input-label" for="pw-input">Password</label>
      <div class="password-wrap">
        <input type="password" id="pw-input" name="password" placeholder="Enter password to continue" autocomplete="current-password" />
        <button class="toggle-pw" type="button" id="toggle-pw" aria-label="Show password">
          <svg id="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      <div class="error-msg" id="error-msg">__ERROR__</div>
      <button class="btn-enter" type="submit">Enter Portfolio ↗</button>
    </form>
    <div class="or-row">
      <div class="or-line"></div><span class="or-text">or</span><div class="or-line"></div>
    </div>
    <div class="request-section">
      <p class="request-label">Don't have the password? Leave your email and I'll be in touch.</p>
      <div class="request-row">
        <input type="email" id="email-input" placeholder="your@email.com" />
        <button class="btn-request" id="btn-request" type="button">Request Access</button>
      </div>
      <div class="request-success" id="request-success">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7acba8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Request sent — I'll get back to you soon!
      </div>
    </div>
    <div class="card-footer">annamacherkevich.com</div>
  </div>
<script>
  document.getElementById('toggle-pw').addEventListener('click', () => {
    const input = document.getElementById('pw-input');
    const icon = document.getElementById('eye-icon');
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    icon.innerHTML = isText
      ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  });
  document.getElementById('btn-request').addEventListener('click', () => {
    const email = document.getElementById('email-input').value.trim();
    if (!email || !email.includes('@')) {
      document.getElementById('email-input').style.borderColor = '#e07070';
      setTimeout(() => document.getElementById('email-input').style.borderColor = '', 1500);
      return;
    }
    const subject = encodeURIComponent('Portfolio Access Request');
    const body = encodeURIComponent('Hi Anna,\n\nI\\'d love to view your portfolio.\n\nMy email: ' + email + '\n\nThanks!');
    window.location.href = 'mailto:annamacherkevich@gmail.com?subject=' + subject + '&body=' + body;
    document.getElementById('request-success').classList.add('visible');
    document.getElementById('email-input').value = '';
  });
</script>
</body>
</html>`;
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const password = env.CFP_PASSWORD;

  // If no password set, just serve the site normally
  if (!password) return next();

  const url = new URL(request.url);

  // Handle login form POST
  if (request.method === "POST" && url.pathname === "/cfp_login") {
    const formData = await request.formData();
    const submitted = formData.get("password") || "";
    const correctHash = await hash(password);
    const submittedHash = await hash(submitted);

    if (submittedHash === correctHash) {
      // Set auth cookie and redirect to home
      const response = new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": `${COOKIE_NAME}=${correctHash}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
        },
      });
      return response;
    }

    // Wrong password — show login page with error
    const page = getLoginPage().replace("__ERROR__", "Incorrect password — try again");
    return new Response(page, {
      status: 401,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check auth cookie on all other requests
  const cookieHeader = request.headers.get("Cookie") || "";
  const correctHash = await hash(password);
  const authCookie = cookieHeader
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(`${COOKIE_NAME}=`));

  if (authCookie) {
    const cookieValue = authCookie.split("=")[1];
    if (cookieValue === correctHash) {
      return next(); // Authenticated — serve the page
    }
  }

  // Not authenticated — show login page
  const page = getLoginPage().replace("__ERROR__", "");
  return new Response(page, {
    status: 401,
    headers: { "Content-Type": "text/html" },
  });
}
