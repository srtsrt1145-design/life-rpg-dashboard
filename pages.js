// ========================================
// Life RPG Dashboard — Page Renderers
// ========================================

// --- Home Page ---
function renderHome() {
  RPG.refresh();
  const { character: c, profile: p, powerScores: ps } = Store.data;
  const pct = (v, m) => Math.round((v / m) * 100);
  return `<div class="page" id="page-home">
    <div class="character-card">
      <div class="character-header">
        <div class="character-avatar">⚔️</div>
        <div class="character-info">
          <h2>${c.name}</h2>
          <div class="character-level">⭐ Lv.${c.level} <span style="margin-left:8px;color:var(--accent-gold)">🪙 ${c.coins}</span></div>
          <div class="character-goal">🎯 ${c.dreamJob}</div>
        </div>
      </div>
      <div class="stat-bars">
        <div class="stat-row"><span class="stat-label exp">EXP</span><div class="stat-bar-track exp"><div class="stat-bar-fill exp" style="width:${pct(c.exp,c.expMax)}%"></div></div><span class="stat-value">${c.exp}/${c.expMax}</span></div>
        <div class="stat-row"><span class="stat-label hp">HP</span><div class="stat-bar-track hp"><div class="stat-bar-fill hp" style="width:${pct(c.hp,c.hpMax)}%"></div></div><span class="stat-value">${c.hp}/${c.hpMax}</span></div>
        <div class="stat-row"><span class="stat-label mp">MP</span><div class="stat-bar-track mp"><div class="stat-bar-fill mp" style="width:${pct(c.mp,c.mpMax)}%"></div></div><span class="stat-value">${c.mp}/${c.mpMax}</span></div>
      </div>
      <div class="year-goal-section">
        <div class="year-goal-header"><span class="year-goal-label">📅 이번년도 목표</span><span class="year-goal-value">${c.yearGoal}%</span></div>
        <div class="quest-progress-track"><div class="quest-progress-fill" style="width:${c.yearGoal}%"></div></div>
      </div>
    </div>
    <div class="section-header"><h3 class="section-title"><span class="emoji">⛏️</span> 능력치 점수</h3></div>
    <div class="power-score-grid">
      ${[{k:'action',l:'실행력',i:'⚔️'},{k:'willpower',l:'의지력',i:'🧠'},{k:'finance',l:'재무력',i:'💰'},{k:'intel',l:'지능력',i:'📚'},{k:'creativity',l:'창의력',i:'💡'},{k:'physical',l:'신체',i:'💪'}].map(p=>`
        <div class="power-score-item"><span class="power-score-icon">${p.i}</span><div class="power-score-bar-track"><div class="power-score-bar-fill" style="width:${ps[p.k]}%;background:var(--accent-purple)"></div></div><span class="power-score-val">${ps[p.k]}</span></div>`).join('')}
    </div>
    <div class="quick-stats">
      <div class="quick-stat-card"><div class="quick-stat-icon">🎯</div><div class="quick-stat-value">${c.focusSetting}h</div><div class="quick-stat-label">집중 셋팅</div></div>
      <div class="quick-stat-card"><div class="quick-stat-icon">📊</div><div class="quick-stat-value">${Store.data.quests.filter(q=>q.status!=='done').length}</div><div class="quick-stat-label">활성 퀘스트</div></div>
      <div class="quick-stat-card"><div class="quick-stat-icon">📖</div><div class="quick-stat-value">${Store.data.books.filter(b=>b.status==='reading').length}</div><div class="quick-stat-label">독서 중</div></div>
      <div class="quick-stat-card"><div class="quick-stat-icon">💰</div><div class="quick-stat-value">${formatMoney(Finance.netWorth())}</div><div class="quick-stat-label">순 재산</div></div>
    </div>
    <div class="profile-card">
      <div class="profile-row"><span class="profile-label">모드</span><span class="profile-value">${p.mode}</span></div>
      <div class="profile-row"><span class="profile-label">성별</span><span class="profile-value">${p.gender}</span></div>
      <div class="profile-row"><span class="profile-label">신체</span><span class="profile-value">${p.age}세 · ${p.height}cm · ${p.weight}kg</span></div>
      <div class="profile-row"><span class="profile-label">생년월일</span><span class="profile-value">${p.birthdate}</span></div>
    </div>
  </div>`;
}

// --- Powers Grid ---
function renderPowers() {
  const ps = Store.data.powerScores;
  const powers = [
    { key:'action', icon:'⚔️', title:'실행력', desc:'퀘스트·프로젝트 관리', score: ps.action },
    { key:'intel', icon:'📚', title:'지능력', desc:'독서·강의 트래킹', score: ps.intel },
    { key:'finance', icon:'💰', title:'재무력', desc:'자산·빚·수입·지출', score: ps.finance },
    { key:'willpower', icon:'🧠', title:'의지력', desc:'습관·루틴 관리', score: ps.willpower },
    { key:'strategy', icon:'🗺️', title:'전략실', desc:'연간 목표 관리', score: null },
    { key:'reward', icon:'🎁', title:'보상실', desc:'포인트 상점', score: null },
    { key:'inventory', icon:'💡', title:'인벤토리', desc:'아이디어 메모', score: null },
    { key:'record', icon:'📊', title:'기록실', desc:'일일 기록·리포트', score: null }
  ];
  return `<div class="page" id="page-powers">
    <div class="section-header"><h3 class="section-title"><span class="emoji">🗺️</span> 상태창</h3></div>
    <div class="power-grid">${powers.map(pw => `
      <div class="power-card" data-power="${pw.key}" onclick="navigate('powers','${pw.key}')">
        <div class="power-card-icon">${pw.icon}</div>
        <div class="power-card-title">${pw.title}</div>
        <div class="power-card-desc">${pw.desc}</div>
        ${pw.score !== null ? `<div class="power-card-rank">⛏️ ${pw.score}pt</div>` : ''}
      </div>`).join('')}
    </div>
  </div>`;
}

