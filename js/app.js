'use strict';

// ============================================================================
// 1. STATE & HELPER DASAR
// ============================================================================

const APP_STATE = {
  activeScreen: APP_CONFIG.defaultScreen,
  selectedCandidateId: APP_CONFIG.defaultCandidateId,
  category: APP_CONFIG.defaultCategory,
  query: '',
  filterProdi: [],
  filterSkills: [],
  invitationFilter: INVITATION_TABS[0].label,
  invitations: structuredClone(INITIAL_INVITATIONS),
};

const el = id => document.getElementById(id);

function setText(id, text) {
  const node = el(id);
  if (node) node.textContent = text;
}

function setHTML(id, html) {
  const node = el(id);
  if (node) node.innerHTML = html;
}

/** Escape karakter HTML agar teks dari data/input aman dirender ke DOM. */
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function getCandidate(id) {
  return CANDIDATES.find(c => c.id === id) || null;
}

function avatarClass(candidate) {
  return `avatar-${candidate?.avatarTheme || 'blue'}`;
}

function hasPortfolio(candidate) {
  return candidate.portfolios.length > 0;
}

function prodiLabel(candidate) {
  return candidate.semester
    ? `${candidate.program} - Semester ${candidate.semester}`
    : candidate.program;
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function todayISO() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function statusBadge(status) {
  const s = STATUS[status] || STATUS.vacant;
  return `<span class="status-badge status-badge-${esc(status)}"><i class="bi ${esc(s.icon)}"></i> ${esc(s.label)}</span>`;
}

/** Hitung status terkini setiap posisi tim berdasarkan daftar undangan. */
function getTeamSlots() {
  return TEAM.positions.map(role => {
    const invs = APP_STATE.invitations.filter(i => i.role === role);
    const inv = invs.find(i => i.status === 'accepted') || invs.find(i => i.status === 'pending');

    if (!inv) return { role, status: 'vacant', candidate: null };

    return {
      role,
      status: inv.status === 'accepted' ? 'accepted' : 'pending',
      candidate: getCandidate(inv.candidateId),
    };
  });
}

/** Sinkronkan class .active dan aria-selected pada sekelompok tombol tab/chip. */
function syncActiveButtons(selector, isMatch) {
  document.querySelectorAll(selector).forEach(btn => {
    const active = isMatch(btn);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
}

// ============================================================================
// 2. PEMUAT LAYAR & ROUTING SPA
// ============================================================================

async function loadHTML(file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    console.error(`Gagal memuat ${file}:`, err);
    return `<div class="alert alert-danger m-3">Gagal memuat <code>${esc(file)}</code>. Pastikan aplikasi dijalankan lewat server lokal.</div>`;
  }
}

async function loadScreens() {
  const htmls = await Promise.all(SCREEN_FILES.map(loadHTML));
  setHTML('mainContainer', htmls.join('\n'));
  setHTML('modalContainer', await loadHTML('screens/modal-invite.html'));
}

function screenFromHash() {
  const route = window.location.hash.slice(1);
  return Object.keys(SCREENS).find(id => SCREENS[id] === route) || APP_CONFIG.defaultScreen;
}

function navigateToScreen(screenId, updateUrl = true) {
  if (!SCREENS[screenId]) return;
  APP_STATE.activeScreen = screenId;

  if (updateUrl) {
    const hash = `#${SCREENS[screenId]}`;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
  }

  document.querySelectorAll('.screen-section').forEach(section => {
    const isActive = section.id === screenId;
    section.classList.toggle('d-none', !isActive);
    section.classList.toggle('active', isActive);
  });

  document.querySelectorAll('[data-target-screen]').forEach(tab => {
    const target = tab.dataset.targetScreen;
    const isActive = target === screenId || (screenId === 'screen-profile' && target === 'screen-dashboard');
    tab.classList.toggle('active', isActive);
    if (isActive) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });

  renderScreen(screenId);
  window.scrollTo(0, 0);
}

const SCREEN_RENDERERS = {
  'screen-dashboard': renderCandidates,
  'screen-profile': renderProfile,
  'screen-invitations': renderInvitations,
  'screen-team': renderTeam,
};

function renderScreen(screenId) {
  SCREEN_RENDERERS[screenId]?.();
}

// ============================================================================
// 3. DASBOR & FILTER KANDIDAT
// ============================================================================

/** Render daftar kategori kompetisi & opsi checkbox filter dari data/konfigurasi. */
function initDashboardControls() {
  setHTML('categoryChipGroup', COMPETITION_CATEGORIES.map(cat => `
    <button class="category-chip" data-category="${esc(cat)}" role="tab" aria-selected="false">
      <span>${esc(cat)}</span>
    </button>
  `).join(''));

  const checkboxPill = (name, value, label) => `
    <label class="checkbox-pill-label">
      <input type="checkbox" name="${name}" value="${esc(value)}">
      <span>${esc(label)}</span>
    </label>`;

  setHTML('filterProdiGroup', FILKOM_PROGRAMS.map(p =>
    checkboxPill('filterProdi', p.value, p.label)
  ).join(''));

  const uniqueSkills = [...new Set(CANDIDATES.flatMap(c => c.skills))];
  setHTML('filterSkillGroup', uniqueSkills.map(skill =>
    checkboxPill('filterSkill', skill, skill)
  ).join(''));
}

function getFilteredCandidates() {
  const q = APP_STATE.query.toLowerCase();

  return CANDIDATES.filter(c => {
    if (!c.listed) return false;

    if (q) {
      const haystack = [c.name, c.program, ...c.skills, ...c.categories].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (APP_STATE.category && !c.categories.includes(APP_STATE.category)) return false;
    if (APP_STATE.filterProdi.length && !APP_STATE.filterProdi.includes(c.program)) return false;
    if (APP_STATE.filterSkills.length && !c.skills.some(s => APP_STATE.filterSkills.includes(s))) return false;

    return true;
  });
}

function candidateCardHTML(c) {
  const theme = c.isFeatured ? 'blue' : 'mint';
  const textClass = theme === 'mint' ? ' text-dark' : '';
  const subClass = theme === 'mint' ? ' text-secondary' : '';

  const action = hasPortfolio(c)
    ? `<button class="btn-cta-cyan btn-view-profile" data-view-profile="${esc(c.id)}"><span>Lihat Profil</span></button>`
    : `<button class="btn-outline-card-disabled" disabled aria-disabled="true"><span>Belum tersedia</span></button>`;

  return `
    <article class="candidate-card candidate-card-${theme}" aria-label="Profil ${esc(c.name)}">
      <div class="candidate-card-main">
        <div class="candidate-avatar ${avatarClass(c)}" aria-hidden="true">${esc(c.initials)}</div>
        <div class="candidate-info">
          <h3 class="candidate-name${textClass}">${esc(c.name)}</h3>
          <div class="candidate-meta${subClass}">${esc(prodiLabel(c))}</div>
          <div class="tag-container">
            ${c.skills.map(s => `<span class="tag-skill">${esc(s)}</span>`).join('')}
          </div>
          <div class="candidate-interest${subClass}">Minat: ${esc(c.categories.join(', '))}</div>
        </div>
      </div>
      <div class="candidate-card-side">
        <span class="candidate-badge-portfolio">${hasPortfolio(c) ? 'Portofolio tersedia' : 'Profil belum tersedia'}</span>
        ${action}
      </div>
    </article>`;
}

function setResultsView(view) {
  el('candidatesLoadingSpinner')?.classList.toggle('d-none', view !== 'loading');
  el('candidatesListContainer')?.classList.toggle('d-none', view !== 'list');
  el('candidatesEmptyState')?.classList.toggle('d-none', view !== 'empty');
}

function renderCandidates() {
  const list = getFilteredCandidates();
  setText('candidatesCountLabel', `Semua kandidat (${list.length})`);
  syncActiveButtons('[data-category]', chip => chip.dataset.category === APP_STATE.category);

  if (list.length === 0) {
    setText('emptyStateQueryText', APP_STATE.query ? `"${APP_STATE.query}"` : 'filter yang dipilih');
    setResultsView('empty');
    return;
  }

  setHTML('candidatesListContainer', list.map(candidateCardHTML).join(''));
  setResultsView('list');
}

function setCategory(category) {
  APP_STATE.category = category;
  renderCandidates();
}

let searchTimer = null;

function onSearchInput(e) {
  APP_STATE.query = e.target.value.trim();
  setResultsView('loading');
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderCandidates, APP_CONFIG.searchDebounceMs);
}

function clearFilterCheckboxes() {
  document.querySelectorAll('input[name="filterProdi"], input[name="filterSkill"]')
    .forEach(i => { i.checked = false; });
}

function resetDashboardFilters() {
  APP_STATE.query = '';
  APP_STATE.filterProdi = [];
  APP_STATE.filterSkills = [];
  APP_STATE.category = APP_CONFIG.defaultCategory;

  const input = el('candidateSearchInput');
  if (input) input.value = '';
  clearFilterCheckboxes();
}

function openFilterDialog() {
  document.querySelectorAll('input[name="filterProdi"]')
    .forEach(i => { i.checked = APP_STATE.filterProdi.includes(i.value); });
  document.querySelectorAll('input[name="filterSkill"]')
    .forEach(i => { i.checked = APP_STATE.filterSkills.includes(i.value); });
  el('filterDialog')?.showModal();
}

function readCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
}

function applyFilters() {
  APP_STATE.filterProdi = readCheckedValues('filterProdi');
  APP_STATE.filterSkills = readCheckedValues('filterSkill');
  el('filterDialog')?.close();
  renderCandidates();
  const total = APP_STATE.filterProdi.length + APP_STATE.filterSkills.length;
  showToast(`Filter diterapkan: ${total} kriteria aktif.`);
}

function resetFilters() {
  APP_STATE.filterProdi = [];
  APP_STATE.filterSkills = [];
  clearFilterCheckboxes();
  el('filterDialog')?.close();
  renderCandidates();
  showToast('Filter kriteria berhasil direset.');
}

// ============================================================================
// 4. PROFIL KANDIDAT
// ============================================================================

function tagsHTML(items, className) {
  if (!items.length) return '<span class="text-muted">Belum diisi</span>';
  return items.map(item => `<span class="${className}">${esc(item)}</span>`).join('');
}

function portfolioHTML(p) {
  return `
    <article class="portfolio-card-${esc(p.type)} mb-3">
      <div class="row align-items-center">
        <div class="col-12 col-md-8">
          <h3 class="portfolio-title">${esc(p.title)}</h3>
          <p class="portfolio-desc">${esc(p.desc)}</p>
          <div class="text-caption mb-2">${esc(p.tag)}</div>
          <div class="pt-2"><span class="portfolio-pill-btn">${esc(p.statusText)}</span></div>
        </div>
        <div class="col-12 col-md-4 text-center d-none d-md-block">
          <i class="bi ${esc(p.icon)} portfolio-icon" aria-hidden="true"></i>
        </div>
      </div>
    </article>`;
}

function renderProfile() {
  const c = getCandidate(APP_STATE.selectedCandidateId);
  if (!c) return;

  setText('profileAvatar', c.initials);
  setText('profileCandidateName', c.name);
  setText('profileSub', c.semester ? `${c.program} • Semester ${c.semester}` : c.program);
  setText('profileBio', c.bio);
  setHTML('profileSkills', tagsHTML(c.skills, 'profile-tag-pill'));
  setHTML('profileCategories', tagsHTML(c.categories, 'profile-tag-pill'));
  setHTML('portfolioList', c.portfolios.length
    ? c.portfolios.map(portfolioHTML).join('')
    : '<p class="text-muted">Belum ada portofolio.</p>');
}

// ============================================================================
// 5. MODAL KIRIM UNDANGAN
// ============================================================================

function setInviteError(visible) {
  const alert = el('inviteErrorAlert');
  if (alert) alert.style.display = visible ? 'flex' : 'none';
}

function renderRoleOptions(candidate) {
  const slots = getTeamSlots();

  setHTML('roleRadioGroup', slots.map(slot => {
    const takenByOther = slot.status === 'accepted' && slot.candidate?.id !== candidate.id;
    const role = esc(slot.role);

    return `
      <label class="role-radio-label" ${takenByOther ? 'style="opacity:.55"' : ''}>
        <input type="radio" name="selectedRole" value="${role}" class="role-radio-input" ${takenByOther ? 'disabled' : ''}>
        <span class="role-title">${role}${takenByOther ? ' <small>(sudah terisi)</small>' : ''}</span>
      </label>`;
  }).join(''));
}

function openInviteModal() {
  const c = getCandidate(APP_STATE.selectedCandidateId);
  if (!c) return;

  const accepted = APP_STATE.invitations.find(i => i.candidateId === c.id && i.status === 'accepted');
  if (accepted) {
    showToast(`${c.name} sudah menerima undangan sebagai ${accepted.role}.`);
    return;
  }

  setText('inviteModalTitle', `Undang ${c.name} ke Tim?`);
  setText('inviteInstruction', `Undangan untuk peran yang dipilih akan dikirim kepada ${c.name}. Status undangan akan menjadi Menunggu hingga kandidat memberikan respons.`);
  setText('inviteAvatar', c.initials);
  setText('inviteCandidateName', c.name);
  setText('inviteCandidateProgram', c.program);
  setText('roleHelperNote', `Pilih satu peran untuk ${c.name}.`);

  renderRoleOptions(c);
  setInviteError(false);
  el('modal-invite')?.showModal();
}

function closeInviteModal() {
  el('modal-invite')?.close();
}

function upsertInvitation(candidateId, role) {
  const date = todayISO();
  const existing = APP_STATE.invitations.find(i => i.candidateId === candidateId);

  if (existing) {
    Object.assign(existing, { role, status: 'pending', date, isNew: false });
  } else {
    APP_STATE.invitations.unshift({
      id: `inv-${Date.now()}`,
      candidateId,
      role,
      status: 'pending',
      date,
      isNew: false,
    });
  }
}

function submitInvite() {
  const picked = document.querySelector('input[name="selectedRole"]:checked');
  if (!picked) {
    setInviteError(true);
    el('inviteErrorAlert')?.focus();
    return;
  }

  const role = picked.value;
  const candidate = getCandidate(APP_STATE.selectedCandidateId);
  const btn = el('btnSubmitInvite');
  const originalHTML = btn.innerHTML;

  btn.disabled = true;
  btn.innerHTML = `
    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    <span>Mengirim...</span>`;

  setTimeout(() => {
    upsertInvitation(candidate.id, role);

    btn.disabled = false;
    btn.innerHTML = originalHTML;
    closeInviteModal();

    refreshAll();
    showToast(`Undangan untuk posisi ${role} berhasil dikirim ke ${candidate.name}!`);
    navigateToScreen('screen-invitations');
  }, APP_CONFIG.inviteSubmitDelayMs);
}

/** Tutup <dialog> ketika pengguna mengklik area backdrop di luar kotak modal. */
function bindDialogBackdrop(dialogId) {
  const dialog = el(dialogId);
  if (!dialog) return;

  dialog.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right
                && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) dialog.close();
  });
}

