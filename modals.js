// ========================================
// Life RPG Dashboard — Modals & Actions
// ========================================

// --- Modal System ---
function openModal(title, bodyHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(t._timer); t._timer = setTimeout(() => t.classList.add('hidden'), 2500);
}

// --- Project Modals (전략 프로젝트 - gallery cards) ---
function showProjectModal(id) {
  const existing = id ? Store.data.projects.find(p => p.id === id) : null;
  const covers = ['📂','🎬','💰','🧠','⚔️','🏋️','💡','🎯','🚀','📈'];
  openModal(existing?'프로젝트 수정':'새 전략 프로젝트',`
    <div class="form-group"><label class="form-label">프로젝트명</label><input class="form-input" id="p-title" value="${existing?.title||''}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">커버 아이콘</label><select class="form-select" id="p-cover">${covers.map(c=>`<option${existing?.cover===c?' selected':''}>${c}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">상태</label><select class="form-select" id="p-status"><option value="active"${existing?.status==='active'?' selected':''}>진행중</option><option value="paused"${existing?.status==='paused'?' selected':''}>동결</option><option value="completed"${existing?.status==='completed'?' selected':''}>완료</option></select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">진행률 (%)</label><input class="form-input" id="p-progress" type="number" min="0" max="100" value="${existing?.progress||0}"></div>
      <div class="form-group"><label class="form-label">Stage Size</label><input class="form-input" id="p-stage" type="number" min="0" value="${existing?.stageSize||1}"></div>
    </div>
    <div class="form-group"><label class="form-label">마감일</label><input class="form-input" id="p-deadline" type="date" value="${existing?.deadline||''}"></div>
    <button class="btn btn-primary mt-md" onclick="saveProject(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteProject(${id})">삭제</button>`:''}
  `);
}

function saveProject(id) {
  const title = document.getElementById('p-title').value.trim();
  if (!title) { showToast('⚠️ 프로젝트명을 입력하세요'); return; }
  const entry = { title, cover: document.getElementById('p-cover').value, status: document.getElementById('p-status').value,
    progress: parseInt(document.getElementById('p-progress').value)||0, stageSize: parseInt(document.getElementById('p-stage').value)||1,
    deadline: document.getElementById('p-deadline').value, overdue: false };
  if (id) { Object.assign(Store.data.projects.find(p=>p.id===id), entry); }
  else { entry.id = Store.nextId(); Store.data.projects.push(entry); }
  Store.commit(); closeModal(); renderPage(); showToast('✅ 저장 완료');
}

function deleteProject(id) {
  if (!confirm('프로젝트 삭제?')) return;
  Store.data.projects = Store.data.projects.filter(p=>p.id!==id);
  Store.commit(); closeModal(); renderPage(); showToast('🗑️ 삭제');
}

function startProject(id) { showToast('▶️ 프로젝트 시작'); }
function freezeProject(id) {
  Store.data.projects.find(p=>p.id===id).status = 'paused';
  Store.commit(); renderPage(); showToast('🧊 냉동');
}
function resumeProject(id) {
  Store.data.projects.find(p=>p.id===id).status = 'active';
  Store.commit(); renderPage(); showToast('▶️ 재개');
}

