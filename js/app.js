const APP_STATE = {
  currentScreen: 'screen-dashboard', 
  activeCategory: 'Semua',
  searchQuery: '',
  filterProdi: [],
  filterSkills: [],
  invitationStatusFilter: 'Semua',
  unreadUpdates: 2,
  
  candidates: [
    {
      id: 'alya',
      name: 'Alya Putri',
      initials: 'AP',
      prodi: 'Teknik Informatika - Semester 5',
      faculty: 'Teknik Informatika',
      semester: 5,
      gpa: '3.88',
      skills: ['UI/UX', 'Figma', 'Riset UX'],
      categories: ['Hackathon', 'Business Plan'],
      hasPortfolio: true,
      isFeatured: true,
      bio: 'Mahasiswa Teknik Informatika peminatan Human-Computer Interaction & UI/UX Design dengan pengalaman riset pengguna dan perancangan prototipe web/mobile.',
      portfolios: [
        {
          id: 'port-1',
          title: 'KantinKu — Prototipe Aplikasi',
          type: 'purple',
          desc: 'Desain UI/UX solusi pemesanan makanan kantin FILKOM untuk mengurangi antrean jam makan siang sivitas akademika.',
          tag: 'UI/UX Mobile App',
          statusText: 'Prototipe Figma Aktif',
          icon: 'bi-phone'
        },
        {
          id: 'port-2',
          title: 'Riset UX — Perpustakaan Digital',
          type: 'mint',
          desc: 'Studi komparasi dan usability testing sistem katalog digital perpustakaan kampus dengan 15 partisipan mahasiswa.',
          tag: 'Usability Testing & Research',
          statusText: 'Dokumen Riset Tersedia',
          icon: 'bi-journal-check'
        }
      ]
    },
    {
      id: 'bima',
      name: 'Bima Pratama',
      initials: 'BP',
      prodi: 'Sistem Informasi - Semester 3',
      faculty: 'Sistem Informasi',
      semester: 3,
      gpa: '3.75',
      skills: ['Python', 'SQL', 'Analisis Data'],
      categories: ['Hackathon', 'CTF'],
      hasPortfolio: false,
      isFeatured: false,
      bio: 'Fokus pada eksplorasi data science, pemodelan statistik, dan pipeline pengolahan data tabular.',
      portfolios: []
    }
  ],

  invitations: [
    {
      id: 'inv-1',
      candidateName: 'Alya Putri',
      initials: 'AP',
      candidateId: 'alya',
      role: 'UI/UX Designer',
      date: '10 Nov 2026',
      status: 'pending',
      isNew: false
    },
    {
      id: 'inv-2',
      candidateName: 'Bima Pratama',
      initials: 'BP',
      candidateId: 'bima',
      role: 'Data Analyst',
      date: '09 Nov 2026',
      status: 'accepted',
      isNew: true
    },
    {
      id: 'inv-3',
      candidateName: 'Citra Maheswari',
      initials: 'CM',
      candidateId: 'citra',
      role: 'Frontend Developer',
      date: '08 Nov 2026',
      status: 'rejected',
      isNew: true
    },
    {
      id: 'inv-4',
      candidateName: 'Dimas Saputra',
      initials: 'DS',
      candidateId: 'dimas',
      role: 'Backend Developer',
      date: '07 Nov 2026',
      status: 'pending',
      isNew: false
    }
  ],

  team: {
    name: 'Tim Nalar',
    competition: 'Kategori kompetisi: Hackathon',
    description: 'Fokus pada pengembangan solusi digital inovatif untuk kebutuhan sivitas akademika FILKOM UB.',
    slots: [
      {
        id: 'slot-1',
        role: 'Data Analyst',
        status: 'accepted',
        candidateName: 'Bima Pratama',
        initials: 'BP',
        prodi: 'Sistem Informasi - Semester 3'
      },
      {
        id: 'slot-2',
        role: 'UI/UX Designer',
        status: 'pending',
        candidateName: 'Alya Putri',
        initials: 'AP',
        prodi: 'Teknik Informatika - Semester 5'
      },
      {
        id: 'slot-3',
        role: 'Frontend Developer',
        status: 'vacant',
        candidateName: null,
        initials: '-',
        prodi: null
      }
    ]
  }
};