// ============================================================================
// 6. HALAMAN UNDANGAN & NOTIFIKASI
// ============================================================================

function initInvitationTabs() {
  setHTML('invitationStatusTabs', INVITATION_TABS.map(tab => `
    <button class="status-tab-btn ${esc(tab.className)}" data-status="${esc(tab.label)}" role="tab" aria-selected="false">
      <span>${esc(tab.label)}</span>
    </button>
  `).join(''));
}

function invitationCandidateInfo(inv) {
  return getCandidate(inv.candidateId) || {
    id: inv.candidateId,
    name: 'Kandidat',
    initials: '?',
    program: '-',
    avatarTheme: 'blue',
  };
}

function invitationRowHTML(inv) {
  const c = invitationCandidateInfo(inv);
  return `
    <tr class="status-${esc(inv.status)}">
      <td>
        <div class="candidate-cell-flex">
          <div class="cell-avatar ${avatarClass(c)}">${esc(c.initials)}</div>
          <div>
            <div class="candidate-table-name">
              <strong class="text-dark">${esc(c.name)}</strong>
              ${inv.isNew ? '<span class="badge-new ms-2">Baru</span>' : ''}
            </div>
            <div class="text-caption text-muted">${esc(c.program)}</div>
          </div>
        </div>
      </td>
      <td><span class="badge-role-lavender">${esc(inv.role)}</span></td>
      <td class="text-secondary">${formatDate(inv.date)}</td>
      <td>${statusBadge(inv.status)}</td>
      <td class="text-secondary">${esc(STATUS[inv.status]?.note || '')}</td>
    </tr>`;
}