// --- Quest Modals (개별 퀘스트) ---
function showQuestModal(id) {
  const existing = id ? Store.data.quests.find(q => q.id === id) : null;
  const projects = Store.data.projects;
  const types = ['MAIN','SUB','ARROW','DOT'];
  const statuses = ['todo','doing','done','paused'];
  const statusLabels = {todo:'시작 전',doing:'진행 중',done:'완료',paused:'동결'};
  openModal(existing?'퀘스트 수정':'새 퀘스트',`
    <div class="form-group"><label class="form-label">퀘스트명</label><input class="form-input" id="q-title" value="${existing?.title||''}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">유형</label><select class="form-select" id="q-type">${types.map(t=>`<option value="${t}"${existing?.type===t?' selected':''}>${t}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">상태</label><select class="form-select" id="q-status">${statuses.map(s=>`<option value="${s}"${existing?.status===s?' selected':''}>${statusLabels[s]}</option>`).join('')}</select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">연결 프로젝트</label><select class="form-select" id="q-project"><option value="">없음</option>${projects.map(p=>`<option value="${p.id}"${existing?.projectId===p.id?' selected':''}>${p.title}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">마감일</label><input class="form-input" id="q-deadline" type="date" value="${existing?.deadline||''}"></div>
    </div>
    ${existing?`<div class="form-group"><label class="form-label">누적 시간</label><div style="padding:8px;color:var(--text-secondary)">${formatTime(existing.timeSpent||0)}</div></div>`:''}
    <button class="btn btn-primary mt-md" onclick="saveQuest(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteQuest(${id})">삭제</button>`:''}
  `);
}

function saveQuest(id) {
  const title = document.getElementById('q-title').value.trim();
  if (!title) { showToast('⚠️ 퀘스트명 입력'); return; }
  const entry = { title, type: document.getElementById('q-type').value, status: document.getElementById('q-status').value,
    projectId: parseInt(document.getElementById('q-project').value)||null, deadline: document.getElementById('q-deadline').value,
    category: 'action' };
  if (id) { const q = Store.data.quests.find(q=>q.id===id); Object.assign(q, entry); }
  else { entry.id = Store.nextId(); entry.timeSpent = 0; entry.timerRunning = false; entry.timerStart = null; Store.data.quests.push(entry); }
  Store.commit(); closeModal(); renderPage(); showToast('✅ 저장');
}

function deleteQuest(id) {
  if (!confirm('퀘스트 삭제?')) return;
  Store.data.quests = Store.data.quests.filter(q=>q.id!==id);
  Store.commit(); closeModal(); renderPage();
}

// Quest Actions
function startQuest(id) {
  const q = Store.data.quests.find(q=>q.id===id);
  if (q.timerRunning) {
    q.timeSpent += Math.floor((Date.now() - q.timerStart) / 60000);
    q.timerRunning = false; q.timerStart = null; q.status = 'todo';
    RPG.updatePowerScore('action', 1);
    RPG.awardCoins(1);
    showToast('⏸️ 정지 (+1 코인)');
  } else {
    q.timerRunning = true; q.timerStart = Date.now(); q.status = 'doing';
    showToast('▶️ 시작');
  }
  Store.commit(); renderPage();
}

function completeQuest(id) {
  const q = Store.data.quests.find(q=>q.id===id);
  if (q.timerRunning) { q.timeSpent += Math.floor((Date.now()-q.timerStart)/60000); q.timerRunning = false; q.timerStart = null; }
  q.status = 'done';
  RPG.updatePowerScore('action', 5);
  RPG.awardCoins(10);
  Store.commit(); renderPage(); showToast(`✅ 퀘스트 완료! +10 코인`);
}

function freezeQuest(id) {
  Store.data.quests.find(q=>q.id===id).status = 'paused';
  Store.commit(); renderPage(); showToast('❄️ 동결');
}

function resumeQuest(id) {
  Store.data.quests.find(q=>q.id===id).status = 'todo';
  Store.commit(); renderPage(); showToast('▶️ 재개');
}

function filterQuests(f) {
  document.querySelectorAll('.filter-tab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('quest-list').innerHTML = renderQuestList(f);
}

// --- Finance Modals ---
function showFinanceModal(type, id) {
  if (type === 'transfer') { showTransferModal(); return; }
  const existing = id ? Store.data.finances.find(f=>f.id===id) : null;
  const cats = type==='expense' ? ['식비','교통','쇼핑','생활','문화','의료','기타'] : ['급여','부업','투자','용돈','기타'];
  openModal(existing?'거래 수정':(type==='expense'?'새 지출':'새 수입'),`
    <div class="form-group"><label class="form-label">내역</label><input class="form-input" id="f-name" value="${existing?.name||''}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">금액</label><input class="form-input" id="f-amount" type="number" value="${existing?.amount||''}"></div>
      <div class="form-group"><label class="form-label">카테고리</label><select class="form-select" id="f-cat">${cats.map(c=>`<option${existing?.category===c?' selected':''}>${c}</option>`).join('')}</select></div>
    </div>
    <div class="form-group"><label class="form-label">날짜</label><input class="form-input" id="f-date" type="date" value="${existing?.date||todayStr()}"></div>
    <button class="btn btn-primary mt-md" onclick="saveFinance('${type}',${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteFinance(${id})">삭제</button>`:''}
  `);
}

function saveFinance(type, id) {
  const name = document.getElementById('f-name').value.trim();
  const amount = parseInt(document.getElementById('f-amount').value)||0;
  if (!name||!amount) { showToast('⚠️ 내역과 금액을 입력하세요'); return; }
  const entry = { name, amount, type, category: document.getElementById('f-cat').value, date: document.getElementById('f-date').value };
  if (id) { Object.assign(Store.data.finances.find(f=>f.id===id), entry); }
  else { entry.id = Store.nextId(); Store.data.finances.push(entry); }
  RPG.updatePowerScore('finance', 1);
  Store.commit(); closeModal(); renderPage(); showToast('✅ 저장 완료');
}

function deleteFinance(id) {
  if(!confirm('삭제?'))return;
  Store.data.finances=Store.data.finances.filter(f=>f.id!==id);
  Store.commit();closeModal();renderPage();showToast('🗑️ 삭제');
}

function showTransferModal() {
  openModal('은행 이동','<div class="empty-state" style="padding:16px"><div class="empty-state-desc">자산 목록에서 직접 잔액을 수정하세요</div></div>');
}

function showAssetModal(id) {
  const existing = id ? Store.data.assets.find(a=>a.id===id) : null;
  openModal(existing?'자산 수정':'새 자산',`
    <div class="form-group"><label class="form-label">계좌명</label><input class="form-input" id="a-name" value="${existing?.name||''}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">잔액</label><input class="form-input" id="a-balance" type="number" value="${existing?.balance||0}"></div>
      <div class="form-group"><label class="form-label">유형</label><select class="form-select" id="a-type"><option${existing?.type==='bank'?' selected':''}>bank</option><option${existing?.type==='cash'?' selected':''}>cash</option><option${existing?.type==='stock'?' selected':''}>stock</option><option${existing?.type==='crypto'?' selected':''}>crypto</option></select></div>
    </div>
    <button class="btn btn-primary mt-md" onclick="saveAsset(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteAsset(${id})">삭제</button>`:''}
  `);
}

function saveAsset(id) {
  const name = document.getElementById('a-name').value.trim();
  if(!name){showToast('⚠️ 계좌명 입력');return;}
  const entry = { name, balance: parseInt(document.getElementById('a-balance').value)||0, type: document.getElementById('a-type').value };
  if(id){Object.assign(Store.data.assets.find(a=>a.id===id),entry);}
  else{entry.id=Store.nextId();Store.data.assets.push(entry);}
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function deleteAsset(id) { if(!confirm('삭제?'))return; Store.data.assets=Store.data.assets.filter(a=>a.id!==id); Store.commit();closeModal();renderPage(); }

function showDebtModal(id) {
  const existing = id ? Store.data.debts.find(d=>d.id===id) : null;
  openModal(existing?'빚 수정':'새 빚',`
    <div class="form-group"><label class="form-label">명칭</label><input class="form-input" id="d-name" value="${existing?.name||''}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">잔액</label><input class="form-input" id="d-remaining" type="number" value="${existing?.remaining||0}"></div>
      <div class="form-group"><label class="form-label">상환 기한</label><input class="form-input" id="d-due" type="date" value="${existing?.dueDate||''}"></div>
    </div>
    <button class="btn btn-primary mt-md" onclick="saveDebt(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteDebt(${id})">삭제</button>`:''}
  `);
}