const DOM = {
  screens: {}
};

function initDOMElements() {
  DOM.screens = {
    dashboard: document.getElementById('screen-dashboard'),
    profile: document.getElementById('screen-profile'),
    invitations: document.getElementById('screen-invitations'),
    team: document.getElementById('screen-team')
  };
  
  DOM.navTabs = document.querySelectorAll('[data-target-screen]');
  DOM.unreadBadge = document.getElementById('unreadBadgeCount');
  
  DOM.searchInput = document.getElementById('candidateSearchInput');
  DOM.candidatesContainer = document.getElementById('candidatesListContainer');
  DOM.candidatesCountLabel = document.getElementById('candidatesCountLabel');
  DOM.categoryChips = document.querySelectorAll('.category-chip');
  DOM.loadingSpinner = document.getElementById('candidatesLoadingSpinner');
  DOM.emptyState = document.getElementById('candidatesEmptyState');
  DOM.emptyStateQueryText = document.getElementById('emptyStateQueryText');
  DOM.resetSearchBtn = document.getElementById('btnResetSearch');

  DOM.btnOpenFilterModal = document.getElementById('btnOpenFilterModal');
  DOM.filterDialog = document.getElementById('filterDialog');
  DOM.btnCloseFilterDialog = document.getElementById('btnCloseFilterDialog');
  DOM.btnApplyFilters = document.getElementById('btnApplyFilters');
  DOM.btnResetFilters = document.getElementById('btnResetFilters');
  
  DOM.inviteDialog = document.getElementById('modal-invite');
  DOM.btnOpenInviteModal = document.getElementById('btnOpenInviteModal');
  DOM.btnCloseInviteDialog = document.getElementById('btnCloseInviteDialog');
  DOM.btnCancelInvite = document.getElementById('btnCancelInvite');
  DOM.btnSubmitInvite = document.getElementById('btnSubmitInvite');
  DOM.inviteErrorAlert = document.getElementById('inviteErrorAlert');
  DOM.inviteRoleInputs = document.querySelectorAll('input[name="selectedRole"]');
  
  DOM.countPending = document.getElementById('countPending');
  DOM.countAccepted = document.getElementById('countAccepted');
  DOM.countRejected = document.getElementById('countRejected');
  DOM.statusFilterButtons = document.querySelectorAll('.status-tab-btn');
  DOM.invitationsTableBody = document.getElementById('invitationsTableBody');
  DOM.invitationsMobileList = document.getElementById('invitationsMobileList');
  DOM.statusUpdateBanner = document.getElementById('statusUpdateBanner');
  DOM.statusUpdateCountText = document.getElementById('statusUpdateCountText');
  DOM.btnDismissUpdateBanner = document.getElementById('btnDismissUpdateBanner');

  DOM.teamSlotsContainer = document.getElementById('teamSlotsContainer');
  DOM.teamFilledCount = document.getElementById('teamFilledCount');
  DOM.teamPendingCount = document.getElementById('teamPendingCount');
  DOM.teamVacantCount = document.getElementById('teamVacantCount');
  DOM.teamProgressText = document.getElementById('teamProgressText');
  DOM.teamProgressBarFill = document.getElementById('teamProgressBarFill');
  DOM.btnViewInvitationsFromTeam = document.getElementById('btnViewInvitationsFromTeam');

  DOM.toastContainer = document.getElementById('toastContainer');
}

async function loadScreenHTML(screenId, filePath) {
  try {
    if (window.location.protocol === 'file:') {
      throw new Error('file-protocol');
    }
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    if (window.SCREEN_FALLBACKS && window.SCREEN_FALLBACKS[screenId]) {
      return window.SCREEN_FALLBACKS[screenId];
    }
    return '';
  }
}