function invitationCardHTML(inv) {
  const c = invitationCandidateInfo(inv);
  return `
    <div class="invitation-mobile-card status-${esc(inv.status)}">
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="d-flex align-items-center gap-2">
          <div class="cell-avatar ${avatarClass(c)}">${esc(c.initials)}</div>
          <div>
            <strong class="text-dark fs-6">${esc(c.name)}</strong>
            <div class="text-caption text-muted">${esc(c.program)}</div>
          </div>
        </div>
        ${inv.isNew ? '<span class="badge-new">Baru</span>' : ''}
      </div>
      <div class="mb-2"><span class="badge-role-lavender">Peran: ${esc(inv.role)}</span></div>
      <div class="d-flex justify-content-between align-items-center">
        <span class="text-caption text-muted">Dikirim: ${formatDate(inv.date)}</span>
        <div>${statusBadge(inv.status)}</div>
      </div>
    </div>`;
}

function renderInvitations() {
  const counts = { pending: 0, accepted: 0, rejected: 0 };
  APP_STATE.invitations.forEach(i => {
    if (counts[i.status] !== undefined) counts[i.status]++;
  });
  setText('countPending', counts.pending);
  setText('countAccepted', counts.accepted);
  setText('countRejected', counts.rejected);

  syncActiveButtons('.status-tab-btn', btn => btn.dataset.status === APP_STATE.invitationFilter);

  const activeTab = INVITATION_TABS.find(t => t.label === APP_STATE.invitationFilter);
  const wanted = activeTab?.status || null;
  const list = APP_STATE.invitations.filter(i => !wanted || i.status === wanted);

  if (list.length === 0) {
    const label = esc(APP_STATE.invitationFilter);
    setHTML('invitationsTableBody', `
      <tr><td colspan="5" class="text-center py-4 text-muted">Tidak ada undangan dengan status "${label}".</td></tr>`);
    setHTML('invitationsMobileList', `
      <div class="empty-state-box py-4"><p class="text-muted mb-0">Tidak ada undangan dengan status "${label}".</p></div>`);
    return;
  }

  setHTML('invitationsTableBody', list.map(invitationRowHTML).join(''));
  setHTML('invitationsMobileList', list.map(invitationCardHTML).join(''));
}

