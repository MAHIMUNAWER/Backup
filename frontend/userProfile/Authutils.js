/* ── userProfile/auth-utils.js ──
 *  Shared UI helpers.
 *  Loaded before auth.js on the auth page.
 *  Can also be loaded in profile.html if needed.
 */

// ── TOAST ──────────────────────────────────────────────────────────────────
/**
 * Show a toast notification.
 * @param {string}  msg  - Message text
 * @param {boolean} err  - If true, render in red (error style)
 */
function toast(msg, err = false) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = err ? 'var(--red)' : 'var(--green)';
  t.style.color       = err ? '#fff'       : '#000';
  t.style.opacity     = '1';
  t.style.transform   = 'translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity   = '0';
    t.style.transform = 'translateY(8px)';
  }, 2800);
}

// ── PASSWORD VISIBILITY TOGGLE ─────────────────────────────────────────────
/**
 * Toggle a password input between hidden / visible.
 * @param {string}      inputId - ID of the <input type="password">
 * @param {HTMLElement} btn     - The eye button element (textContent updated)
 */
function togglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type       = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

// ── PASSWORD STRENGTH METER ────────────────────────────────────────────────
/**
 * Update the 4-segment strength bar on the register form.
 * Requires elements #ps-1…#ps-4 and #pw-label in the DOM.
 * @param {string} val - Current password value
 */
function checkStrength(val) {
  const segs   = [1, 2, 3, 4].map(i => document.getElementById('ps-' + i));
  const label  = document.getElementById('pw-label');
  if (!segs[0] || !label) return;

  const colors = ['var(--red)', '#e08830', 'var(--gold)', 'var(--green)'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  let score = 0;
  if (val.length >= 6)                             score++;
  if (val.length >= 10)                            score++;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val))     score++;
  if (/[^A-Za-z0-9]/.test(val))                   score++;

  segs.forEach((s, i) => {
    s.style.background = i < score ? colors[score - 1] : 'var(--border)';
  });
  label.textContent  = val.length ? labels[score] : '';
  label.style.color  = score > 0  ? colors[score - 1] : 'var(--muted)';
}

// ── INLINE FIELD ERROR ─────────────────────────────────────────────────────
/**
 * Show a .field-error element.
 * @param {string} id  - Element ID
 * @param {string} msg - Optional override message
 */
function showErr(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  if (msg) el.textContent = msg;
  el.classList.add('show');
}

// ── ALERT BANNER ───────────────────────────────────────────────────────────
/**
 * Show an .alert banner element.
 * @param {string} id  - Element ID
 * @param {string} msg - Message to display
 */
function showAlert(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
}

// ── CLEAR ALL ERRORS ───────────────────────────────────────────────────────
/** Hide every .field-error and .alert on the page. */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.alert').forEach(e => {
    e.classList.remove('show');
    e.textContent = '';
  });
}

// ── SESSION HELPERS ────────────────────────────────────────────────────────
/**
 * Get the currently logged-in user object, or null.
 * @returns {object|null}
 */
function getUser() {
  try {
    const raw = localStorage.getItem('agri_current_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Redirect to auth.html if no session exists.
 * Call at the top of any protected page's script.
 */
function requireAuth() {
  if (!getUser()) window.location.href = 'auth.html';
}

/**
 * Clear session and redirect to auth.html.
 */
function logout() {
  localStorage.removeItem('agri_current_user');
  toast('👋 Logged out.');
  setTimeout(() => { window.location.href = 'auth.html'; }, 900);
}