function renderPowerDetail(key) {
  const map = { action: renderActionPower, intel: renderIntelPower, finance: renderFinance,
    willpower: renderWillpowerPower, strategy: renderStrategy, reward: renderRewardShop,
    inventory: renderInventory, record: renderDailyLog };
  return (map[key] || (() => '<div class="page"><div class="empty-state"><div class="empty-state-icon">🚧</div></div></div>'))();
}

// --- 실행력 Action Power (Quest System) ---
function renderActionPower() {
  const today = todayStr();
  const { projects, quests, actionStats: stats } = Store.data;
  // Calculate monthly time
  const totalTime = quests.reduce((s,q) => s + (q.timeSpent||0), 0);
  const daysInMonth = new Date().getDate();
  const dailyAvg = daysInMonth > 0 ? Math.round(totalTime / daysInMonth) : 0;
  // Count active/frozen
  const activeCount = quests.filter(q => q.status === 'doing').length;
  const frozenCount = quests.filter(q => q.status === 'paused').length;
  const alertCount = quests.filter(q => q.status === 'todo' && q.deadline && q.deadline < today).length;
  // Check project overdue
  projects.forEach(p => { p.overdue = p.deadline && p.deadline < today && p.status === 'active'; });
  Store.commit();

  return `<div class="page">
    <!-- 총괄 브리핑 -->
    <div class="briefing-section">
      <div class="briefing-left">
        <div class="briefing-rank-label">이번 달 등급</div>
        <div class="briefing-rank-badge">⚔️ ${stats.rank||'아이언'}</div>
        <div class="briefing-progress-track"><div class="briefing-progress-fill" style="width:${Store.data.powerScores.action}%"></div></div>
        <div class="briefing-time">
          <div>한달 ⏱️ ${formatTime(totalTime)}</div>
          <div>하루 평균 ⏱️ ${formatTime(dailyAvg)}</div>
        </div>
      </div>
      <div class="briefing-right">
        <div class="briefing-secretary-label">실행력</div>
        <div class="briefing-alerts">
          <div class="alert-row">알림 <span class="alert-count">${alertCount}</span></div>
          <div class="alert-row">활용 <span class="alert-count">${activeCount}</span></div>
          <div class="alert-row">냉동 <span class="alert-count">${frozenCount}</span></div>
        </div>
      </div>
    </div>

    <!-- 전략 프로젝트 -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">🎯</span> 전략 프로젝트</h3>
      <button class="section-action" onclick="showProjectModal()">+ 추가</button></div>
    <div class="project-gallery">${projects.map(p => `
      <div class="project-card" onclick="showProjectModal(${p.id})">
        <div class="project-cover">${p.cover||'📂'}</div>
        <div class="project-card-body">
          <div class="project-card-title">${p.title}</div>
          ${p.overdue ? '<div class="project-overdue">☠️ Overdue ☠️</div>' : (p.deadline ? `<div class="project-deadline">${p.deadline}</div>` : '')}
          <div class="project-progress-row">
            <div class="project-progress-bar"><div class="project-progress-fill" style="width:${p.progress}%"></div></div>
            <span class="project-progress-pct">${p.progress}%</span>
          </div>
          <div class="project-stage">STAGE SIZE : ⛏️ ${p.stageSize||0}</div>
          <div class="project-actions" onclick="event.stopPropagation()">
            ${p.status==='active' ? `
              <button class="project-btn" onclick="startProject(${p.id})">■시작■</button>
              <button class="project-btn" onclick="freezeProject(${p.id})">■냉동■</button>
            ` : p.status==='paused' ? `
              <button class="project-btn" onclick="resumeProject(${p.id})">■재개■</button>
            ` : ''}
          </div>
        </div>
      </div>`).join('')}
      <div class="project-card project-card-add" onclick="showProjectModal()">
        <div class="project-cover" style="opacity:0.3">➕</div>
        <div class="project-card-body"><div class="project-card-title" style="color:var(--text-muted)">+ 새 페이지</div></div>
      </div>
    </div>

    <!-- Quick Button -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">⚡</span> Quick Button</h3></div>
    <div class="quick-button-row">
      <button class="quick-btn" onclick="showProjectModal()">📂 PROJECT</button>
      <button class="quick-btn" onclick="showToast('영역 관리')">🧭 AREA</button>
      <button class="quick-btn" onclick="showToast('자료실')">📚 RESOURCE</button>
      <button class="quick-btn" onclick="showToast('보관소')">🧊 ARCHIVE</button>
    </div>

    <!-- QUEST -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">📦</span> QUEST</h3>
      <button class="section-action" onclick="showQuestModal()">+ 추가</button></div>
    <div class="filter-tabs" id="quest-filters">
      ${['all','today','tomorrow','week','project'].map((f,i)=>`<button class="filter-tab${f==='all'?' active':''}" onclick="filterQuests('${f}')">${{all:'All',today:'Today',tomorrow:'Tomorrow',week:'Next 7 Days',project:'Project'}[f]}</button>`).join('')}
    </div>
    <div id="quest-list">${renderQuestList('all')}</div>

    <!-- MAIN QUEST / EVENT Calendar -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">📆</span> MAIN QUEST / EVENT</h3></div>
    ${renderWeekCalendar()}
  </div>`;
}