function saveDebt(id) {
  const name = document.getElementById('d-name').value.trim();
  if(!name){showToast('⚠️ 명칭 입력');return;}
  const entry = { name, remaining: parseInt(document.getElementById('d-remaining').value)||0, dueDate: document.getElementById('d-due').value };
  if(id){Object.assign(Store.data.debts.find(d=>d.id===id),entry);}
  else{entry.id=Store.nextId();Store.data.debts.push(entry);}
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function deleteDebt(id) { if(!confirm('삭제?'))return; Store.data.debts=Store.data.debts.filter(d=>d.id!==id); Store.commit();closeModal();renderPage(); }

function paySub(id) {
  const s = Store.data.subscriptions.find(s=>s.id===id);
  s.paidThisMonth = true;
  Store.commit(); renderPage(); showToast(`✅ ${s.name} 결제 완료`);
}

function showSubModal() {
  const subs = Store.data.subscriptions;
  openModal('구독 관리',`
    ${subs.map(s=>`<div class="sub-item"><div class="sub-info"><span class="sub-icon">${s.icon}</span><div><div class="sub-name">${s.name}</div><div class="sub-cycle">${s.cycle} · ${formatMoney(s.amount)}</div></div></div>
      <button class="delete-btn" onclick="deleteSub(${s.id})">✕</button></div>`).join('')}
    <div style="margin-top:16px;border-top:1px solid var(--border-color);padding-top:16px">
      <div class="form-group"><label class="form-label">서비스명</label><input class="form-input" id="sub-name"></div>
      <div class="form-row"><div class="form-group"><label class="form-label">금액</label><input class="form-input" id="sub-amount" type="number"></div>
        <div class="form-group"><label class="form-label">주기</label><select class="form-select" id="sub-cycle"><option>월간</option><option>연간</option></select></div></div>
      <button class="btn btn-secondary" onclick="addSub()">+ 추가</button>
    </div>`);
}

function addSub() {
  const name=document.getElementById('sub-name').value.trim();
  const amount=parseInt(document.getElementById('sub-amount').value)||0;
  if(!name||!amount){showToast('⚠️ 입력');return;}
  Store.data.subscriptions.push({id:Store.nextId(),name,amount,cycle:document.getElementById('sub-cycle').value,icon:'📱',paidThisMonth:false});
  Store.commit();closeModal();renderPage();showToast('✅ 추가');
}

function deleteSub(id) { Store.data.subscriptions=Store.data.subscriptions.filter(s=>s.id!==id); Store.commit();showSubModal();renderPage(); }

// --- Habit Modals ---
function showHabitModal(type) {
  openModal(type==='bad'?'나쁜 습관 추가':'좋은 습관 추가',`
    <div class="form-group"><label class="form-label">습관 이름</label><input class="form-input" id="h-name"></div>
    <button class="btn btn-primary mt-md" onclick="saveHabit('${type}')">추가</button>`);
}

function saveHabit(type) {
  const name=document.getElementById('h-name').value.trim();
  if(!name){showToast('⚠️ 이름 입력');return;}
  const list = type==='bad' ? Store.data.badHabits : Store.data.goodHabits;
  list.push({id:Store.nextId(),name,streak:0,history:{}});
  Store.commit();closeModal();renderPage();showToast('✅ 추가');
}

function toggleHabit(id, type) {
  const list = type==='bad' ? Store.data.badHabits : Store.data.goodHabits;
  const h = list.find(h=>h.id===id);
  const today = todayStr();
  if (h.history[today]) { delete h.history[today]; h.streak = Math.max(0, h.streak-1); }
  else { h.history[today] = true; h.streak++;
    if (type==='good') { RPG.updatePowerScore('willpower', 1); RPG.awardCoins(2); }
  }
  RPG.calcMP();
  Store.commit(); renderPage();
}

function deleteHabit(id, type) {
  if(!confirm('삭제?'))return;
  if(type==='bad') Store.data.badHabits=Store.data.badHabits.filter(h=>h.id!==id);
  else Store.data.goodHabits=Store.data.goodHabits.filter(h=>h.id!==id);
  Store.commit();renderPage();showToast('🗑️ 삭제');
}

// --- Book/Lecture Modals ---
function showBookModal(id) {
  const existing = id ? Store.data.books.find(b=>b.id===id) : null;
  openModal(existing?'도서 수정':'새 도서',`
    <div class="form-group"><label class="form-label">제목</label><input class="form-input" id="b-title" value="${existing?.title||''}"></div>
    <div class="form-group"><label class="form-label">저자</label><input class="form-input" id="b-author" value="${existing?.author||''}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">현재 페이지</label><input class="form-input" id="b-cur" type="number" value="${existing?.currentPage||0}"></div>
      <div class="form-group"><label class="form-label">전체 페이지</label><input class="form-input" id="b-total" type="number" value="${existing?.totalPages||200}"></div>
    </div>
    <div class="form-group"><label class="form-label">상태</label><select class="form-select" id="b-status"><option value="reading"${existing?.status==='reading'?' selected':''}>읽는 중</option><option value="completed"${existing?.status==='completed'?' selected':''}>완독</option><option value="dropped"${existing?.status==='dropped'?' selected':''}>중단</option></select></div>
    <button class="btn btn-primary mt-md" onclick="saveBook(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteBook(${id})">삭제</button>`:''}
  `);
}

function saveBook(id) {
  const title=document.getElementById('b-title').value.trim();
  if(!title){showToast('⚠️ 제목 입력');return;}
  const entry = { title, author:document.getElementById('b-author').value.trim(),
    currentPage:parseInt(document.getElementById('b-cur').value)||0,
    totalPages:parseInt(document.getElementById('b-total').value)||200,
    status:document.getElementById('b-status').value };
  if(id){Object.assign(Store.data.books.find(b=>b.id===id),entry);}
  else{entry.id=Store.nextId();Store.data.books.push(entry);}
  if(entry.status==='completed') RPG.updatePowerScore('intel', 10);
  else RPG.updatePowerScore('intel', 1);
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function deleteBook(id){if(!confirm('삭제?'))return;Store.data.books=Store.data.books.filter(b=>b.id!==id);Store.commit();closeModal();renderPage();}

function showLectureModal(id) {
  const existing = id ? Store.data.lectures.find(l=>l.id===id) : null;
  openModal(existing?'강의 수정':'새 강의',`
    <div class="form-group"><label class="form-label">강의명</label><input class="form-input" id="l-title" value="${existing?.title||''}"></div>
    <div class="form-group"><label class="form-label">플랫폼</label><input class="form-input" id="l-platform" value="${existing?.platform||''}" placeholder="유데미, 인프런 등"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">완료 강의 수</label><input class="form-input" id="l-done" type="number" value="${existing?.completedLessons||0}"></div>
      <div class="form-group"><label class="form-label">전체 강의 수</label><input class="form-input" id="l-total" type="number" value="${existing?.totalLessons||30}"></div>
    </div>
    <button class="btn btn-primary mt-md" onclick="saveLecture(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteLecture(${id})">삭제</button>`:''}
  `);
}