async function loadAllScreens() {
  const mainContainer = document.getElementById('mainContainer');
  const modalContainer = document.getElementById('modalContainer');

  const mainScreenConfigs = [
    { id: 'screen-dashboard', file: 'screens/screen-dashboard.html' },
    { id: 'screen-profile', file: 'screens/screen-profile.html' },
    { id: 'screen-invitations', file: 'screens/screen-invitations.html' },
    { id: 'screen-team', file: 'screens/screen-team.html' }
  ];

  const mainHtmls = await Promise.all(
    mainScreenConfigs.map(cfg => loadScreenHTML(cfg.id, cfg.file))
  );

  if (mainContainer) {
    mainContainer.innerHTML = mainHtmls.join('\n');
  }

  const modalHtml = await loadScreenHTML('modal-invite', 'screens/modal-invite.html');
  if (modalContainer) {
    modalContainer.innerHTML = modalHtml;
  }
}

function navigateToScreen(targetScreenId) {
  APP_STATE.currentScreen = targetScreenId;

  Object.keys(DOM.screens).forEach(key => {
    const screenEl = DOM.screens[key];
    if (screenEl) {
      if (screenEl.id === targetScreenId) {
        screenEl.classList.remove('d-none');
        screenEl.classList.add('active');
      } else {
        screenEl.classList.add('d-none');
        screenEl.classList.remove('active');
      }
    }
  });

  DOM.navTabs.forEach(tab => {
    const target = tab.getAttribute('data-target-screen');
    const shouldBeActive = target === targetScreenId || (targetScreenId === 'screen-profile' && target === 'screen-dashboard');
    if (shouldBeActive) {
      tab.classList.add('active');
      tab.setAttribute('aria-current', 'page');
    } else {
      tab.classList.remove('active');
      tab.removeAttribute('aria-current');
    }
  });

  if (targetScreenId === 'screen-dashboard') {
    renderCandidates();
  } else if (targetScreenId === 'screen-invitations') {
    renderInvitations();
  } else if (targetScreenId === 'screen-team') {
    renderTeamPositions();
  }

  window.scrollTo(0, 0);
}

window.navigateToScreen = navigateToScreen;

let searchDebounceTimeout = null;

function handleSearchInput(e) {
  const query = e.target.value.trim();
  APP_STATE.searchQuery = query;

  if (DOM.loadingSpinner && DOM.candidatesContainer) {
    DOM.loadingSpinner.classList.remove('d-none');
    DOM.candidatesContainer.classList.add('d-none');
    DOM.emptyState.classList.add('d-none');
  }

  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    if (DOM.loadingSpinner) {
      DOM.loadingSpinner.classList.add('d-none');
    }
    renderCandidates();
  }, 650);
}

function filterCandidatesData() {
  return APP_STATE.candidates.filter(candidate => {
    if (APP_STATE.searchQuery) {
      const q = APP_STATE.searchQuery.toLowerCase();
      const matchName = candidate.name.toLowerCase().includes(q);
      const matchProdi = candidate.prodi.toLowerCase().includes(q);
      const matchSkills = candidate.skills.some(s => s.toLowerCase().includes(q));
      const matchCategories = candidate.categories.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchProdi && !matchSkills && !matchCategories) {
        return false;
      }
    }

    if (APP_STATE.activeCategory !== 'Semua') {
      if (!candidate.categories.includes(APP_STATE.activeCategory)) {
        return false;
      }
    }

    if (APP_STATE.filterProdi.length > 0) {
      if (!APP_STATE.filterProdi.includes(candidate.faculty)) {
        return false;
      }
    }

    if (APP_STATE.filterSkills.length > 0) {
      const hasAnySkill = candidate.skills.some(s => APP_STATE.filterSkills.includes(s));
      if (!hasAnySkill) {
        return false;
      }
    }

    return true;
  });
}