function renderQuestList(filter) {
  const today = todayStr();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0,10);
  const nextWeek = new Date(Date.now() + 7*86400000).toISOString().slice(0,10);
  let quests = Store.data.quests;

  if (filter === 'today') quests = quests.filter(q => q.deadline === today);
  else if (filter === 'tomorrow') quests = quests.filter(q => q.deadline === tomorrow);
  else if (filter === 'week') quests = quests.filter(q => q.deadline && q.deadline <= nextWeek && q.deadline >= today);
  else if (filter === 'project') quests = quests.filter(q => q.projectId);

  const statusIcons = {todo:'🛑', doing:'▶️', done:'✅', paused:'⏸️'};
  const typeStyles = {MAIN:'quest-type-main', SUB:'quest-type-sub', ARROW:'quest-type-arrow', DOT:'quest-type-dot'};
  const typeLabels = {MAIN:'𝐌𝐀𝐈𝐍', SUB:'𝐒𝐔𝐁', ARROW:'=>', DOT:'●'};

  if (!quests.length) return '<div class="empty-state" style="padding:16px"><div class="empty-state-desc">해당 퀘스트 없음</div></div>';
  
  return quests.map(q => {
    const project = q.projectId ? Store.data.projects.find(p => p.id === q.projectId) : null;
    const elapsed = q.timerRunning && q.timerStart ? q.timeSpent + Math.floor((Date.now()-q.timerStart)/60000) : q.timeSpent;
    return `<div class="quest-row">
      <div class="quest-status-icon">${statusIcons[q.status]||'🛑'}</div>
      <span class="quest-type ${typeStyles[q.type]||''}">${typeLabels[q.type]||q.type}</span>
      <div class="quest-row-title" onclick="showQuestModal(${q.id})">${q.title}</div>
      <span class="quest-time">⏱️ ${q.timeSpent}분</span>
      ${project ? `<span class="quest-project">📂 ${project.title.slice(0,8)}</span>` : ''}
      ${q.deadline && q.deadline < today ? '<span class="quest-overdue-badge">Overdue</span>' : ''}
      <div class="quest-row-actions" onclick="event.stopPropagation()">
        ${q.status !== 'done' ? `
          <button class="project-btn" onclick="startQuest(${q.id})">${q.timerRunning?'■정지■':'■시작■'}</button>
          <button class="project-btn" onclick="completeQuest(${q.id})">■완료■</button>
        ` : ''}
      </div>
    </div>`;
  }).join('');
}

function renderWeekCalendar() {
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const sunday = new Date(today); sunday.setDate(today.getDate() - dayOfWeek);
  const days = ['일','월','화','수','목','금','토'];
  const quests = Store.data.quests;

  let html = '<div class="week-calendar"><div class="week-cal-header">';
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday); d.setDate(sunday.getDate()+i);
    const ds = d.toISOString().slice(0,10);
    const isToday = ds === todayStr();
    html += `<div class="week-cal-day${isToday?' today':''}"><div class="week-cal-dayname">${days[i]}</div><div class="week-cal-date${isToday?' today':''}">${d.getDate()}</div></div>`;
  }
  html += '</div><div class="week-cal-body">';
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday); d.setDate(sunday.getDate()+i);
    const ds = d.toISOString().slice(0,10);
    const dayQuests = quests.filter(q => q.deadline === ds);
    html += `<div class="week-cal-col">${dayQuests.map(q => `<div class="week-cal-event">${q.title.slice(0,8)}</div>`).join('')}</div>`;
  }
  html += '</div></div>';
  return html;
}