function saveLecture(id) {
  const title=document.getElementById('l-title').value.trim();
  if(!title){showToast('⚠️ 강의명 입력');return;}
  const entry = { title, platform:document.getElementById('l-platform').value.trim(),
    completedLessons:parseInt(document.getElementById('l-done').value)||0,
    totalLessons:parseInt(document.getElementById('l-total').value)||30 };
  if(id){Object.assign(Store.data.lectures.find(l=>l.id===id),entry);}
  else{entry.id=Store.nextId();Store.data.lectures.push(entry);}
  RPG.updatePowerScore('intel', 1);
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function deleteLecture(id){if(!confirm('삭제?'))return;Store.data.lectures=Store.data.lectures.filter(l=>l.id!==id);Store.commit();closeModal();renderPage();}

// --- Journal ---
function showJournalModal(id) {
  const existing = id ? Store.data.journal.find(j=>j.id===id) : null;
  openModal(existing?'일기 수정':'새 일기',`
    <div class="form-group"><label class="form-label">제목</label><input class="form-input" id="j-title" value="${existing?.title||''}"></div>
    <div class="form-group"><label class="form-label">날짜</label><input class="form-input" id="j-date" type="date" value="${existing?.date||todayStr()}"></div>
    <div class="form-group"><label class="form-label">내용</label><textarea class="form-textarea" id="j-content">${existing?.content||''}</textarea></div>
    <div class="form-group"><label class="form-label">태그 (쉼표)</label><input class="form-input" id="j-tags" value="${existing?.tags?.join(', ')||''}"></div>
    <button class="btn btn-primary mt-md" onclick="saveJournal(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteJournal(${id})">삭제</button>`:''}
  `);
}

function saveJournal(id) {
  const title=document.getElementById('j-title').value.trim();
  if(!title){showToast('⚠️ 제목 입력');return;}
  const tags=document.getElementById('j-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const entry = { title, content:document.getElementById('j-content').value.trim(), date:document.getElementById('j-date').value, tags };
  if(id){Object.assign(Store.data.journal.find(j=>j.id===id),entry);}
  else{entry.id=Store.nextId();Store.data.journal.push(entry);}
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function deleteJournal(id){if(!confirm('삭제?'))return;Store.data.journal=Store.data.journal.filter(j=>j.id!==id);Store.commit();closeModal();renderPage();}

// --- Daily Condition ---
function showConditionModal() {
  const today = todayStr();
  let log = Store.data.dailyLogs.find(l=>l.date===today);
  if(!log){log={date:today,condition:{physical:50,mental:50,note:''},schedule:[]};Store.data.dailyLogs.push(log);Store.commit();}
  openModal('오늘의 컨디션',`
    <div class="form-group"><label class="form-label">🏃 신체 컨디션 (0-100)</label><input class="form-input" id="cond-phys" type="number" min="0" max="100" value="${log.condition.physical}"></div>
    <div class="form-group"><label class="form-label">🧠 정신 컨디션 (0-100)</label><input class="form-input" id="cond-ment" type="number" min="0" max="100" value="${log.condition.mental}"></div>
    <div class="form-group"><label class="form-label">메모</label><textarea class="form-textarea" id="cond-note">${log.condition.note||''}</textarea></div>
    <button class="btn btn-primary mt-md" onclick="saveCondition()">저장</button>
  `);
}

function saveCondition() {
  const today = todayStr();
  let log = Store.data.dailyLogs.find(l=>l.date===today);
  log.condition.physical = parseInt(document.getElementById('cond-phys').value)||50;
  log.condition.mental = parseInt(document.getElementById('cond-ment').value)||50;
  log.condition.note = document.getElementById('cond-note').value.trim();
  RPG.calcHP();
  Store.commit();closeModal();renderPage();showToast('✅ 컨디션 업데이트');
}

// --- Schedule (Bridge) ---
function showScheduleModal() {
  const today = todayStr();
  let log = Store.data.dailyLogs.find(l=>l.date===today);
  if(!log){log={date:today,condition:{physical:50,mental:50,note:''},schedule:[]};Store.data.dailyLogs.push(log);Store.commit();}
  const schedule = log.schedule||[];
  let html = schedule.map((s,i)=>`<div class="form-row"><div class="form-group"><input class="form-input sched-time" value="${s.time}"></div><div class="form-group"><input class="form-input sched-task" value="${s.task}"></div></div>`).join('');
  html += `<button class="btn btn-secondary mb-sm" onclick="addScheduleRow()">+ 시간대 추가</button>`;
  html += `<div id="new-sched-rows"></div>`;
  html += `<button class="btn btn-primary mt-md" onclick="saveSchedule()">저장</button>`;
  openModal('🌉 브릿지 (일정)', html);
}

function addScheduleRow() {
  document.getElementById('new-sched-rows').insertAdjacentHTML('beforeend',
    `<div class="form-row"><div class="form-group"><input class="form-input sched-time" placeholder="09:00"></div><div class="form-group"><input class="form-input sched-task" placeholder="할 일"></div></div>`);
}

function saveSchedule() {
  const times = document.querySelectorAll('.sched-time');
  const tasks = document.querySelectorAll('.sched-task');
  const schedule = [];
  times.forEach((t,i)=>{if(t.value.trim()&&tasks[i].value.trim()) schedule.push({time:t.value.trim(),task:tasks[i].value.trim()});});
  const today = todayStr();
  let log = Store.data.dailyLogs.find(l=>l.date===today);
  log.schedule = schedule;
  Store.commit();closeModal();renderPage();showToast('✅ 일정 저장');
}

// --- Goal Modal ---
function showGoalModal(id) {
  const existing = id ? Store.data.yearlyGoals.find(g=>g.id===id) : null;
  const categories = ['action','willpower','finance','intel','creativity','physical'];
  const catLabels = {action:'실행력',willpower:'의지력',finance:'재무력',intel:'지능력',creativity:'창의력',physical:'신체'};
  openModal(existing?'목표 수정':'새 연간 목표',`
    <div class="form-group"><label class="form-label">목표명</label><input class="form-input" id="g-title" value="${existing?.title||''}"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">현재값</label><input class="form-input" id="g-current" type="number" value="${existing?.current||0}"></div>
      <div class="form-group"><label class="form-label">목표값</label><input class="form-input" id="g-target" type="number" value="${existing?.target||0}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">단위</label><input class="form-input" id="g-unit" value="${existing?.unit||''}"></div>
      <div class="form-group"><label class="form-label">카테고리</label><select class="form-select" id="g-cat">${categories.map(c=>`<option value="${c}"${existing?.category===c?' selected':''}>${catLabels[c]}</option>`).join('')}</select></div>
    </div>
    <button class="btn btn-primary mt-md" onclick="saveGoal(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteGoal(${id})">삭제</button>`:''}
  `);
}