function renderCandidates() {
  const filtered = filterCandidatesData();

  if (DOM.candidatesCountLabel) {
    DOM.candidatesCountLabel.textContent = `Semua kandidat (${filtered.length})`;
  }

  if (filtered.length === 0) {
    DOM.candidatesContainer.classList.add('d-none');
    DOM.emptyState.classList.remove('d-none');
    if (DOM.emptyStateQueryText) {
      DOM.emptyStateQueryText.textContent = APP_STATE.searchQuery ? `"${APP_STATE.searchQuery}"` : 'filter yang dipilih';
    }
    return;
  }

  DOM.emptyState.classList.add('d-none');
  DOM.candidatesContainer.classList.remove('d-none');
  DOM.candidatesContainer.innerHTML = '';

  filtered.forEach(c => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 mb-4';

    if (c.id === 'alya') {
      col.innerHTML = `
        <article class="candidate-card featured-card" aria-label="Profil ${c.name}">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="candidate-avatar avatar-alya" aria-hidden="true">${c.initials}</div>
            <div>
              <h3 class="candidate-name mb-0">${c.name}</h3>
              <div class="candidate-meta">${c.prodi}</div>
            </div>
          </div>
          
          <div class="tag-container mb-3">
            ${c.skills.map(skill => `<span class="tag-skill">${skill}</span>`).join('')}
          </div>

          <div class="info-row mb-2">
            <span class="info-row-label">Minat Kompetisi</span>
            <span class="info-row-value">${c.categories.join(', ')}</span>
          </div>

          <div class="info-row mb-4">
            <span class="info-row-label">Status Portofolio</span>
            <span class="info-row-value d-flex align-items-center gap-2">
              <i class="bi bi-check-circle-fill text-warning"></i>
              Portofolio tersedia (${c.portfolios.length} karya)
            </span>
          </div>

          <div class="mt-auto pt-2">
            <button class="btn-cta-cyan w-100 btn-view-profile" data-candidate-id="${c.id}">
              <span>Lihat Profil</span>
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </article>
      `;
    } else {
      col.innerHTML = `
        <article class="candidate-card" aria-label="Profil ${c.name}">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="candidate-avatar avatar-bima" aria-hidden="true">${c.initials}</div>
            <div>
              <h3 class="candidate-name mb-0">${c.name}</h3>
              <div class="candidate-meta">${c.prodi}</div>
            </div>
          </div>
          
          <div class="tag-container mb-3">
            ${c.skills.map(skill => `<span class="tag-skill">${skill}</span>`).join('')}
          </div>

          <div class="info-row mb-2">
            <span class="info-row-label">Minat Kompetisi</span>
            <span class="info-row-value">${c.categories.join(', ')}</span>
          </div>

          <div class="info-row mb-4">
            <span class="info-row-label">Status Portofolio</span>
            <span class="info-row-value text-muted d-flex align-items-center gap-2">
              <i class="bi bi-dash-circle"></i>
              Profil belum tersedia
            </span>
          </div>

          <div class="mt-auto pt-2">
            <button class="btn-disabled-muted w-100" disabled aria-disabled="true" title="Profil kandidat belum diaktifkan oleh mahasiswa">
              <i class="bi bi-lock-fill"></i>
              <span>Belum tersedia</span>
            </button>
          </div>
        </article>
      `;
    }

    DOM.candidatesContainer.appendChild(col);
  });

  document.querySelectorAll('.btn-view-profile').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToScreen('screen-profile');
    });
  });
}

function openInviteModal() {
  if (!DOM.inviteDialog) return;
  
  DOM.inviteRoleInputs.forEach(input => {
    input.checked = false;
    const label = input.closest('.role-radio-label');
    if (label) label.classList.remove('selected');
  });
  
  if (DOM.inviteErrorAlert) {
    DOM.inviteErrorAlert.style.display = 'none';
  }

  if (typeof DOM.inviteDialog.showModal === 'function') {
    DOM.inviteDialog.showModal();
  } else {
    DOM.inviteDialog.setAttribute('open', 'true');
  }
}

function closeInviteModal() {
  if (!DOM.inviteDialog) return;
  if (typeof DOM.inviteDialog.close === 'function') {
    DOM.inviteDialog.close();
  } else {
    DOM.inviteDialog.removeAttribute('open');
  }
}