// --- 재무력 Finance ---
function renderFinance() {
  const { finances, subscriptions, assets, debts, yearlyGoals } = Store.data;
  const recent = [...finances].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,10);
  
  // Rank calculation based on savings rate
  const mIncome = Finance.monthlyIncome();
  const mExpense = Finance.monthlyExpense();
  const savingsRate = mIncome > 0 ? Math.round(((mIncome - mExpense) / mIncome) * 100) : 0;
  const ranks = [
    { name: '아이언', min: -999, desc: '재무 관리를 시작하지 않은 상태', icon: '⚔️' },
    { name: '브론즈', min: 10, desc: '저축을 시작한 단계', icon: '🥉' },
    { name: '실버', min: 30, desc: '안정적 저축 중', icon: '🥈' },
    { name: '골드', min: 50, desc: '재무 자유를 향해', icon: '🥇' },
    { name: '다이아', min: 70, desc: '완벽한 재무 관리', icon: '💎' }
  ];
  const currentRank = [...ranks].reverse().find(r => savingsRate >= r.min) || ranks[0];
  const nextRankIdx = ranks.indexOf(currentRank) + 1;
  const nextRank = nextRankIdx < ranks.length ? ranks[nextRankIdx] : currentRank;
  const rankProgress = nextRank !== currentRank ? Math.min(100, Math.max(0, Math.round(((savingsRate - currentRank.min) / (nextRank.min - currentRank.min)) * 100))) : 100;

  return `<div class="page" id="page-finance">
    <!-- 총괄 브리핑 -->
    <div class="briefing-section">
      <div class="briefing-left">
        <div class="briefing-rank-label">이번 달 등급</div>
        <div class="briefing-rank-badge">${currentRank.icon} ${currentRank.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${currentRank.desc}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">NEXT RANK: ${nextRank.name} (${rankProgress}%)</div>
        <div class="briefing-progress-track"><div class="briefing-progress-fill" style="width:${rankProgress}%"></div></div>
        <div class="briefing-time">
          <div>저축률 ${savingsRate}%</div>
          <div>순 재산 ${formatMoney(Finance.netWorth())}</div>
        </div>
      </div>
      <div class="briefing-right">
        <div class="briefing-secretary-label">재무력</div>
        <div class="briefing-alerts">
          <div class="alert-row">자산 <span class="alert-count">${assets.length}</span></div>
          <div class="alert-row">부채 <span class="alert-count">${debts.length}</span></div>
          <div class="alert-row">구독 <span class="alert-count">${subscriptions.length}</span></div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="finance-quick-actions">
      <button class="quick-action-btn" onclick="showFinanceModal('expense')"><div class="btn-icon expense">💸</div><span class="btn-label">새 지출</span></button>
      <button class="quick-action-btn" onclick="showFinanceModal('income')"><div class="btn-icon income">💰</div><span class="btn-label">새 수입</span></button>
      <button class="quick-action-btn" onclick="showFinanceModal('transfer')"><div class="btn-icon transfer">🏦</div><span class="btn-label">은행 이동</span></button>
    </div>

    <!-- My Flow -->
    <div class="finance-summary">
      <div class="finance-metric full-width"><div class="finance-metric-label">순 재산</div><div class="finance-metric-value ${Finance.netWorth()>=0?'positive':'negative'}">${formatMoney(Finance.netWorth())}</div></div>
      <div class="finance-metric"><div class="finance-metric-label">총 자산</div><div class="finance-metric-value positive">${formatMoney(Finance.totalAssets())}</div></div>
      <div class="finance-metric"><div class="finance-metric-label">총 빚</div><div class="finance-metric-value negative">${formatMoney(Finance.totalDebts())}</div></div>
      <div class="finance-metric"><div class="finance-metric-label">월 수입</div><div class="finance-metric-value positive">${formatMoney(Finance.monthlyIncome())}</div></div>
      <div class="finance-metric"><div class="finance-metric-label">월 지출</div><div class="finance-metric-value negative">${formatMoney(Finance.monthlyExpense())}</div></div>
      <div class="finance-metric"><div class="finance-metric-label">월 순익</div><div class="finance-metric-value ${Finance.monthlyNet()>=0?'positive':'negative'}">${formatMoney(Finance.monthlyNet())}</div></div>
      <div class="finance-metric"><div class="finance-metric-label">월 구독료</div><div class="finance-metric-value negative">${formatMoney(Finance.monthlySubs())}</div></div>
    </div>

    <div class="section-header"><h3 class="section-title"><span class="emoji">🏦</span> 재산 LIST</h3>
      <button class="section-action" onclick="showAssetModal()">+ 추가</button></div>
    ${assets.map(a => `<div class="sub-item" onclick="showAssetModal(${a.id})"><div class="sub-info"><span class="sub-icon">🏦</span><div><div class="sub-name">${a.name}</div><div class="sub-cycle">${a.type}</div></div></div><span class="sub-amount positive">${formatMoney(a.balance)}</span></div>`).join('')}

    ${debts.length ? `<div class="section-header"><h3 class="section-title"><span class="emoji">💳</span> 빚 LIST</h3>
      <button class="section-action" onclick="showDebtModal()">+ 추가</button></div>
    ${debts.map(d => `<div class="sub-item" onclick="showDebtModal(${d.id})"><div class="sub-info"><span class="sub-icon">💳</span><div><div class="sub-name">${d.name}</div><div class="sub-cycle">${d.dueDate ? 'D'+(daysUntil(d.dueDate)<0?'+':'‐')+Math.abs(daysUntil(d.dueDate)) : ''}</div></div></div><span class="sub-amount negative">${formatMoney(d.remaining)}</span></div>`).join('')}` 
    : `<div class="section-header"><h3 class="section-title"><span class="emoji">💳</span> 빚 LIST</h3><button class="section-action" onclick="showDebtModal()">+ 추가</button></div><div class="empty-state" style="padding:16px"><div class="empty-state-desc">빚이 없습니다 👍</div></div>`}

    <div class="section-header"><h3 class="section-title"><span class="emoji">🔄</span> 구독</h3>
      <button class="section-action" onclick="showSubModal()">관리</button></div>
    ${subscriptions.map(s => `<div class="sub-item"><div class="sub-info"><span class="sub-icon">${s.icon}</span><div><div class="sub-name">${s.name}</div><div class="sub-cycle">${s.cycle}${s.paidThisMonth?' · ✅ 결제완료':''}</div></div></div>
      <div style="text-align:right"><span class="sub-amount">${formatMoney(s.amount)}</span>
      ${!s.paidThisMonth?`<button class="mini-btn" onclick="event.stopPropagation();paySub(${s.id})" style="font-size:10px;margin-top:4px">💳 결제</button>`:''}</div></div>`).join('')}

    <div class="section-header"><h3 class="section-title"><span class="emoji">📜</span> 최근 거래</h3></div>
    <div class="transaction-list">
      ${recent.length ? recent.map(renderTransactionItem).join('') : '<div class="empty-state" style="padding:16px"><div class="empty-state-desc">거래 내역이 없습니다</div></div>'}
    </div>
  </div>`;
}

function renderTransactionItem(f) {
  return `<div class="transaction-item" onclick="showFinanceModal('${f.type}',${f.id})">
    <div class="transaction-icon ${f.type}">${f.type==='income'?'💰':'💸'}</div>
    <div class="transaction-info"><div class="transaction-name">${f.name}</div><div class="transaction-category">${f.category||'기타'}</div></div>
    <div><div class="transaction-amount ${f.type}">${f.type==='income'?'+':'-'}${formatMoney(f.amount)}</div><div class="transaction-date">${f.date}</div></div>
  </div>`;
}