function setInvitationFilter(label) {
  APP_STATE.invitationFilter = label;
  renderInvitations();
}

function updateUnreadUI() {
  const unread = APP_STATE.invitations.filter(i => i.isNew).length;

  const badge = el('unreadBadgeCount');
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread ? '' : 'none';
  }

  setText('statusUpdateCountText', `${unread} pembaruan status`);
  el('statusUpdateBanner')?.classList.toggle('d-none', unread === 0);
}

function dismissUpdates() {
  APP_STATE.invitations.forEach(i => { i.isNew = false; });
  refreshAll();
  showToast('Pembaruan status telah ditandai sebagai sudah dibaca.');
}

// ============================================================================
// 7. HALAMAN TIM SAYA
// ============================================================================

function slotCardHTML(slot) {
  const role = esc(slot.role);
  const c = slot.candidate;
  let avatar;
  let info;
  let action = '';

  if (slot.status === 'accepted' && c) {
    avatar = `<div class="slot-avatar ${avatarClass(c)}">${esc(c.initials)}</div>`;
    info = `<strong class="slot-name">${esc(c.name)}</strong><span class="slot-sub">Undangan diterima</span>`;
  } else if (slot.status === 'pending' && c) {
    avatar = `<div class="slot-avatar ${avatarClass(c)}">${esc(c.initials)}</div>`;
    info = `<strong class="slot-name">${esc(c.name)}</strong><span class="slot-sub">Undangan terkirim &bull; Belum menerima</span>`;
    action = `<button class="btn btn-sm btn-outline-dark rounded-pill" data-view-invitations>Lihat Undangan</button>`;
  } else {
    avatar = `<div class="slot-avatar avatar-empty"><i class="bi bi-dash-lg"></i></div>`;
    info = `<strong class="slot-name">Belum ada kandidat</strong><span class="slot-sub">Belum ada kandidat yang ditugaskan</span>`;
    action = `<button class="btn-cta-cyan btn-sm" data-fill-role="${role}">+ Cari Kandidat</button>`;
  }

  return `
    <article class="position-slot-card status-${esc(slot.status)}" aria-label="Posisi ${role} - ${esc(STATUS[slot.status].label)}">
      <div class="slot-role-box"><span>${role}</span></div>
      ${avatar}
      <div class="slot-info-box">${info}</div>
      <div class="slot-status-box ms-auto d-flex flex-column align-items-end gap-2">
        ${statusBadge(slot.status)}
        ${action}
      </div>
    </article>`;
}