function handleInviteFormSubmit() {
  const selectedRadio = document.querySelector('input[name="selectedRole"]:checked');

  if (!selectedRadio) {
    if (DOM.inviteErrorAlert) {
      DOM.inviteErrorAlert.style.display = 'flex';
      DOM.inviteErrorAlert.focus();
    }
    return;
  }

  const selectedRole = selectedRadio.value;

  const originalBtnContent = DOM.btnSubmitInvite.innerHTML;
  DOM.btnSubmitInvite.disabled = true;
  DOM.btnSubmitInvite.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span>Mengirim...</span>
  `;

  setTimeout(() => {
    const existingIndex = APP_STATE.invitations.findIndex(inv => inv.candidateId === 'alya');
    const today = '10 Nov 2026';

    if (existingIndex !== -1) {
      APP_STATE.invitations[existingIndex].status = 'pending';
      APP_STATE.invitations[existingIndex].role = selectedRole;
      APP_STATE.invitations[existingIndex].date = today;
    } else {
      APP_STATE.invitations.unshift({
        id: `inv-${Date.now()}`,
        candidateName: 'Alya Putri',
        initials: 'AP',
        candidateId: 'alya',
        role: selectedRole,
        date: today,
        status: 'pending',
        isNew: false
      });
    }

    const slotToUpdate = APP_STATE.team.slots.find(s => s.role === selectedRole);
    if (slotToUpdate) {
      slotToUpdate.status = 'pending';
      slotToUpdate.candidateName = 'Alya Putri';
      slotToUpdate.initials = 'AP';
      slotToUpdate.prodi = 'Teknik Informatika - Semester 5';
    }

    DOM.btnSubmitInvite.disabled = false;
    DOM.btnSubmitInvite.innerHTML = originalBtnContent;

    closeInviteModal();

    showToast(`Undangan untuk posisi ${selectedRole} berhasil dikirim ke Alya Putri!`);

    navigateToScreen('screen-invitations');
  }, 800);
}

function renderInvitations() {
  const pendingCount = APP_STATE.invitations.filter(i => i.status === 'pending').length;
  const acceptedCount = APP_STATE.invitations.filter(i => i.status === 'accepted').length;
  const rejectedCount = APP_STATE.invitations.filter(i => i.status === 'rejected').length;

  if (DOM.countPending) DOM.countPending.textContent = pendingCount;
  if (DOM.countAccepted) DOM.countAccepted.textContent = acceptedCount;
  if (DOM.countRejected) DOM.countRejected.textContent = rejectedCount;

  const filtered = APP_STATE.invitations.filter(inv => {
    if (APP_STATE.invitationStatusFilter === 'Semua') return true;
    if (APP_STATE.invitationStatusFilter === 'Menunggu') return inv.status === 'pending';
    if (APP_STATE.invitationStatusFilter === 'Diterima') return inv.status === 'accepted';
    if (APP_STATE.invitationStatusFilter === 'Ditolak') return inv.status === 'rejected';
    return true;
  });

  if (DOM.invitationsTableBody) {
    DOM.invitationsTableBody.innerHTML = '';
    if (filtered.length === 0) {
      DOM.invitationsTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-4 text-muted">
            Tidak ada undangan dengan status "${APP_STATE.invitationStatusFilter}".
          </td>
        </tr>
      `;
    } else {
      filtered.forEach(inv => {
        const tr = document.createElement('tr');
        
        let statusBadgeHtml = '';
        if (inv.status === 'pending') {
          statusBadgeHtml = `<span class="status-badge status-badge-pending"><i class="bi bi-clock-fill"></i> Menunggu</span>`;
        } else if (inv.status === 'accepted') {
          statusBadgeHtml = `<span class="status-badge status-badge-accepted"><i class="bi bi-check-circle-fill"></i> Diterima</span>`;
        } else if (inv.status === 'rejected') {
          statusBadgeHtml = `<span class="status-badge status-badge-rejected"><i class="bi bi-x-circle-fill"></i> Ditolak</span>`;
        }

        const newBadge = inv.isNew ? `<span class="badge-new ms-2">Baru</span>` : '';

        tr.innerHTML = `
          <td>
            <div class="d-flex align-items-center gap-2">
              <strong class="text-primary">${inv.candidateName}</strong>
              ${newBadge}
            </div>
          </td>
          <td><strong>${inv.role}</strong></td>
          <td class="text-secondary">${inv.date}</td>
          <td>${statusBadgeHtml}</td>
          <td>
            ${inv.candidateId === 'alya' ? `
              <button class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 btn-open-profile-from-table" data-candidate-id="${inv.candidateId}">
                Lihat Profil
              </button>
            ` : `
              <span class="text-caption text-muted">Tidak ada aksi</span>
            `}
          </td>
        `;

        DOM.invitationsTableBody.appendChild(tr);
      });
    }
  }

  if (DOM.invitationsMobileList) {
    DOM.invitationsMobileList.innerHTML = '';
    if (filtered.length === 0) {
      DOM.invitationsMobileList.innerHTML = `
        <div class="empty-state-box py-4">
          <p class="text-muted mb-0">Tidak ada undangan dengan status "${APP_STATE.invitationStatusFilter}".</p>
        </div>
      `;
    } else {
      filtered.forEach(inv => {
        const card = document.createElement('div');
        card.className = `invitation-mobile-card dual-signifier-card status-${inv.status}`;
        
        let statusBadgeHtml = '';
        if (inv.status === 'pending') {
          statusBadgeHtml = `<span class="status-badge status-badge-pending"><i class="bi bi-clock-fill"></i> Menunggu</span>`;
        } else if (inv.status === 'accepted') {
          statusBadgeHtml = `<span class="status-badge status-badge-accepted"><i class="bi bi-check-circle-fill"></i> Diterima</span>`;
        } else if (inv.status === 'rejected') {
          statusBadgeHtml = `<span class="status-badge status-badge-rejected"><i class="bi bi-x-circle-fill"></i> Ditolak</span>`;
        }

        const newBadge = inv.isNew ? `<span class="badge-new ms-2">Baru</span>` : '';

        card.innerHTML = `
          <div class="d-flex align-items-center justify-content-between">
            <h4 class="mb-0 fs-6 fw-bold text-primary">${inv.candidateName} ${newBadge}</h4>
            <div>${statusBadgeHtml}</div>
          </div>
          <div class="d-flex justify-content-between align-items-center text-caption">
            <span class="fw-semibold text-secondary">${inv.role}</span>
            <span class="text-muted">${inv.date}</span>
          </div>
          ${inv.candidateId === 'alya' ? `
            <div class="pt-2 border-top">
              <button class="btn btn-sm btn-outline-secondary w-100 rounded-pill py-1 btn-open-profile-from-table" data-candidate-id="${inv.candidateId}">
                Lihat Profil
              </button>
            </div>
          ` : ''}
        `;

        DOM.invitationsMobileList.appendChild(card);
      });
    }
  }

  document.querySelectorAll('.btn-open-profile-from-table').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToScreen('screen-profile');
    });
  });
}

