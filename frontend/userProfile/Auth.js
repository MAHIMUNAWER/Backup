/* ── userProfile/auth.js ──
 *  Page logic for auth.html.
 *  Depends on auth-utils.js being loaded first.
 */

// ── REDIRECT IF ALREADY LOGGED IN ─────────────────────────────────────────
if (getUser()) window.location.href = 'index.html';

// ── TAB SWITCH ─────────────────────────────────────────────────────────────
/**
 * Switch between the Login and Register tabs.
 * @param {'login'|'register'} tab
 */
function switchAuth(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-'   + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
  clearErrors();
}

// ── LOGIN ──────────────────────────────────────────────────────────────────
function handleLogin() {
  clearErrors();

  const identifier = document.getElementById('l-identifier').value.trim();
  const password   = document.getElementById('l-password').value;
  let ok = true;

  if (!identifier) { showErr('l-id-err'); ok = false; }
  if (!password)   { showErr('l-pw-err'); ok = false; }
  if (!ok) return;

  const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
  const user  = users.find(u =>
    (u.phone === identifier || u.email === identifier) && u.password === password
  );

  if (!user) {
    showAlert('login-alert', '❌ Incorrect phone/email or password. Please try again.');
    return;
  }

  localStorage.setItem('agri_current_user', JSON.stringify(user));
  toast('✅ Welcome back, ' + user.name + '!');
  setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

// ── REGISTER ───────────────────────────────────────────────────────────────
function handleRegister() {
  clearErrors();

  const name     = document.getElementById('r-name').value.trim();
  const phone    = document.getElementById('r-phone').value.trim();
  const email    = document.getElementById('r-email').value.trim();
  const district = document.getElementById('r-district').value.trim();
  const farmtype = document.getElementById('r-farmtype').value;
  const password = document.getElementById('r-password').value;
  const confirm  = document.getElementById('r-confirm').value;
  const terms    = document.getElementById('r-terms').checked;

  let ok = true;

  if (!name)
    { showErr('r-name-err'); ok = false; }

  if (!phone || phone.replace(/\D/g, '').length < 10)
    { showErr('r-phone-err', 'Enter a valid phone number (min 10 digits).'); ok = false; }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    { showErr('r-email-err'); ok = false; }

  if (password.length < 6)
    { showErr('r-pw-err'); ok = false; }

  if (password !== confirm)
    { showErr('r-conf-err'); ok = false; }

  if (!terms)
    { showErr('r-terms-err'); ok = false; }

  if (!ok) return;

  const users = JSON.parse(localStorage.getItem('agri_users') || '[]');

  if (users.find(u => u.phone === phone)) {
    showAlert('reg-alert', '⚠ This phone number is already registered. Please login.');
    return;
  }
  if (email && users.find(u => u.email === email)) {
    showAlert('reg-alert', '⚠ This email is already registered. Please login.');
    return;
  }

  const newUser = {
    id:         'usr_' + Date.now(),
    name, phone, email, district, farmtype, password,
    createdAt:  new Date().toISOString(),
    totalSales: 0,
  };

  users.push(newUser);
  localStorage.setItem('agri_users',        JSON.stringify(users));
  localStorage.setItem('agri_current_user', JSON.stringify(newUser));

  showAlert('reg-ok', '🎉 Account created! Redirecting to your profile…');
  setTimeout(() => { window.location.href = 'index.html'; }, 1200);
}

// ── FORGOT PASSWORD ────────────────────────────────────────────────────────
function forgotPassword() {
  clearErrors();
  const id = document.getElementById('l-identifier').value.trim();

  if (!id) {
    showAlert('login-alert', '⚠ Enter your phone or email first, then click Forgot Password.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
  const user  = users.find(u => u.phone === id || u.email === id);

  if (!user) {
    showAlert('login-alert', '❌ No account found for that phone / email.');
    return;
  }

  // In a real app this would trigger a backend email/SMS reset flow.
  toast('🔑 Password reset instructions sent (demo mode).');
}