// --- 의지력 Willpower (Habits) ---
function renderWillpowerPower() {
  const { goodHabits, badHabits, yearlyGoals } = Store.data;
  const today = todayStr();
  const week = getWeekNumber();
  const doneGood = goodHabits.filter(h => h.history[today]).length;
  const doneBad = badHabits.filter(h => !h.history[today]).length;
  const totalGood = goodHabits.length;

  // Calculate monthly completion rate for rank
  const daysInMonth = new Date().getDate();
  let monthlyDone = 0, monthlyTotal = 0;
  if (totalGood > 0) {
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = new Date(new Date().getFullYear(), new Date().getMonth(), d).toISOString().slice(0,10);
      goodHabits.forEach(h => { monthlyTotal++; if (h.history[ds]) monthlyDone++; });
    }
  }
  const monthlyRate = monthlyTotal > 0 ? Math.round((monthlyDone / monthlyTotal) * 100) : 0;
  
  // Rank system
  const ranks = [
    { name: '아이언', min: 0, desc: '좋은 습관을 실천하지 않은 상태', icon: '⚔️' },
    { name: '브론즈', min: 20, desc: '습관 형성을 시작한 단계', icon: '🥉' },
    { name: '실버', min: 50, desc: '꾸준한 실천 중', icon: '🥈' },
    { name: '골드', min: 80, desc: '습관이 체화된 단계', icon: '🥇' },
    { name: '다이아', min: 95, desc: '완벽한 자기 관리', icon: '💎' }
  ];
  const currentRank = [...ranks].reverse().find(r => monthlyRate >= r.min) || ranks[0];
  const nextRankIdx = ranks.indexOf(currentRank) + 1;
  const nextRank = nextRankIdx < ranks.length ? ranks[nextRankIdx] : currentRank;
  const rankProgress = nextRank !== currentRank ? Math.min(100, Math.round(((monthlyRate - currentRank.min) / (nextRank.min - currentRank.min)) * 100)) : 100;

  const alertCount = goodHabits.filter(h => !h.history[today]).length;
  const activeCount = goodHabits.filter(h => h.history[today]).length;
  const frozenCount = badHabits.filter(h => h.history[today]).length;

  return `<div class="page">
    <!-- 총괄 브리핑 -->
    <div class="briefing-section">
      <div class="briefing-left">
        <div class="briefing-rank-label">이번 달 등급</div>
        <div class="briefing-rank-badge">${currentRank.icon} ${currentRank.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${currentRank.desc}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">NEXT RANK: ${nextRank.name} (${rankProgress}%)</div>
        <div class="briefing-progress-track"><div class="briefing-progress-fill" style="width:${rankProgress}%"></div></div>
        <div class="briefing-time">
          <div>이번 달 실천율 ${monthlyRate}%</div>
          <div>오늘 ${doneGood}/${totalGood} 완료</div>
        </div>
      </div>
      <div class="briefing-right">
        <div class="briefing-secretary-label">의지력</div>
        <div class="briefing-alerts">
          <div class="alert-row">알림 <span class="alert-count">${alertCount}</span></div>
          <div class="alert-row">활용 <span class="alert-count">${activeCount}</span></div>
          <div class="alert-row">냉동 <span class="alert-count">${frozenCount}</span></div>
        </div>
      </div>
    </div>

    <!-- 전략 프로젝트 (습관-목표 연결) -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">🎯</span> 전략 프로젝트</h3></div>
    <div class="project-gallery">
      ${yearlyGoals.slice(0,4).map(g => {
        const linkedGood = goodHabits.filter(h => h.goalId === g.id);
        const linkedBad = badHabits.filter(h => h.goalId === g.id);
        return `<div class="project-card">
          <div class="project-cover">🎯</div>
          <div class="project-card-body">
            <div class="project-card-title">${g.title}</div>
            ${linkedGood.map(h => `<div class="habit-tag good">➕ ${h.name}</div>`).join('')}
            ${linkedBad.map(h => `<div class="habit-tag bad">⛔ ${h.name}</div>`).join('')}
            ${!linkedGood.length && !linkedBad.length ? '<div style="font-size:11px;color:var(--text-muted)">연결된 습관 없음</div>' : ''}
          </div>
        </div>`;
      }).join('')}
      <div class="project-card project-card-add" onclick="showHabitModal('good')">
        <div class="project-cover" style="opacity:0.3">➕</div>
        <div class="project-card-body"><div class="project-card-title" style="color:var(--text-muted)">+ 습관 추가</div></div>
      </div>
    </div>

    <!-- 주간 현황 -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">📊</span> 주간 현황 (Week ${week})</h3></div>
    ${renderWeeklySummary()}

    <!-- 좋은 습관 -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">✅</span> 좋은 습관 (${doneGood}/${totalGood})</h3>
      <button class="section-action" onclick="showHabitModal('good')">+ 추가</button></div>
    <div class="habit-list">
    ${goodHabits.map(h => renderHabitItem(h, 'good', today)).join('')}
    ${!goodHabits.length ? '<div class="empty-state" style="padding:16px"><div class="empty-state-desc">좋은 습관을 등록하세요</div></div>':''}
    </div>

    <!-- 나쁜 습관 -->
    <div class="section-header"><h3 class="section-title"><span class="emoji">🚫</span> 나쁜 습관 (${doneBad}/${badHabits.length} 억제)</h3>
      <button class="section-action" onclick="showHabitModal('bad')">+ 추가</button></div>
    <div class="habit-list">
    ${badHabits.map(h => renderHabitItem(h, 'bad', today)).join('')}
    ${!badHabits.length ? '<div class="empty-state" style="padding:16px"><div class="empty-state-desc">나쁜 습관을 등록하세요</div></div>':''}
    </div>
  </div>`;
}

function renderHabitItem(h, type, today) {
  const checked = !!h.history[today];
  const isBad = type === 'bad';
  const displayCheck = isBad ? !checked : checked;
  const icon = isBad ? '⛔' : '➕';
  return `<div class="habit-row" onclick="toggleHabit(${h.id},'${type}')">
    <div class="habit-check-box${displayCheck?' checked':''}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <span class="habit-icon">${icon}</span>
    <span class="habit-name-text">${h.name}</span>
    <span class="habit-streak-badge">🔥 ${h.streak}</span>
    <button class="habit-delete-btn" onclick="event.stopPropagation();deleteHabit(${h.id},'${type}')">✕</button>
  </div>`;
}

function renderWeeklySummary() {
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const monday = new Date(today); monday.setDate(today.getDate() - dayOfWeek + 1);
  const days = ['월','화','수','목','금','토','일'];
  const allHabits = [...Store.data.goodHabits, ...Store.data.badHabits];
  if (!allHabits.length) return '<div class="empty-state" style="padding:16px"><div class="empty-state-desc">습관을 등록하세요</div></div>';

  let html = '<div class="weekly-grid"><div class="weekly-header"><div class="weekly-cell label"></div>';
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday); d.setDate(monday.getDate()+i);
    const isToday = d.toISOString().slice(0,10) === todayStr();
    html += `<div class="weekly-cell head${isToday?' today':''}">${days[i]}</div>`;
  }
  html += '</div>';
  
  allHabits.forEach(h => {
    const isBad = Store.data.badHabits.includes(h);
    html += `<div class="weekly-row"><div class="weekly-cell label">${isBad?'⛔':'➕'}${h.name.slice(0,5)}</div>`;
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday); d.setDate(monday.getDate()+i);
      const ds = d.toISOString().slice(0,10);
      const done = !!h.history[ds];
      const success = isBad ? !done : done;
      const isToday = ds === todayStr();
      html += `<div class="weekly-cell ${success?'done':''}${isToday?' today':''}">${success?'✅':'·'}</div>`;
    }
    html += '</div>';
  });
  html += '</div>';
  return html;
}

