// ========================================
// Life RPG Dashboard — Router & Init
// ========================================

let currentPage = 'home';
let currentSubPage = null;

function navigate(page, sub = null) {
  currentPage = page;
  currentSubPage = sub;
  renderPage();
  updateTabs();
  updateHeader();
  document.getElementById('main-content').scrollTop = 0;
}

function updateTabs() {
  document.querySelectorAll('.tab-item').forEach(t => {
    t.classList.toggle('active', t.dataset.page === currentPage);
  });
}

function updateHeader() {
  const titles = { home:'Life RPG', powers:'능력치', finance:'재무력', tasks:'퀘스트', journal:'기록', settings:'설정' };
  const subTitles = { action:'⚔️ 실행력', intel:'📚 지능력', finance:'💰 재무력', willpower:'🧠 의지력',
    strategy:'🗺️ 전략실', reward:'🎁 보상실', inventory:'💡 인벤토리', record:'📊 기록실' };
  const backBtn = document.getElementById('back-btn');
  const settingsBtn = document.getElementById('settings-btn');

  if (currentSubPage || currentPage === 'settings') {
    backBtn.classList.remove('hidden');
    settingsBtn.classList.add('hidden');
    document.getElementById('page-title').textContent = currentSubPage ? (subTitles[currentSubPage]||titles[currentPage]) : titles[currentPage];
  } else {
    backBtn.classList.add('hidden');
    settingsBtn.classList.remove('hidden');
    document.getElementById('page-title').textContent = titles[currentPage] || 'Life RPG';
  }
}

function renderPage() {
  const main = document.getElementById('main-content');
  document.querySelectorAll('.fab').forEach(f => f.remove());

  try {
    switch(currentPage) {
      case 'home': main.innerHTML = renderHome(); break;
      case 'powers': main.innerHTML = currentSubPage ? renderPowerDetail(currentSubPage) : renderPowers(); break;
      case 'finance': main.innerHTML = renderFinance(); addFAB('finance'); break;
      case 'tasks': main.innerHTML = renderTasks(); addFAB('task'); break;
      case 'journal': main.innerHTML = renderJournal(); addFAB('journal'); break;
      case 'settings': main.innerHTML = renderSettings(); break;
    }
  } catch(e) {
    console.error('renderPage error:', e);
    main.innerHTML = '<div class="page" style="padding:20px;color:#f66"><h3>⚠️ 렌더링 오류</h3><pre>' + e.message + '</pre></div>';
  }
  main.querySelector('.page')?.classList.add('page-enter');
}

function renderSettings() {
  const { character: c, profile: p, powerScores: ps } = Store.data;
  return `<div class="page" id="page-settings">
    <div class="settings-section"><div class="settings-title">캐릭터 정보</div>
      <div class="settings-item" onclick="showCharacterEditModal()"><div class="settings-item-left"><span class="settings-icon">⚔️</span><span class="settings-label">캐릭터</span></div><span class="settings-value">${c.name} · Lv.${c.level}</span></div>
      <div class="settings-item" onclick="showCharacterEditModal()"><div class="settings-item-left"><span class="settings-icon">🎯</span><span class="settings-label">목표</span></div><span class="settings-value">${c.dreamJob}</span></div>
    </div>
    <div class="settings-section"><div class="settings-title">스탯 & 포인트</div>
      <div class="settings-item" onclick="showStatEditModal()"><div class="settings-item-left"><span class="settings-icon">⛏️</span><span class="settings-label">파워 스코어</span></div><span class="settings-value">EXP ${c.exp}</span></div>
      <div class="settings-item" onclick="showStatEditModal()"><div class="settings-item-left"><span class="settings-icon">🪙</span><span class="settings-label">코인</span></div><span class="settings-value">${c.coins}</span></div>
    </div>
    <div class="settings-section"><div class="settings-title">프로필</div>
      <div class="settings-item" onclick="showProfileEditModal()"><div class="settings-item-left"><span class="settings-icon">👤</span><span class="settings-label">프로필</span></div><span class="settings-value">${p.gender} · ${p.age}세</span></div>
    </div>
    <div class="settings-section"><div class="settings-title">데이터</div>
      <div class="settings-item" onclick="exportData()"><div class="settings-item-left"><span class="settings-icon">📤</span><span class="settings-label">내보내기</span></div><span class="settings-value">JSON</span></div>
      <div class="settings-item" onclick="importData()"><div class="settings-item-left"><span class="settings-icon">📥</span><span class="settings-label">가져오기</span></div></div>
      <div class="settings-item" onclick="if(confirm('모든 데이터 초기화?')){Store.reset();navigate('home');showToast('🔄 초기화')}"><div class="settings-item-left"><span class="settings-icon">🗑️</span><span class="settings-label">초기화</span></div><span class="settings-value" style="color:var(--hp-color)">위험</span></div>
    </div>
  </div>`;
}

function addFAB(type) {
  const handlers = { finance:"showFinanceModal('expense')", journal:"showJournalModal()", task:"showProjectModal()" };
  document.getElementById('app').insertAdjacentHTML('beforeend',
    `<button class="fab" onclick="${handlers[type]}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>`);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => { currentSubPage = null; navigate(tab.dataset.page); });
  });
  document.getElementById('back-btn').addEventListener('click', () => {
    if (currentSubPage) navigate('powers'); else if (currentPage === 'settings') navigate('home');
  });
  document.getElementById('settings-btn').addEventListener('click', () => navigate('settings'));
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  // Reset subscription payments on month change
  const lastMonth = localStorage.getItem('lastMonth');
  const curMonth = new Date().toISOString().slice(0,7);
  if (lastMonth !== curMonth) {
    Store.data.subscriptions.forEach(s => s.paidThisMonth = false);
    Store.commit();
    localStorage.setItem('lastMonth', curMonth);
  }

  navigate('home');
});

if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
