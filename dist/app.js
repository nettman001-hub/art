(() => {
  'use strict';
  const $ = (s, scope = document) => scope.querySelector(s);
  const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
  const config = window.ART_CONFIG;
  const money = n => new Intl.NumberFormat('ko-KR').format(n) + '원';
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  $$('[data-company-phone]').forEach(el => el.textContent = config.phone);
  $$('[data-company-address]').forEach(el => el.textContent = config.address);
  const menu = $('.menu-toggle'), nav = $('#main-nav');
  const closeMenu = () => { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', '메뉴 열기'); nav.classList.remove('open'); };
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); nav.classList.toggle('open', open); });
  nav.addEventListener('click', e => { if (e.target.closest('a,button')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  function setTab(value, focus = false) {
    $$('[data-tab]').forEach(el => { const active = el.dataset.tab === value; el.setAttribute('aria-selected', String(active)); el.tabIndex = active ? 0 : -1; if (active && focus) el.focus(); });
    $('#residential-panel').hidden = value !== 'residential'; $('#commercial-panel').hidden = value !== 'commercial';
  }
  $$('[data-tab]').forEach(el => { el.addEventListener('click', () => setTab(el.dataset.tab)); el.addEventListener('keydown', e => { if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) { e.preventDefault(); setTab(e.key === 'Home' ? 'residential' : e.key === 'End' ? 'commercial' : el.dataset.tab === 'residential' ? 'commercial' : 'residential', true); } }); });
  $$('[data-estimate]').forEach(el => el.addEventListener('click', () => setTab(el.dataset.estimate)));

  const dialog = $('#info-dialog'), content = $('#dialog-content');
  let lastFocus = null, savedOverflow = '';
  function openDialog(html) {
    content.innerHTML = html;
    if (!dialog.open) { lastFocus = document.activeElement; savedOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; dialog.showModal(); }
    dialog.scrollTop = 0;
    const heading = $('h2', content); if (heading) { heading.id = 'info-title'; dialog.setAttribute('aria-labelledby', 'info-title'); }
    $('.dialog-close').focus();
  }
  function closeDialog() { dialog.close(); }
  $('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(); } });
  dialog.addEventListener('close', () => { document.body.style.overflow = savedOverflow; if (lastFocus?.isConnected) lastFocus.focus(); });
  function startQuote(brand) {
    if (dialog.open) { dialog.addEventListener('close', () => window.ArtQuote.open(brand), { once:true }); closeDialog(); }
    else window.ArtQuote.open(brand);
  }
  const head = (eyebrow, title) => `<p class="eyebrow">${eyebrow}</p><h2>${title}</h2>`;
  const note = '<p class="dialog-note">이 화면은 데모입니다. 금액과 조건은 예시이며 실제 계약·상담 접수가 이루어지지 않습니다.</p>';
  const views = {
    options: () => head('OPTION GUIDE', '추가 옵션도,<br>미리 확인하세요.') + '<p>기본 설치 외 현장 조건에 따라 선택하는 항목입니다. 아래 금액은 견적 체험용이며 부가세를 포함한 예시입니다.</p><div class="option-table-wrap"><table><thead><tr><th>옵션</th><th>적용 기준</th><th>예시 금액</th></tr></thead><tbody id="option-prices"></tbody></table></div><p>배관 길이, 전기 공사, 천장 마감, 실외기 위치 등 현장별 공사는 별도 확인이 필요합니다. 최종 시공 범위와 비용은 현장 확인 후 정해집니다.</p>' + note + '<button class="button primary" data-modal-quote="samsung">옵션을 넣어 견적 체험 <span>↗</span></button>',
    compare: () => head('BRAND COMPARISON', '어떤 브랜드가<br>우리 공간에 맞을까요?') + '<p>브랜드별 우열보다 제품 구성과 설치 조건을 함께 비교해보세요.</p><table><thead><tr><th>확인할 항목</th><th>삼성</th><th>LG</th></tr></thead><tbody><tr><th>데모 제품 선택</th><td>무풍 일반형 / 프리미엄형</td><td>프리미엄형 / UV 프리미엄형</td></tr><tr><th>설치 구성</th><td colspan="2">거실과 방의 수, 면적에 맞춰 선택</td></tr><tr><th>배관 방식</th><td colspan="2">건물 조건과 제품 호환성을 함께 확인</td></tr><tr><th>비교할 기준</th><td colspan="2">실내기 크기, 모델별 기능, 전원·배관 조건, 견적 포함 항목</td></tr></tbody></table><p>실제 기능·효율·호환성은 선택 모델의 제조사 사양과 현장 확인을 기준으로 합니다.</p>' + note + '<div class="assistant-options"><button data-modal-quote="samsung">삼성 견적 체험 <span>↗</span></button><button data-modal-quote="lg">LG 견적 체험 <span>↗</span></button></div>',
    privacy: () => head('DEMO & PRIVACY', '데모 개인정보 안내') + '<p>이 사이트는 아트공조의 디자인과 견적 흐름을 체험하는 데모입니다. 고객명, 연락처, 아파트명 등 폼에 입력한 내용은 서버에 전송하거나 브라우저에 영구 저장하지 않습니다.</p><h3>입력 내용의 사용</h3><p>입력한 정보는 현재 열린 페이지의 견적서와 상담 접수 예시 화면을 구성하는 데에만 사용됩니다. 새로고침하면 초기화됩니다.</p><h3>예시 정보 안내</h3><p>업체 연락처, 주소, 가격, 사례 및 상담 현황은 모두 예시입니다. 공간 사진은 AI 생성 이미지이며 실제 시공 실적을 나타내지 않습니다. 외부 상담 채널 연결은 제공하지 않습니다.</p><h3>외부 리소스</h3><p>한글 서체는 요청하신 Pretendard CDN에서 불러옵니다. 사이트 자체의 분석 추적기는 사용하지 않습니다.</p>',
    assistant: () => head('YOUR QUOTE GUIDE', '어떤 공간을<br>계획하고 계신가요?') + '<p>두 가지 선택으로 견적의 시작점을 찾아드립니다.</p><div class="assistant-options"><button data-guide="home">우리 집 · 주거공간 <span>→</span></button><button data-guide="business">매장·사무실 · 상업공간 <span>→</span></button></div><p class="dialog-note">미리 정해진 선택형 데모입니다. 실제 AI 상담에 연결되지 않습니다.</p>',
    contact: () => head('LET’S TALK ABOUT YOUR SPACE', '편한 방법으로,<br>상담을 시작하세요.') + `<p>주거공간은 제품과 설치 조건을 선택해 견적을 체험하고, 상업공간은 공간 정보를 정리해보세요.</p><div class="assistant-options"><button data-modal-quote="samsung">주거공간 간편견적 <span>↗</span></button><button data-guide="business">상업공간 상담 체험 <span>↗</span></button></div><h3>${escape(config.phone)}</h3><p>평일 09:00 – 18:00 · 데모용 연락처</p><p class="dialog-note">실제 전화·메시지 전송은 지원하지 않습니다.</p>`
  };
  function showView(key) {
    if (!views[key]) return;
    openDialog(views[key]());
    if (key === 'options') renderOptionPrices();
  }
  function renderOptionPrices() {
    const options = window.ArtQuote?.options || [];
    const rows = options.length ? options.map(o => [o.label || o.name, o.perUnit ? '실내기 1대당' : '전체 시공 기준', o.price]) : [
      ['보양 작업','전체 시공 기준',150000], ['천장 마감','전체 시공 기준',250000], ['배관 연장','전체 시공 기준',200000]
    ];
    $('#option-prices').innerHTML = rows.map(([label, unit, price]) => `<tr><th>${escape(label)}</th><td>${escape(unit)}</td><td>${money(price)}</td></tr>`).join('');
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('button,a'); if (!el) return;
    if (el.dataset.quote) startQuote(el.dataset.quote);
    if (el.dataset.modalQuote) startQuote(el.dataset.modalQuote);
    if (el.dataset.dialog) showView(el.dataset.dialog);
    if (el.hasAttribute('data-contact')) showView('contact');
    if (el.dataset.channel) openDialog(head('OFFICIAL CHANNEL · DEMO', escape(el.dataset.channel) + ' 채널 안내') + '<p>정식 운영 시 아트공조의 공식 채널을 연결할 자리입니다. 지금은 채널 연결 전 데모 화면을 보여드립니다.</p><button class="button primary" data-guide="business">상담 흐름 체험하기 <span>↗</span></button>');
    if (el.dataset.guide === 'home') openDialog(head('YOUR QUOTE GUIDE', '선호하는 제조사가<br>있으신가요?') + '<p>선택 후 고객정보부터 5단계로 견적을 구성합니다. 견적 창의 ‘예시 입력’으로 빠르게 체험할 수도 있습니다.</p><div class="assistant-options"><button data-modal-quote="samsung">삼성 시스템에어컨 <span>→</span></button><button data-modal-quote="lg">LG 시스템에어컨 <span>→</span></button></div>');
    if (el.dataset.guide === 'business') { closeDialog(); setTab('commercial'); $('#estimate').scrollIntoView({behavior:'smooth'}); }
  });

  function searchApartments(value) {
    const query = value.trim().toLowerCase().replace(/\s/g, '');
    const holder = $('#search-results');
    if (!query) { holder.innerHTML = '<p class="search-empty">아파트 이름 또는 지역을 입력해주세요.</p>'; $('#apartment-query').focus(); return; }
    const matches = config.apartments.filter(item => (item.name + item.region).toLowerCase().replace(/\s/g, '').includes(query));
    holder.innerHTML = matches.length ? `<div class="search-results-list">${matches.map((a) => `<button class="search-result" data-apartment="${config.apartments.indexOf(a)}"><span><strong>${escape(a.name)} <small>가상 사례</small></strong><small>${escape(a.region)} · ${a.area} · ${a.brand} ${a.units}대</small></span><span class="price">${money(a.price)} ↗</span></button>`).join('')}</div>` : '<p class="search-empty">일치하는 데모 사례가 없습니다. ‘아트’ 또는 ‘서울’로 예시를 확인해보세요.</p>';
  }
  $('#apartment-form').addEventListener('submit', e => { e.preventDefault(); searchApartments($('#apartment-query').value); });
  $$('[data-search]').forEach(el => el.addEventListener('click', () => { $('#apartment-query').value = el.dataset.search; searchApartments(el.dataset.search); }));
  $('#search-results').addEventListener('click', e => {
    const el = e.target.closest('[data-apartment]'); if (!el) return;
    const a = config.apartments[Number(el.dataset.apartment)];
    openDialog(head('APARTMENT EXAMPLE', escape(a.name)) + '<p>아파트 시공 검색 기능을 보여주는 가상 사례입니다.</p><div class="detail-grid">' + [[a.region,'지역 예시'],[a.area,'주거 면적'],[`${a.brand} ${a.units}대`,'실내기 구성'],[money(a.price),'사례 금액 · 예시']].map(([v,k]) => `<div><span>${k}</span><strong>${escape(v)}</strong></div>`).join('') + '</div><p>이 사례의 금액은 과거 계약이나 현재 판매가를 의미하지 않습니다. 아래에서 별도의 데모 요금표로 견적을 구성할 수 있습니다.</p><button class="button primary" data-modal-quote="' + (a.brand === 'LG' ? 'lg' : 'samsung') + '">우리 집 견적 체험 <span>↗</span></button>');
  });
  $$('[data-filter]').forEach(el => el.addEventListener('click', () => { $$('[data-filter]').forEach(b => { b.classList.toggle('active', b === el); b.setAttribute('aria-pressed', String(b === el)); }); $$('[data-category]').forEach(card => card.hidden = el.dataset.filter !== 'all' && card.dataset.category !== el.dataset.filter); }));
  const projects = {
    living: { title:'일상의 여백을 지켜주는 거실',image:'hero-interior.png',category:'주거공간',area:'34평',units:'거실 + 방 3개',text:'천장과 가구의 선을 살리면서 공간별 냉방을 계획한 아파트 구성 예시입니다. 실내기 위치, 배관 경로, 천장 마감 범위를 확인하는 흐름을 보여줍니다.' },
    bedroom: { title:'하루의 끝, 조용하고 쾌적하게',image:'case-residential.png',category:'주거공간',area:'25평',units:'거실 + 방 2개',text:'생활 공간과 휴식 공간의 사용 시간을 고려한 설치 구성 예시입니다. 바람 방향과 침대·가구 배치를 함께 살펴보는 상담을 제안합니다.' },
    cafe: { title:'오래 머물고 싶은 공간의 조건',image:'case-cafe.png',category:'상업공간',area:'40평',units:'천장형 냉난방',text:'창가의 일사량, 주방의 열원, 이용 인원을 함께 고려하는 카페 설계 예시입니다. 실제 용량과 배치는 현장 조사 및 설비 검토 후 결정합니다.' }
  };
  $$('[data-project]').forEach(el => el.addEventListener('click', () => {
    const p = projects[el.dataset.project];
    openDialog(`<img class="detail-image" src="assets/${p.image}" alt="AI 생성 ${p.category} 공간 연출">` + head('SPACE CONCEPT · DEMO',p.title) + '<p>' + p.text + '</p><div class="detail-grid">' + [[p.category,'공간'],[p.area,'면적 예시'],[p.units,'설치 구성 예시'],['AI 공간 연출','이미지 안내']].map(([v,k]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('') + '</div><p class="dialog-note">실제 시공 완료 사례가 아닌 데모용 공간 및 구성입니다.</p>' + (el.dataset.project === 'cafe' ? '<button class="button primary" data-guide="business">상업공간 상담 체험 <span>↗</span></button>' : '<button class="button primary" data-modal-quote="samsung">이런 공간 견적 알아보기 <span>↗</span></button>'));
  }));
  const articles = {
    pipe:{ title:'다배관과 단배관,<br>무엇부터 확인할까요?', body:'<h3>먼저 건물의 조건을 확인하세요</h3><p>배관 방식은 건물의 기존 설비와 설치 경로, 제품 구성에 따라 검토합니다. 아파트 준공년도만으로 설치 가능 여부가 확정되지는 않습니다.</p><h3>견적에서 함께 확인할 것</h3><p>적용 제품, 배관 공사 범위, 천장 철거·복구, 실외기 설치 위치를 같은 기준으로 비교하세요. 상세한 적용 가능 여부는 전문 시공사의 현장 확인이 필요합니다.</p>' },
    occupied:{ title:'거주 중 시공이라면,<br>준비해야 할 것들.',body:'<h3>공사 구간과 생활 동선을 나눠주세요</h3><p>작업 구간의 가구와 소품 이동, 보양 범위를 사전에 정리합니다. 소음과 분진이 발생할 수 있는 시간도 미리 확인하세요.</p><h3>관리사무소와 일정을 확인하세요</h3><p>공사 가능 시간, 공용 공간 이용, 작업자 출입과 자재 이동 방법을 확인하면 현장 진행이 한결 수월해집니다.</p><h3>마감 범위는 계약 전에</h3><p>천장 개구부 복구와 도배 등 마감 공사가 견적에 포함되어 있는지 구분해두세요.</p>' },
    estimate:{ title:'시스템에어컨 견적,<br>이 항목을 살펴보세요.',body:'<h3>총액과 함께 구성을 보세요</h3><p>실내기와 실외기의 모델·대수, 기본 배관 범위, 설치비, 부가세 포함 여부를 확인하세요.</p><h3>추가 비용이 생기는 조건</h3><p>배관 연장, 전기 공사, 천장 마감, 보양, 별도 장비가 필요한 작업은 현장에 따라 달라질 수 있습니다. 어떤 조건에서 추가되는지 미리 설명받는 것이 좋습니다.</p><h3>최종 견적은 현장 확인 후</h3><p>이 사이트의 계산 결과는 기능 체험용 예시입니다. 실제 공사 범위와 가격은 현장 검토를 거쳐 확정해야 합니다.</p>' }
  };
  $$('[data-article]').forEach(el => el.addEventListener('click', () => { const a=articles[el.dataset.article]; openDialog(head('AIR JOURNAL · DEMO',a.title) + a.body); }));
  $('#commercial-form').addEventListener('submit', e => {
    e.preventDefault(); const form=e.currentTarget; if (!form.reportValidity()) return;
    const data = new FormData(form); const phone=String(data.get('phone')).trim();
    if (!/^0[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}$/.test(phone)) { const field=form.elements.phone; field.setCustomValidity('연락처 형식을 확인해주세요. 예: 010-0000-0000'); field.reportValidity(); field.addEventListener('input',()=>field.setCustomValidity(''),{once:true}); return; }
    const types=data.getAll('type');
    if (!types.length) { form.elements.type[0].focus(); toast('희망 에어컨 종류를 한 가지 이상 선택해주세요.'); return; }
    openDialog(head('CONSULTATION PREVIEW', '상담 접수 흐름을<br>체험하셨습니다.') + `<p><strong>${escape(data.get('name'))}</strong>님의 공간 정보를 다음과 같이 정리했습니다.</p><div class="detail-grid">${[[data.get('region'),'지역'],[data.get('business'),'업종'],[types.join(' · '),'에어컨 종류'],[data.get('phone'),'입력한 연락처']].map(([v,k])=>`<div><span>${k}</span><strong>${escape(v)}</strong></div>`).join('')}</div><p class="dialog-note">실제 상담은 접수되지 않았습니다. 정보는 서버로 전송하거나 저장하지 않습니다.</p><button class="button primary" data-finish>확인했습니다 <span>✓</span></button>`);
    form.reset();
  });
  dialog.addEventListener('click',e=>{if(e.target.closest('[data-finish]'))closeDialog();});
  let toastTimer; function toast(message) { const el=$('.toast'); el.textContent=message; el.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.hidden=true,4200); }
})();