// --- 지능력 Intelligence ---
function renderIntelPower() {
  const { books, lectures } = Store.data;
  const reading = books.filter(b=>b.status==='reading');
  const completed = books.filter(b=>b.status==='completed');
  const completedBooks = completed.length;
  const completedLectures = lectures.filter(l => l.completedLessons >= l.totalLessons && l.totalLessons > 0).length;
  const score = completedBooks * 20 + completedLectures * 15 + reading.length * 5;
  const ranks = [
    { name: '아이언', min: 0, desc: '지식 성장을 시작하지 않은 상태', icon: '⚔️' },
    { name: '브론즈', min: 20, desc: '독서와 학습을 시작', icon: '🥉' },
    { name: '실버', min: 60, desc: '꾸준한 학습 중', icon: '🥈' },
    { name: '골드', min: 120, desc: '셀프러닝 마스터', icon: '🥇' },
    { name: '다이아', min: 200, desc: '학습의 완성', icon: '💎' }
  ];
  const currentRank = [...ranks].reverse().find(r => score >= r.min) || ranks[0];
  const nIdx = ranks.indexOf(currentRank) + 1;
  const nextRank = nIdx < ranks.length ? ranks[nIdx] : currentRank;
  const rp = nextRank !== currentRank ? Math.min(100, Math.round(((score - currentRank.min) / (nextRank.min - currentRank.min)) * 100)) : 100;

  return `<div class="page">
    <div class="briefing-section">
      <div class="briefing-left">
        <div class="briefing-rank-label">이번 달 등급</div>
        <div class="briefing-rank-badge">${currentRank.icon} ${currentRank.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${currentRank.desc}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">NEXT RANK: ${nextRank.name} (${rp}%)</div>
        <div class="briefing-progress-track"><div class="briefing-progress-fill" style="width:${rp}%"></div></div>
        <div class="briefing-time"><div>학습 점수 ${score}pt</div><div>완독 ${completedBooks}권 | 독서중 ${reading.length}권</div></div>
      </div>
      <div class="briefing-right">
        <div class="briefing-secretary-label">지능력</div>
        <div class="briefing-alerts">
          <div class="alert-row">도서 <span class="alert-count">${books.length}</span></div>
          <div class="alert-row">강의 <span class="alert-count">${lectures.length}</span></div>
          <div class="alert-row">완독 <span class="alert-count">${completedBooks}</span></div>
        </div>
      </div>
    </div>
    <div class="section-header"><h3 class="section-title"><span class="emoji">📖</span> 독서 (${reading.length}권 읽는 중)</h3>
      <button class="section-action" onclick="showBookModal()">+ 추가</button></div>
    ${books.map(b => { const pct = b.totalPages ? Math.round((b.currentPage/b.totalPages)*100) : 0;
      return `<div class="book-item" onclick="showBookModal(${b.id})">
        <div class="book-cover" style="background:rgba(168,85,247,0.12)">📖</div>
        <div class="book-info"><div class="book-title">${b.title}</div><div class="book-author">${b.author} · ${b.currentPage}/${b.totalPages}p</div>
          <div class="book-progress"><div class="book-progress-fill" style="width:${pct}%"></div></div></div>
        <span style="font-size:12px;color:var(--accent-purple);font-weight:600">${pct}%</span>
      </div>`;}).join('')}
    ${!books.length?'<div class="empty-state" style="padding:16px"><div class="empty-state-desc">책을 등록하세요</div></div>':''}
    <div class="section-header"><h3 class="section-title"><span class="emoji">🎓</span> 강의 (${lectures.length})</h3>
      <button class="section-action" onclick="showLectureModal()">+ 추가</button></div>
    ${lectures.map(l => { const pct = l.totalLessons ? Math.round((l.completedLessons/l.totalLessons)*100) : 0;
      return `<div class="book-item" onclick="showLectureModal(${l.id})">
        <div class="book-cover" style="background:rgba(96,165,250,0.12)">🎓</div>
        <div class="book-info"><div class="book-title">${l.title}</div><div class="book-author">${l.platform||'온라인'} · ${l.completedLessons}/${l.totalLessons}강</div>
          <div class="book-progress"><div class="book-progress-fill" style="width:${pct}%;background:var(--accent-blue)"></div></div></div>
        <span style="font-size:12px;color:var(--accent-blue);font-weight:600">${pct}%</span>
      </div>`;}).join('')}
    ${!lectures.length?'<div class="empty-state" style="padding:16px"><div class="empty-state-desc">강의를 등록하세요</div></div>':''}
  </div>`;
}