function renderTeamPositions() {
  const slots = APP_STATE.team.slots;
  const totalSlots = slots.length;
  const acceptedCount = slots.filter(s => s.status === 'accepted').length;
  const pendingCount = slots.filter(s => s.status === 'pending').length;
  const vacantCount = slots.filter(s => s.status === 'vacant').length;

  if (DOM.teamFilledCount) DOM.teamFilledCount.textContent = acceptedCount;
  if (DOM.teamPendingCount) DOM.teamPendingCount.textContent = pendingCount;
  if (DOM.teamVacantCount) DOM.teamVacantCount.textContent = vacantCount;

  if (DOM.teamProgressText) {
    DOM.teamProgressText.textContent = `${acceptedCount} dari ${totalSlots} posisi terisi`;
  }

  const progressPercent = Math.round((acceptedCount / totalSlots) * 100);
  if (DOM.teamProgressBarFill) {
    DOM.teamProgressBarFill.style.width = `${progressPercent}%`;
  }

  if (DOM.teamSlotsContainer) {
    DOM.teamSlotsContainer.innerHTML = '';

    slots.forEach(slot => {
      const card = document.createElement('article');
      card.className = `position-slot-card dual-signifier-card status-${slot.status} ${slot.status === 'vacant' ? 'vacant-slot' : ''}`;
      card.setAttribute('aria-label', `Posisi ${slot.role} - Status ${slot.status}`);

      let statusBadge = '';
      let avatarHtml = '';
      let detailHtml = '';
      let actionHtml = '';

      if (slot.status === 'accepted') {
        statusBadge = `<span class="status-badge status-badge-accepted"><i class="bi bi-check-circle-fill"></i> Terisi (Diterima)</span>`;
        avatarHtml = `<div class="slot-avatar avatar-bima">${slot.initials}</div>`;
        detailHtml = `
          <div>
            <div class="slot-role-name">${slot.role}</div>
            <div class="slot-candidate-name">${slot.candidateName} &bull; ${slot.prodi}</div>
          </div>
        `;
        actionHtml = `<span class="text-caption text-success fw-semibold"><i class="bi bi-shield-check"></i> Anggota Resmi</span>`;
      } else if (slot.status === 'pending') {
        statusBadge = `<span class="status-badge status-badge-pending"><i class="bi bi-clock-fill"></i> Menunggu Respons</span>`;
        avatarHtml = `<div class="slot-avatar avatar-alya">${slot.initials}</div>`;
        detailHtml = `
          <div>
            <div class="slot-role-name">${slot.role}</div>
            <div class="slot-candidate-name">${slot.candidateName} &bull; ${slot.prodi}</div>
          </div>
        `;
        actionHtml = `
          <button class="btn btn-sm btn-outline-warning text-dark rounded-pill px-3 py-1 btn-view-invites-from-slot">
            Lihat Status
          </button>
        `;
      } else {
        statusBadge = `<span class="status-badge status-badge-vacant"><i class="bi bi-dash-circle"></i> Posisi Kosong</span>`;
        avatarHtml = `<div class="slot-avatar" style="background:#EFEAF5; color:#625173;"><i class="bi bi-person-plus-fill"></i></div>`;
        detailHtml = `
          <div>
            <div class="slot-role-name">${slot.role}</div>
            <div class="slot-candidate-name text-muted">Belum ada kandidat yang terpilih atau diundang</div>
          </div>
        `;
        actionHtml = `
          <button class="btn-cta-cyan btn-sm btn-fill-vacant-slot" data-role="${slot.role}">
            <i class="bi bi-plus-lg"></i>
            <span>Cari Kandidat</span>
          </button>
        `;
      }

      card.innerHTML = `
        <div class="slot-info-group">
          ${avatarHtml}
          ${detailHtml}
        </div>
        <div class="d-flex align-items-center gap-3">
          ${statusBadge}
          ${actionHtml}
        </div>
      `;

      DOM.teamSlotsContainer.appendChild(card);
    });

    document.querySelectorAll('.btn-view-invites-from-slot').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateToScreen('screen-invitations');
      });
    });

    document.querySelectorAll('.btn-fill-vacant-slot').forEach(btn => {
      btn.addEventListener('click', () => {
        APP_STATE.searchQuery = '';
        if (DOM.searchInput) {
          DOM.searchInput.value = '';
          DOM.searchInput.focus();
        }
        APP_STATE.activeCategory = 'Semua';
        DOM.categoryChips.forEach(chip => {
          if (chip.getAttribute('data-category') === 'Semua') {
            chip.classList.add('active');
          } else {
            chip.classList.remove('active');
          }
        });
        navigateToScreen('screen-dashboard');
        showToast('Silakan cari atau pilih kandidat untuk posisi Frontend Developer.');
      });
    });
  }
}