function saveGoal(id) {
  const title=document.getElementById('g-title').value.trim();
  if(!title){showToast('⚠️ 목표명 입력');return;}
  const entry = { title, current:parseFloat(document.getElementById('g-current').value)||0, target:parseFloat(document.getElementById('g-target').value)||0,
    unit:document.getElementById('g-unit').value.trim(), category:document.getElementById('g-cat').value };
  if(id){Object.assign(Store.data.yearlyGoals.find(g=>g.id===id),entry);}
  else{entry.id=Store.nextId();Store.data.yearlyGoals.push(entry);}
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function deleteGoal(id){if(!confirm('삭제?'))return;Store.data.yearlyGoals=Store.data.yearlyGoals.filter(g=>g.id!==id);Store.commit();closeModal();renderPage();}

// --- Reward Shop ---
function showRewardModal() {
  openModal('보상 추가',`
    <div class="form-group"><label class="form-label">보상명</label><input class="form-input" id="r-name"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">코인 비용</label><input class="form-input" id="r-cost" type="number" value="30"></div>
      <div class="form-group"><label class="form-label">아이콘</label><input class="form-input" id="r-icon" value="🎁"></div>
    </div>
    <button class="btn btn-primary mt-md" onclick="saveReward()">추가</button>`);
}

function saveReward() {
  const name=document.getElementById('r-name').value.trim();
  if(!name){showToast('⚠️ 보상명 입력');return;}
  Store.data.rewards.push({id:Store.nextId(),name,cost:parseInt(document.getElementById('r-cost').value)||30,icon:document.getElementById('r-icon').value||'🎁',purchased:0});
  Store.commit();closeModal();renderPage();showToast('✅ 추가');
}

function buyReward(id) {
  const r = Store.data.rewards.find(r=>r.id===id);
  if(Store.data.character.coins<r.cost){showToast('⚠️ 코인 부족');return;}
  Store.data.character.coins -= r.cost;
  r.purchased++;
  Store.data.rewardLog.push({rewardId:id,name:r.name,date:todayStr()});
  Store.commit();renderPage();showToast(`🎁 ${r.name} 구매!`);
}

// --- Inventory / Ideas ---
function showIdeaModal(id) {
  const existing = id ? Store.data.ideas.find(i=>i.id===id) : null;
  openModal(existing?'아이디어 수정':'새 아이디어',`
    <div class="form-group"><label class="form-label">제목</label><input class="form-input" id="i-title" value="${existing?.title||''}"></div>
    <div class="form-group"><label class="form-label">내용</label><textarea class="form-textarea" id="i-content">${existing?.content||''}</textarea></div>
    <button class="btn btn-primary mt-md" onclick="saveIdea(${id||'null'})">${existing?'수정':'저장'}</button>
    ${existing?`<button class="btn btn-danger mt-md" onclick="deleteIdea(${id})">삭제</button>`:''}
  `);
}

function saveIdea(id) {
  const title=document.getElementById('i-title').value.trim();
  if(!title){showToast('⚠️ 제목 입력');return;}
  const entry = { title, content:document.getElementById('i-content').value.trim(), date:todayStr() };
  if(id){Object.assign(Store.data.ideas.find(i=>i.id===id),entry);}
  else{entry.id=Store.nextId();Store.data.ideas.push(entry);}
  RPG.updatePowerScore('creativity', 1);
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function deleteIdea(id){if(!confirm('삭제?'))return;Store.data.ideas=Store.data.ideas.filter(i=>i.id!==id);Store.commit();closeModal();renderPage();}

// --- Settings ---
function showCharacterEditModal() {
  const c = Store.data.character;
  openModal('캐릭터 수정',`
    <div class="form-group"><label class="form-label">이름</label><input class="form-input" id="c-name" value="${c.name}"></div>
    <div class="form-row"><div class="form-group"><label class="form-label">레벨</label><input class="form-input" id="c-level" type="number" value="${c.level}"></div>
      <div class="form-group"><label class="form-label">집중 셋팅 (시간)</label><input class="form-input" id="c-focus" type="number" value="${c.focusSetting}"></div></div>
    <div class="form-group"><label class="form-label">목표</label><input class="form-input" id="c-dream" value="${c.dreamJob}"></div>
    <button class="btn btn-primary mt-md" onclick="saveCharacter()">저장</button>`);
}

function saveCharacter() {
  const c = Store.data.character;
  c.name=document.getElementById('c-name').value.trim()||c.name;
  c.level=parseInt(document.getElementById('c-level').value)||0;
  c.focusSetting=parseInt(document.getElementById('c-focus').value)||0;
  c.dreamJob=document.getElementById('c-dream').value.trim()||c.dreamJob;
  Store.commit();closeModal();renderPage();showToast('✅ 저장');
}

function showStatEditModal() {
  const ps = Store.data.powerScores;
  const labels = {action:'실행력',willpower:'의지력',finance:'재무력',intel:'지능력',creativity:'창의력',physical:'신체'};
  openModal('스탯 직접 조정',`
    ${Object.keys(labels).map(k=>`<div class="form-group"><label class="form-label">${labels[k]}</label><input class="form-input stat-input" data-key="${k}" type="number" min="0" max="100" value="${ps[k]}"></div>`).join('')}
    <div class="form-group"><label class="form-label">🪙 코인</label><input class="form-input" id="stat-coins" type="number" value="${Store.data.character.coins}"></div>
    <button class="btn btn-primary mt-md" onclick="saveStats()">저장</button>`);
}

function saveStats() {
  document.querySelectorAll('.stat-input').forEach(el => { Store.data.powerScores[el.dataset.key] = parseInt(el.value)||0; });
  Store.data.character.coins = parseInt(document.getElementById('stat-coins').value)||0;
  RPG.calcEXP();
  Store.commit();closeModal();renderPage();showToast('✅ 스탯 업데이트');
}

function showProfileEditModal() {
  const p = Store.data.profile;
  openModal('프로필 수정',`
    <div class="form-row">
      <div class="form-group"><label class="form-label">모드</label><select class="form-select" id="pr-mode"><option${p.mode==='이지모드'?' selected':''}>이지모드</option><option${p.mode==='노말모드'?' selected':''}>노말모드</option><option${p.mode==='하드모드'?' selected':''}>하드모드</option></select></div>
      <div class="form-group"><label class="form-label">성별</label><select class="form-select" id="pr-gender"><option${p.gender==='남자'?' selected':''}>남자</option><option${p.gender==='여자'?' selected':''}>여자</option></select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">키 (cm)</label><input class="form-input" id="pr-height" type="number" value="${p.height}"></div>
      <div class="form-group"><label class="form-label">몸무게 (kg)</label><input class="form-input" id="pr-weight" type="number" value="${p.weight||''}"></div>
    </div>
    <div class="form-group"><label class="form-label">생년월일</label><input class="form-input" id="pr-birth" type="date" value="${p.birthdate}"></div>
    <button class="btn btn-primary mt-md" onclick="saveProfile()">저장</button>`);
}

function saveProfile() {
  const p = Store.data.profile;
  p.mode=document.getElementById('pr-mode').value; p.gender=document.getElementById('pr-gender').value;
  p.height=parseInt(document.getElementById('pr-height').value)||0; p.weight=parseInt(document.getElementById('pr-weight').value)||0;
  p.birthdate=document.getElementById('pr-birth').value;
  p.age = new Date().getFullYear() - new Date(p.birthdate).getFullYear();
  Store.commit();closeModal();renderPage();showToast('✅ 프로필 업데이트');
}

// --- Data Export/Import ---
function exportData() {
  const blob = new Blob([JSON.stringify(Store.data,null,2)],{type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download=`life-rpg-${todayStr()}.json`; a.click(); showToast('📤 내보내기 완료');
}

function importData() {
  const input = document.createElement('input'); input.type='file'; input.accept='.json';
  input.onchange = e => {
    const reader = new FileReader();
    reader.onload = ev => {
      try { Store._cache=JSON.parse(ev.target.result); Store.commit(); renderPage(); showToast('📥 가져오기 완료');
      } catch(err) { showToast('⚠️ JSON 오류'); }
    }; reader.readAsText(e.target.files[0]);
  }; input.click();
}