// --- 창의력 Creativity ---
function renderCreativityPower() {
  const { ideas } = Store.data;
  const sorted = [...ideas].sort((a,b) => new Date(b.date) - new Date(a.date));
  const thisMonth = ideas.filter(i => i.date && i.date.startsWith(new Date().toISOString().slice(0,7))).length;
  const score = ideas.length * 5;
  const ranks = [
    { name: '아이언', min: 0, desc: '아이디어를 기록하지 않은 상태', icon: '⚔️' },
    { name: '브론즈', min: 10, desc: '아이디어 기록을 시작', icon: '🥉' },
    { name: '실버', min: 30, desc: '꾸준한 아이디어 기록 중', icon: '🥈' },
    { name: '골드', min: 60, desc: '창의적 활동 활발', icon: '🥇' },
    { name: '다이아', min: 100, desc: '창의력 마스터', icon: '💎' }
  ];
  const currentRank = [...ranks].reverse().find(r => score >= r.min) || ranks[0];
  const nIdx = ranks.indexOf(currentRank) + 1;
  const nextRank = nIdx < ranks.length ? ranks[nIdx] : currentRank;
  const rp = nextRank !== currentRank ? Math.min(100, Math.round(((score - currentRank.min) / (nextRank.min - currentRank.min)) * 100)) : 100;

  return `<div class="page">
    <div class="briefing-section">
      <div class="briefing-left">
        <div class="briefing-rank-label">이번 달 등급</div>
        <div class="briefing-rank-badge">${currentRank.icon} ${currentRank.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${currentRank.desc}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">NEXT RANK: ${nextRank.name} (${rp}%)</div>
        <div class="briefing-progress-track"><div class="briefing-progress-fill" style="width:${rp}%"></div></div>
        <div class="briefing-time"><div>창의력 점수 ${score}pt</div><div>이번 달 아이디어 ${thisMonth}개</div></div>
      </div>
      <div class="briefing-right">
        <div class="briefing-secretary-label">창의력</div>
        <div class="briefing-alerts">
          <div class="alert-row">아이디어 <span class="alert-count">${ideas.length}</span></div>
          <div class="alert-row">이번 달 <span class="alert-count">${thisMonth}</span></div>
          <div class="alert-row">점수 <span class="alert-count">${score}</span></div>
        </div>
      </div>
    </div>
    <div class="section-header"><h3 class="section-title"><span class="emoji">💡</span> 아이디어 노트</h3>
      <button class="section-action" onclick="showIdeaModal()">+ 추가</button></div>
    ${sorted.map(idea => `<div class="journal-entry" onclick="showIdeaModal(${idea.id})">
        <div class="journal-date">${idea.date} ${daysUntil(idea.date) !== null ? \`(${Math.abs(daysUntil(idea.date))}일 전)\` : ''}</div>
        <div class="journal-title">${idea.title}</div>
        <div class="journal-preview">${idea.content||''}</div>
      </div>`).join('')}
    ${!ideas.length?'<div class="empty-state"><div class="empty-state-icon">💡</div><div class="empty-state-title">아이디어를 기록하세요</div><div class="empty-state-desc">번뜩이는 아이디어를 놓치지 마세요</div></div>':''}
  </div>`;
}

// --- 신체 Physical ---
function renderPhysicalPower() {
  const today = todayStr();
  const log = Store.data.dailyLogs.find(l => l.date === today) || { date: today, condition: { physical: 50, mental: 50, note: '' }, schedule: [] };
  const { goodHabits } = Store.data;
  const physicalHabits = goodHabits.filter(h => h.name.match(/운동|러닝|헬스|스트레칭|걷기|조깅|산책/));
  const exerciseDays = physicalHabits.reduce((c,h) => c + Object.keys(h.history).length, 0);
  const score = exerciseDays * 3 + log.condition.physical;
  const ranks = [
    { name: '아이언', min: 0, desc: '운동을 시작하지 않은 상태', icon: '⚔️' },
    { name: '브론즈', min: 30, desc: '운동을 시작한 단계', icon: '🥉' },
    { name: '실버', min: 80, desc: '꾸준한 운동 중', icon: '🥈' },
    { name: '골드', min: 150, desc: '건강한 라이프스타일', icon: '🥇' },
    { name: '다이아', min: 250, desc: '피지컬 마스터', icon: '💎' }
  ];
  const currentRank = [...ranks].reverse().find(r => score >= r.min) || ranks[0];
  const nIdx = ranks.indexOf(currentRank) + 1;
  const nextRank = nIdx < ranks.length ? ranks[nIdx] : currentRank;
  const rp = nextRank !== currentRank ? Math.min(100, Math.round(((score - currentRank.min) / (nextRank.min - currentRank.min)) * 100)) : 100;

  return `<div class="page">
    <div class="briefing-section">
      <div class="briefing-left">
        <div class="briefing-rank-label">이번 달 등급</div>
        <div class="briefing-rank-badge">${currentRank.icon} ${currentRank.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${currentRank.desc}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-bottom:4px">NEXT RANK: ${nextRank.name} (${rp}%)</div>
        <div class="briefing-progress-track"><div class="briefing-progress-fill" style="width:${rp}%"></div></div>
        <div class="briefing-time"><div>피지컬 점수 ${score}pt</div><div>운동 누적 ${exerciseDays}일</div></div>
      </div>
      <div class="briefing-right">
        <div class="briefing-secretary-label">신체</div>
        <div class="briefing-alerts">
          <div class="alert-row">컨디션 <span class="alert-count">${log.condition.physical}%</span></div>
          <div class="alert-row">정신력 <span class="alert-count">${log.condition.mental}%</span></div>
          <div class="alert-row">운동일 <span class="alert-count">${exerciseDays}</span></div>
        </div>
      </div>
    </div>
    <div class="section-header"><h3 class="section-title"><span class="emoji">📊</span> 오늘의 컨디션</h3>
      <button class="section-action" onclick="showConditionModal()">수정</button></div>
    <div class="condition-card">
      <div class="condition-row"><span class="condition-label">🏃 신체</span><div class="stat-bar-track hp"><div class="stat-bar-fill hp" style="width:${log.condition.physical}%"></div></div><span class="stat-value">${log.condition.physical}%</span></div>
      <div class="condition-row"><span class="condition-label">🧠 정신</span><div class="stat-bar-track mp"><div class="stat-bar-fill mp" style="width:${log.condition.mental}%"></div></div><span class="stat-value">${log.condition.mental}%</span></div>
      ${log.condition.note ? `<div class="condition-note">${log.condition.note}</div>` : ''}
    </div>
    <div class="section-header"><h3 class="section-title"><span class="emoji">🏋️</span> 운동 습관</h3></div>
    ${physicalHabits.length ? physicalHabits.map(h => renderHabitItem(h, 'good', today)).join('') :
      '<div class="empty-state" style="padding:16px"><div class="empty-state-desc">운동 관련 습관을 의지력에서 등록하세요<br>(운동, 러닝, 헬스, 스트레칭 등)</div></div>'}
    <div class="section-header"><h3 class="section-title"><span class="emoji">📈</span> 프로필</h3></div>
    <div class="condition-card">
      <div class="condition-row"><span class="condition-label">키 / 몸무게</span><span class="stat-value">${Store.data.profile.height}cm / ${Store.data.profile.weight}kg</span></div>
      <div class="condition-row"><span class="condition-label">나이</span><span class="stat-value">${Store.data.profile.age}세</span></div>
    </div>
  </div>`;
}

// --- 전략실 Strategy Room ---
function renderStrategy() {
  const { yearlyGoals } = Store.data;
  return `<div class="page">
    <div class="section-header"><h3 class="section-title"><span class="emoji">🗺️</span> 연간 목표</h3>
      <button class="section-action" onclick="showGoalModal()">+ 추가</button></div>
    ${yearlyGoals.map(g => {
      const pct = g.target ? Math.min(100, Math.round(Math.abs(g.current / g.target) * 100)) : 0;
      return `<div class="quest-item" onclick="showGoalModal(${g.id})">
        <div class="quest-header"><div class="quest-title">${g.title}</div><span class="quest-status active">${g.current}${g.unit} / ${g.target}${g.unit}</span></div>
        <div class="quest-progress-track"><div class="quest-progress-fill" style="width:${pct}%"></div></div>
        <div class="quest-meta"><span>${pct}% 달성</span><span>${g.category}</span></div>
      </div>`; }).join('')}
    ${!yearlyGoals.length?'<div class="empty-state"><div class="empty-state-icon">🗺️</div><div class="empty-state-title">연간 목표를 설정하세요</div></div>':''}
  </div>`;
}

// --- 보상실 Reward Shop ---
function renderRewardShop() {
  const { character, rewards, rewardLog, powerScores } = Store.data;
  return `<div class="page">
    <div class="section-header"><h3 class="section-title"><span class="emoji">🪙</span> 보유 코인: ${character.coins}</h3></div>
    <div class="section-header"><h3 class="section-title"><span class="emoji">⛏️</span> 채굴 현황</h3></div>
    <div class="power-score-grid">
      ${[{k:'action',l:'실행력'},{k:'willpower',l:'의지력'},{k:'finance',l:'재무력'},{k:'intel',l:'지능력'},{k:'creativity',l:'창의력'},{k:'physical',l:'신체'}].map(p=>`
        <div class="power-score-item"><span class="power-score-val" style="width:50px">${p.l}</span><div class="power-score-bar-track"><div class="power-score-bar-fill" style="width:${powerScores[p.k]}%;background:var(--accent-gold)"></div></div><span class="power-score-val">${powerScores[p.k]}pt</span></div>`).join('')}
    </div>
    <div class="section-header"><h3 class="section-title"><span class="emoji">🎁</span> 상점</h3>
      <button class="section-action" onclick="showRewardModal()">+ 추가</button></div>
    ${rewards.map(r => `<div class="sub-item">
      <div class="sub-info"><span class="sub-icon">${r.icon}</span><div><div class="sub-name">${r.name}</div><div class="sub-cycle">💰 ${r.cost} 코인 · 구매 ${r.purchased}회</div></div></div>
      <button class="mini-btn" onclick="buyReward(${r.id})" ${character.coins < r.cost ? 'disabled style="opacity:0.4"' : ''}>🛒 구매</button>
    </div>`).join('')}
  </div>`;
}

// --- 인벤토리 Inventory (redirects to 창의력) ---
function renderInventory() {
  return renderCreativityPower();
}

// --- 기록실 Daily Log ---
function renderDailyLog() {
  const today = todayStr();
  const log = Store.data.dailyLogs.find(l => l.date === today) || { date: today, condition: { physical: 50, mental: 50, note: '' }, schedule: [] };
  const { journal } = Store.data;
  const sorted = [...journal].sort((a,b) => new Date(b.date) - new Date(a.date));

  return `<div class="page">
    <div class="section-header"><h3 class="section-title"><span class="emoji">📊</span> 오늘의 컨디션</h3>
      <button class="section-action" onclick="showConditionModal()">수정</button></div>
    <div class="condition-card">
      <div class="condition-row"><span class="condition-label">🏃 신체</span><div class="stat-bar-track hp"><div class="stat-bar-fill hp" style="width:${log.condition.physical}%"></div></div><span class="stat-value">${log.condition.physical}%</span></div>
      <div class="condition-row"><span class="condition-label">🧠 정신</span><div class="stat-bar-track mp"><div class="stat-bar-fill mp" style="width:${log.condition.mental}%"></div></div><span class="stat-value">${log.condition.mental}%</span></div>
      ${log.condition.note ? `<div class="condition-note">${log.condition.note}</div>` : ''}
    </div>

    <div class="section-header"><h3 class="section-title"><span class="emoji">🌉</span> 브릿지 (일정)</h3>
      <button class="section-action" onclick="showScheduleModal()">수정</button></div>
    <div class="schedule-list">
      ${(log.schedule||[]).map((s,i) => `<div class="schedule-item"><span class="schedule-time">${s.time}</span><span class="schedule-task">${s.task}</span></div>`).join('')}
      ${!(log.schedule||[]).length ? '<div class="empty-state" style="padding:16px"><div class="empty-state-desc">일정을 등록하세요</div></div>' : ''}
    </div>

    <div class="section-header"><h3 class="section-title"><span class="emoji">📝</span> 일기</h3>
      <button class="section-action" onclick="showJournalModal()">+ 추가</button></div>
    ${sorted.slice(0,5).map(j => `<div class="journal-entry" onclick="showJournalModal(${j.id})">
      <div class="journal-date">${j.date}</div><div class="journal-title">${j.title}</div>
      <div class="journal-preview">${j.content}</div>
      ${j.tags?.length?`<div class="journal-tags">${j.tags.map(t=>`<span class="journal-tag">${t}</span>`).join('')}</div>`:''}
    </div>`).join('')}
    ${!journal.length?'<div class="empty-state" style="padding:16px"><div class="empty-state-desc">첫 번째 일기를 작성하세요</div></div>':''}
  </div>`;
}

// --- Tasks Page (shortcut to quests) ---
function renderTasks() {
  return renderActionPower();
}

// --- Journal Page (shortcut to daily log) ---
function renderJournal() {
  return renderDailyLog();
}