function renderTeam() {
  setText('teamName', TEAM.name);
  setText('teamCategory', `Kategori kompetisi: ${TEAM.category}`);
  setText('teamDescription', TEAM.description);

  const slots = getTeamSlots();
  const total = slots.length || 1;
  const filled = slots.filter(s => s.status === 'accepted').length;
  const pending = slots.filter(s => s.status === 'pending').length;
  const vacant = slots.filter(s => s.status === 'vacant').length;

  setText('teamFilledCount', filled);
  setText('teamPendingCount', pending);
  setText('teamVacantCount', vacant);
  setText('teamProgressText', `${filled} dari ${slots.length} posisi terisi`);

  const percent = Math.round((filled / total) * 100);
  const fill = el('teamProgressBarFill');
  if (fill) {
    fill.style.width = `${percent}%`;
    fill.parentElement?.setAttribute('aria-valuenow', String(percent));
  }

  setHTML('teamSlotsContainer', slots.map(slotCardHTML).join(''));
}

function startFillRole(role) {
  resetDashboardFilters();
  navigateToScreen('screen-dashboard');
  el('candidateSearchInput')?.focus();
  showToast(`Silakan pilih kandidat untuk posisi ${role}.`);
}

// ============================================================================
// 8. SINKRONISASI, TOAST, EVENT & INISIALISASI
// ============================================================================