function showToast(message) {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'toast-custom';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <i class="bi bi-check-circle-fill text-info fs-5"></i>
    <span>${message}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

function initEventListeners() {
  const brandLogo = document.getElementById('brandLogo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToScreen('screen-dashboard');
    });
  }

  DOM.navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-target-screen');
      if (target) {
        navigateToScreen(target);
      }
    });
  });

  if (DOM.searchInput) {
    DOM.searchInput.addEventListener('input', handleSearchInput);
  }

  if (DOM.resetSearchBtn) {
    DOM.resetSearchBtn.addEventListener('click', () => {
      APP_STATE.searchQuery = '';
      if (DOM.searchInput) DOM.searchInput.value = '';
      APP_STATE.activeCategory = 'Semua';
      DOM.categoryChips.forEach(chip => {
        if (chip.getAttribute('data-category') === 'Semua') {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
      renderCandidates();
    });
  }

  DOM.categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      DOM.categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      APP_STATE.activeCategory = chip.getAttribute('data-category');
      renderCandidates();
    });
  });

  const btnNotification = document.getElementById('btnNotification');
  if (btnNotification) {
    btnNotification.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToScreen('screen-invitations');
    });
  }

  const backBtn = document.getElementById('btnBackToDashboard');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToScreen('screen-dashboard');
    });
  }

  if (DOM.btnOpenInviteModal) {
    DOM.btnOpenInviteModal.addEventListener('click', openInviteModal);
  }

  if (DOM.btnCloseInviteDialog) {
    DOM.btnCloseInviteDialog.addEventListener('click', closeInviteModal);
  }
  if (DOM.btnCancelInvite) {
    DOM.btnCancelInvite.addEventListener('click', closeInviteModal);
  }

  if (DOM.inviteDialog) {
    DOM.inviteDialog.addEventListener('click', (e) => {
      const rect = DOM.inviteDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeInviteModal();
      }
    });

    DOM.inviteDialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeInviteModal();
      }
    });
  }

  DOM.inviteRoleInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (DOM.inviteErrorAlert) DOM.inviteErrorAlert.style.display = 'none';
      document.querySelectorAll('.role-radio-label').forEach(label => label.classList.remove('selected'));
      const parentLabel = input.closest('.role-radio-label');
      if (parentLabel) parentLabel.classList.add('selected');
    });
  });

  if (DOM.btnSubmitInvite) {
    DOM.btnSubmitInvite.addEventListener('click', handleInviteFormSubmit);
  }

  DOM.statusFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.statusFilterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      APP_STATE.invitationStatusFilter = btn.getAttribute('data-status');
      renderInvitations();
    });
  });

  if (DOM.btnDismissUpdateBanner) {
    DOM.btnDismissUpdateBanner.addEventListener('click', () => {
      if (DOM.statusUpdateBanner) {
        DOM.statusUpdateBanner.style.display = 'none';
      }
      APP_STATE.unreadUpdates = 0;
      if (DOM.unreadBadge) {
        DOM.unreadBadge.style.display = 'none';
      }
      showToast('Pembaruan status telah ditandai sebagai sudah dibaca.');
    });
  }

  if (DOM.btnViewInvitationsFromTeam) {
    DOM.btnViewInvitationsFromTeam.addEventListener('click', () => {
      navigateToScreen('screen-invitations');
    });
  }

  if (DOM.btnOpenFilterModal && DOM.filterDialog) {
    DOM.btnOpenFilterModal.addEventListener('click', () => {
      if (typeof DOM.filterDialog.showModal === 'function') {
        DOM.filterDialog.showModal();
      }
    });
  }
  if (DOM.btnCloseFilterDialog && DOM.filterDialog) {
    DOM.btnCloseFilterDialog.addEventListener('click', () => {
      DOM.filterDialog.close();
    });
  }
  if (DOM.btnApplyFilters && DOM.filterDialog) {
    DOM.btnApplyFilters.addEventListener('click', () => {
      const prodiCheckboxes = document.querySelectorAll('input[name="filterProdi"]:checked');
      const skillsCheckboxes = document.querySelectorAll('input[name="filterSkill"]:checked');

      APP_STATE.filterProdi = Array.from(prodiCheckboxes).map(c => c.value);
      APP_STATE.filterSkills = Array.from(skillsCheckboxes).map(c => c.value);

      DOM.filterDialog.close();
      renderCandidates();
      showToast(`Filter diterapkan: ${APP_STATE.filterProdi.length + APP_STATE.filterSkills.length} kriteria aktif.`);
    });
  }
  if (DOM.btnResetFilters && DOM.filterDialog) {
    DOM.btnResetFilters.addEventListener('click', () => {
      document.querySelectorAll('input[name="filterProdi"]').forEach(c => c.checked = false);
      document.querySelectorAll('input[name="filterSkill"]').forEach(c => c.checked = false);
      APP_STATE.filterProdi = [];
      APP_STATE.filterSkills = [];
      DOM.filterDialog.close();
      renderCandidates();
      showToast('Filter kriteria berhasil direset.');
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadAllScreens();
  initDOMElements();
  initEventListeners();
  renderCandidates();
  renderInvitations();
  renderTeamPositions();
});
