(() => {
  'use strict';
  const BRANDS = {
    samsung: { name: '삼성', en: 'SAMSUNG', base: 1850000, models: [{ id: 'standard', name: '일반 무풍', desc: '일상의 쾌적함을 위한 기본 구성', extra: 0 }, { id: 'premium', name: '비스포크 인피니티', desc: '취향과 공간에 맞춘 프리미엄 구성', extra: 500000 }] },
    lg: { name: 'LG', en: 'LG', base: 2000000, models: [{ id: 'standard', name: '프리미엄', desc: '공간에 자연스럽게 어울리는 기본 구성', extra: 0 }, { id: 'premium', name: 'UV 프리미엄 AI', desc: '추가 기능을 선택하는 프리미엄 구성', extra: 600000 }] }
  };
  const OPTIONS = [
    { id: 'protection', name: '생활공간 보양', desc: '가구와 바닥을 보호하는 기본 보양', price: 80000 },
    { id: 'ceiling', name: '천장 마감 보완', desc: '설치 부위의 마감 작업 예시', price: 300000 },
    { id: 'pump', name: '배수펌프 추가', desc: '현장 배수 조건에 따른 추가 구성', price: 150000 },
    { id: 'removal', name: '기존 에어컨 철거', desc: '기존 기기 1세트 철거 기준', price: 200000 }
  ];
  const DISCOUNTS = { none: { name: '선택 안 함', price: 0 }, schedule: { name: '일정 협의 할인 · 예시', price: 100000 }, interior: { name: '인테리어 동시 시공 · 예시', price: 150000 } };
  const STEPS = ['고객정보', '견적기준', '옵션선택', '할인혜택', '최종확인'];
  const money = n => new Intl.NumberFormat('ko-KR').format(n) + '원';
  const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fresh = brand => ({ brand: BRANDS[brand] ? brand : 'samsung', step: 0, apartment: '', name: '', phone: '', year: 'after', area: '30', units: '4', model: 'standard', pipe: 'multi', options: [], discount: 'none', confirmed: false });
  const calculate = s => {
    const b = BRANDS[s.brand] || BRANDS.samsung;
    const units = Math.min(6, Math.max(2, Number(s.units) || 2));
    const product = b.base + units * 650000;
    const model = (b.models.find(m => m.id === s.model) || b.models[0]).extra;
    const area = Number(s.area) >= 40 ? 150000 : 0;
    const pipe = s.pipe === 'single' ? 300000 : 0;
    const options = OPTIONS.filter(o => Array.isArray(s.options) && s.options.includes(o.id)).map(o => ({ ...o }));
    const optionsTotal = options.reduce((a, o) => a + o.price, 0);
    const discount = (DISCOUNTS[s.discount] || DISCOUNTS.none).price;
    const subtotal = product + model + area + pipe + optionsTotal;
    return { product, model, area, pipe, options, optionsTotal, discount, subtotal, total: Math.max(0, subtotal - discount), units };
  };

  let state = fresh('samsung');
  let previousFocus = null;
  let previousOverflow = '';
  const dialog = document.createElement('dialog');
  dialog.id = 'art-quote-dialog';
  dialog.className = 'aq-dialog';
  dialog.setAttribute('aria-labelledby', 'aq-title');
  dialog.setAttribute('aria-describedby', 'aq-description');
  document.body.append(dialog);

  function summary(result = false) {
    const c = calculate(state);
    const b = BRANDS[state.brand];
    const model = b.models.find(m => m.id === state.model);
    return `<aside class="aq-summary" aria-label="예상 견적 요약"><span class="aq-eyebrow">YOUR ESTIMATE</span><h3>선택한 공간의 견적</h3><div class="aq-summary-product"><span>${b.en}</span><strong>${model.name}</strong><p>${state.area}평대 · 실내기 ${state.units}대 · ${state.pipe === 'multi' ? '다배관' : '단배관'}</p></div><dl class="aq-price-lines"><div><dt>기본 제품 · 설치</dt><dd>${money(c.product)}</dd></div>${c.model ? `<div><dt>프리미엄 구성</dt><dd>+${money(c.model)}</dd></div>` : ''}${c.area ? `<div><dt>40평대 용량 구성</dt><dd>+${money(c.area)}</dd></div>` : ''}${c.pipe ? `<div><dt>단배관 구성</dt><dd>+${money(c.pipe)}</dd></div>` : ''}${c.options.map(o => `<div><dt>${o.name}</dt><dd>+${money(o.price)}</dd></div>`).join('')}${c.discount ? `<div class="aq-discount"><dt>예시 할인</dt><dd>−${money(c.discount)}</dd></div>` : ''}</dl><div class="aq-total"><span>예상 합계 <small>부가세 포함</small></span><strong aria-live="polite">${money(c.total)}</strong></div><p class="aq-fine">데모 체험을 위한 예시 가격입니다. 실제 제품 가격 및 현장 조건에 따라 최종 견적은 달라질 수 있습니다.</p>${state.year === 'before' ? '<p class="aq-site-note">2010년 이전 준공 공간은 천장·배관 상태를 현장에서 확인해야 합니다.</p>' : ''}${result ? '<div class="aq-result-stamp">ART GONGJO<br><span>아트공조 데모 견적서</span></div>' : ''}</aside>`;
  }

  function optionCard(name, value, title, desc, detail, checked, type = 'radio') {
    return `<label class="aq-option${checked ? ' is-selected' : ''}"><input type="${type}" name="${name}" value="${value}" ${checked ? 'checked' : ''}><span class="aq-option-text"><strong>${title}</strong>${desc ? `<span>${desc}</span>` : ''}</span>${detail ? `<b>${detail}</b>` : ''}<span class="aq-choice-mark" aria-hidden="true"></span></label>`;
  }

  function stepBody() {
    const b = BRANDS[state.brand];
    if (state.step === 0) return `<div class="aq-step-heading"><span>01 — YOUR SPACE</span><h3>어떤 공간에 설치하시나요?</h3><p>예시 정보를 넣어 견적 과정을 편하게 체험해보세요.</p></div><button class="aq-example" type="button" data-aq="sample">예시 정보로 채우기 <span aria-hidden="true">↗</span></button><div class="aq-fields"><label class="aq-field aq-full" for="aq-apartment">아파트 / 공간 이름<input id="aq-apartment" name="apartment" value="${escapeHTML(state.apartment)}" placeholder="예: 아트센트럴 아파트" maxlength="60" autocomplete="off" required></label><label class="aq-field" for="aq-name">고객명<input id="aq-name" name="name" value="${escapeHTML(state.name)}" placeholder="예: 홍길동" maxlength="30" autocomplete="off" required></label><label class="aq-field" for="aq-phone">연락처<input id="aq-phone" name="phone" value="${escapeHTML(state.phone)}" placeholder="010-0000-0000" inputmode="tel" autocomplete="off" maxlength="13" required></label></div><fieldset class="aq-fieldset"><legend>준공 기준</legend><div class="aq-option-grid">${optionCard('year', 'after', '2010년 이후', '신축 · 일반 주거공간', '', state.year === 'after')}${optionCard('year', 'before', '2010년 이전', '현장 확인이 필요한 공간', '', state.year === 'before')}</div></fieldset><p class="aq-note">입력 내용은 서버로 전송되지 않습니다. 실제 개인정보 대신 예시 정보를 사용해도 됩니다.</p>`;
    if (state.step === 1) return `<div class="aq-step-heading"><span>02 — YOUR SYSTEM</span><h3>우리 집에 맞는 구성을 골라보세요.</h3><p>공간 크기와 설치 대수에 따라 예상 금액이 달라집니다.</p></div><fieldset class="aq-fieldset"><legend>${b.name} 제품 구성</legend>${b.models.map(m => optionCard('model', m.id, m.name, m.desc, m.extra ? '+' + money(m.extra) : '기본', state.model === m.id)).join('')}</fieldset><div class="aq-fields"><label class="aq-field" for="aq-area">공간 크기<select id="aq-area" name="area">${[['20','20평대'],['30','30평대'],['40','40평대 이상']].map(([v,t]) => `<option value="${v}" ${state.area === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label class="aq-field" for="aq-units">실내기 대수<select id="aq-units" name="units">${[2,3,4,5,6].map(v => `<option value="${v}" ${Number(state.units) === v ? 'selected' : ''}>${v}대${v === 4 ? ' · 거실 + 방 3' : ''}</option>`).join('')}</select></label></div><fieldset class="aq-fieldset"><legend>배관 방식</legend><div class="aq-option-grid">${optionCard('pipe', 'multi', '다배관', '실내기별 배관 연결', '기본', state.pipe === 'multi')}${optionCard('pipe', 'single', '단배관', '배관을 분기하는 구성', '+300,000원', state.pipe === 'single')}</div></fieldset><p class="aq-note">설치 가능 제품·용량·배관 방식은 현장 실측 후 확정됩니다.</p>`;
    if (state.step === 2) return `<div class="aq-step-heading"><span>03 — THE DETAILS</span><h3>필요한 작업을 더해주세요.</h3><p>선택하지 않고 넘어갈 수 있습니다. 작업 범위는 현장 확인 후 조정됩니다.</p></div><fieldset class="aq-fieldset"><legend class="aq-sr-only">추가 작업 선택</legend>${OPTIONS.map(o => optionCard('options', o.id, o.name, o.desc, '+' + money(o.price), state.options.includes(o.id), 'checkbox')).join('')}</fieldset><p class="aq-note">옵션 비용은 모두 데모용 예시이며 부가세를 포함합니다.</p>`;
    if (state.step === 3) return `<div class="aq-step-heading"><span>04 — YOUR BENEFITS</span><h3>시공 계획에 맞는 혜택을 선택하세요.</h3><p>할인 계산을 체험하기 위한 예시입니다. 실제 진행 중인 행사가 아닙니다.</p></div><fieldset class="aq-fieldset"><legend class="aq-sr-only">예시 할인 선택</legend>${Object.entries(DISCOUNTS).map(([id,d]) => optionCard('discount', id, d.name, id === 'schedule' ? '설치 일정을 함께 조율하는 상황의 예시' : id === 'interior' ? '인테리어 공사와 함께 진행하는 상황의 예시' : '기본 조건으로 견적을 확인합니다.', d.price ? '−' + money(d.price) : '', state.discount === id)).join('')}</fieldset><p class="aq-note">혜택은 하나만 적용됩니다. 실제 계약 조건이나 할인 약속을 의미하지 않습니다.</p>`;
    if (state.step === 4) return `<div class="aq-step-heading"><span>05 — READY TO REVIEW</span><h3>선택하신 내용을 확인해주세요.</h3><p>견적서를 열어 전체 내역을 확인하고 PDF로 저장할 수 있습니다.</p></div><dl class="aq-review"><div><dt>공간 이름</dt><dd>${escapeHTML(state.apartment)}</dd></div><div><dt>고객명</dt><dd>${escapeHTML(state.name)}</dd></div><div><dt>연락처</dt><dd>${escapeHTML(state.phone)}</dd></div><div><dt>준공 기준</dt><dd>2010년 ${state.year === 'after' ? '이후' : '이전'}</dd></div><div><dt>제품 구성</dt><dd>${b.name} ${b.models.find(m => m.id === state.model).name}</dd></div><div><dt>설치 구성</dt><dd>${state.area}평대 / ${state.units}대 / ${state.pipe === 'multi' ? '다배관' : '단배관'}</dd></div><div><dt>추가 작업</dt><dd>${OPTIONS.filter(o => state.options.includes(o.id)).map(o => o.name).join(', ') || '선택 안 함'}</dd></div><div><dt>예시 혜택</dt><dd>${DISCOUNTS[state.discount].name}</dd></div></dl><label class="aq-confirm"><input type="checkbox" name="confirmed" ${state.confirmed ? 'checked' : ''}><span>실제 상담 접수가 아닌 <strong>데모 견적</strong>임을 확인했습니다.</span></label>`;
    return `<div class="aq-step-heading"><span>YOUR ESTIMATE IS READY</span><h3>${escapeHTML(state.name)}님의 공간을 위한<br>시스템에어컨 견적입니다.</h3><p>아래 견적은 선택한 구성에 따른 데모 결과입니다.</p></div><dl class="aq-review"><div><dt>고객명</dt><dd>${escapeHTML(state.name)}</dd></div><div><dt>연락처</dt><dd>${escapeHTML(state.phone)}</dd></div><div><dt>설치 공간</dt><dd>${escapeHTML(state.apartment)}</dd></div><div><dt>준공 기준</dt><dd>2010년 ${state.year === 'after' ? '이후' : '이전'}</dd></div><div><dt>작성일</dt><dd>${new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'long' }).format(new Date())}</dd></div></dl><div class="aq-result-note"><strong>공간을 이해하면, 공기가 달라집니다.</strong><p>실제 시공에서는 현장 확인 → 설치 계획 → 최종 견적 확정 순서로 진행합니다.</p></div><p class="aq-note">실제 상담은 접수되지 않았습니다. PDF 저장을 선택하면 인쇄 창에서 ‘PDF로 저장’을 선택할 수 있습니다.</p>`;
  }

  function render(focus = true) {
    const result = state.step === 5;
    dialog.innerHTML = `<div class="aq-shell${result ? ' aq-result' : ''}"><header class="aq-header"><div><span class="aq-wordmark">아트공조 <small>ART GONGJO</small></span><h2 id="aq-title">${result ? '시스템에어컨 데모 견적서' : `${BRANDS[state.brand].name} 시스템에어컨 간편견적`}</h2><p id="aq-description">DEMO EXPERIENCE · 실제 상담 접수 없이 체험할 수 있습니다.</p></div><button type="button" class="aq-close" data-aq="close" aria-label="견적창 닫기">×</button></header>${!result ? `<ol class="aq-steps" aria-label="견적 진행 단계">${STEPS.map((s,i) => `<li${state.step === i ? ' aria-current="step"' : ''} class="${i < state.step ? 'is-done' : i === state.step ? 'is-active' : ''}"><span>${i < state.step ? '✓' : i + 1}</span><b>${s}</b></li>`).join('')}</ol>` : ''}<div class="aq-content"><section class="aq-main" aria-label="${result ? '견적 결과' : STEPS[state.step]}"><div id="aq-step-body">${stepBody()}</div><p class="aq-error" id="aq-error" role="alert" hidden></p><div class="aq-actions">${result ? '<button class="aq-button aq-secondary" type="button" data-aq="edit">구성 수정하기</button><button class="aq-button aq-primary" type="button" data-aq="print">견적서 인쇄 / PDF 저장 <span aria-hidden="true">↗</span></button>' : `<button class="aq-button aq-secondary" type="button" data-aq="${state.step === 0 ? 'close' : 'prev'}">${state.step === 0 ? '닫기' : '이전 단계'}</button><button class="aq-button aq-primary" type="button" data-aq="next">${state.step === 4 ? '데모 견적서 보기' : '다음 단계'} <span aria-hidden="true">→</span></button>`}</div></section><div id="aq-summary-wrap">${summary(result)}</div></div><footer class="aq-footer">아트공조 · 데모용 견적 · 금액은 예시이며 실제 계약 효력이 없습니다.</footer></div>`;
    if (focus && dialog.open) {
      dialog.scrollTop = 0;
      const heading = dialog.querySelector('.aq-step-heading h3');
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }

  function updateChoices() {
    dialog.querySelectorAll('.aq-option').forEach(label => label.classList.toggle('is-selected', label.querySelector('input').checked));
    const wrap = dialog.querySelector('#aq-summary-wrap');
    if (wrap) wrap.innerHTML = summary(state.step === 5);
  }

  function showError(message, name) {
    const error = dialog.querySelector('#aq-error');
    error.textContent = message;
    error.hidden = false;
    if (name) {
      const input = dialog.querySelector(`[name="${name}"]`);
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', 'aq-error');
      input.focus();
    }
  }

  function validate() {
    dialog.querySelectorAll('[aria-invalid]').forEach(el => { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); });
    dialog.querySelector('#aq-error').hidden = true;
    if (state.step === 0) {
      if (state.apartment.trim().length < 2) { showError('아파트 또는 공간 이름을 두 글자 이상 입력해주세요.', 'apartment'); return false; }
      if (state.name.trim().length < 2) { showError('고객명을 두 글자 이상 입력해주세요.', 'name'); return false; }
      if (!/^01[016789]\d{7,8}$/.test(state.phone.replace(/\D/g, ''))) { showError('휴대전화 형식으로 입력해주세요. 예: 010-0000-0000', 'phone'); return false; }
    }
    if (state.step === 4 && !state.confirmed) { showError('데모 견적 안내를 확인하고 체크해주세요.', 'confirmed'); return false; }
    return true;
  }

  function close() { if (dialog.open) dialog.close(); }
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    document.body.classList.remove('aq-printing');
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    const button = event.target.closest('[data-aq]');
    if (!button) return;
    switch (button.dataset.aq) {
      case 'close': close(); break;
      case 'sample': state.apartment = '아트센트럴 아파트'; state.name = '홍길동'; state.phone = '010-0000-0000'; render(); break;
      case 'prev': state.step = Math.max(0, state.step - 1); render(); break;
      case 'edit': state.step = 1; render(); break;
      case 'next': if (validate()) { state.step++; render(); } break;
      case 'print': document.body.classList.add('aq-printing'); window.print(); break;
    }
  });
  dialog.addEventListener('input', event => {
    const el = event.target;
    if (['apartment', 'name', 'phone'].includes(el.name)) state[el.name] = el.value;
  });
  dialog.addEventListener('change', event => {
    const el = event.target;
    if (el.name === 'options') state.options = [...dialog.querySelectorAll('input[name="options"]:checked')].map(o => o.value);
    else if (el.name === 'confirmed') state.confirmed = el.checked;
    else if (['year', 'area', 'units', 'model', 'pipe', 'discount'].includes(el.name)) state[el.name] = el.value;
    updateChoices();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener('afterprint', () => document.body.classList.remove('aq-printing'));
  window.ArtQuote = {
    open(brand = 'samsung') {
      if (dialog.open) return;
      if (state.brand !== brand || state.step === 5) state = fresh(brand);
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      render(false);
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      dialog.scrollTop = 0;
      const first = dialog.querySelector('.aq-step-heading h3');
      first.tabIndex = -1;
      first.focus({ preventScroll: true });
    },
    close,
    calculate,
    options: Object.freeze(OPTIONS.map(option => Object.freeze({ ...option }))),
    reset() { state = fresh(state.brand); if (dialog.open) render(); }
  };
})();