function refreshAll() {
  updateUnreadUI();
  renderInvitations();
  renderTeam();
}

function showToast(message) {
  const container = el('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-custom';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '<i class="bi bi-check-circle-fill text-info fs-5"></i>';

  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 300);
  }, APP_CONFIG.toastDurationMs);
}

const ACTIONS = {
  brandLogo: () => navigateToScreen('screen-dashboard'),
  btnBackToDashboard: () => navigateToScreen('screen-dashboard'),
  btnOpenInviteModal: openInviteModal,
  btnCloseInviteDialog: closeInviteModal,
  btnCancelInvite: closeInviteModal,
  btnSubmitInvite: submitInvite,
  btnDismissUpdateBanner: dismissUpdates,
  btnViewInvitationsFromTeam: () => navigateToScreen('screen-invitations'),
  btnOpenFilterModal: openFilterDialog,
  btnCloseFilterDialog: () => el('filterDialog')?.close(),
  btnApplyFilters: applyFilters,
  btnResetFilters: resetFilters,
  btnResetSearch: () => { resetDashboardFilters(); renderCandidates(); },
};

function onDocumentClick(e) {
  const nav = e.target.closest('[data-target-screen]');
  if (nav) {
    e.preventDefault();
    navigateToScreen(nav.dataset.targetScreen);
    return;
  }

  const chip = e.target.closest('[data-category]');
  if (chip) return setCategory(chip.dataset.category);

  const tab = e.target.closest('[data-status]');
  if (tab) return setInvitationFilter(tab.dataset.status);

  const profileBtn = e.target.closest('[data-view-profile]');
  if (profileBtn) {
    APP_STATE.selectedCandidateId = profileBtn.dataset.viewProfile;
    return navigateToScreen('screen-profile');
  }

  if (e.target.closest('[data-view-invitations]')) {
    return navigateToScreen('screen-invitations');
  }

  const fillBtn = e.target.closest('[data-fill-role]');
  if (fillBtn) return startFillRole(fillBtn.dataset.fillRole);

  const withId = e.target.closest('[id]');
  if (withId && ACTIONS[withId.id]) {
    e.preventDefault();
    ACTIONS[withId.id]();
  }
}

function onDocumentChange(e) {
  if (e.target.name !== 'selectedRole') return;

  setInviteError(false);
  document.querySelectorAll('.role-radio-label').forEach(l => l.classList.remove('selected'));
  e.target.closest('.role-radio-label')?.classList.add('selected');
}

function renderCurrentUser() {
  const avatar = el('headerUserAvatar');
  if (avatar) {
    avatar.textContent = CURRENT_USER.initials;
    avatar.title = `${CURRENT_USER.name} — ${CURRENT_USER.role}`;
  }
  setText('heroUserName', `${CURRENT_USER.name}!`);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadScreens();

  renderCurrentUser();
  initDashboardControls();
  initInvitationTabs();

  el('candidateSearchInput')?.addEventListener('input', onSearchInput);
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('change', onDocumentChange);
  bindDialogBackdrop('modal-invite');
  bindDialogBackdrop('filterDialog');

  refreshAll();
  navigateToScreen(screenFromHash(), false);
});

window.addEventListener('popstate', () => {
  navigateToScreen(screenFromHash(), false);
});
