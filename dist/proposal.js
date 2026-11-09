(() => {
  'use strict';

  const photos = [
    { file: '01', title: '공사 전 거실', phase: '시공 전' },
    { file: '02', title: '바닥 보양', phase: '작업 중' },
    { file: '03', title: '천장 배관·단열', phase: '작업 중' },
    { file: '04', title: '실내기 설치', phase: '작업 중' },
    { file: '05', title: '실외기 설치', phase: '작업 중' },
    { file: '06', title: '설치 후 거실', phase: '완료' }
  ];
  const sources = ['홈페이지', '숨고', '크몽'];
  const customerNames = { '홈페이지': '김○○', '숨고': '박○○', '크몽': '이○○' };
  const workflow = ['신규 접수', '연락 완료', '방문 예정', '계약 완료'];
  const leadActions = ['첫 연락 완료 처리', '현장 방문 일정 잡기', '계약 완료 처리'];
  const scenarios = {
    '입주 전 설치': {
      message: '입주 전에 새로 설치하고 싶어요. 비용과 설치 일정을 알려주세요.',
      reason: '입주 전 신규 설치 문의입니다. 기본 설치 단가를 적용하고 방문 일정을 먼저 확인합니다.',
      options: [], team: '신규 설치 상담팀', question: '입주 예정일과 실외기 설치 위치를 알려주시겠어요?',
      firstTask: '입주일과 실외기 위치 확인', visitTask: '입주 전에 가능한 방문 시간 제안'
    },
    '거주 중 교체': {
      message: '지금 살고 있는 집입니다. 기존 에어컨 한 세트를 철거하고 가구를 보양한 뒤 교체하고 싶어요.',
      reason: '거주 중 교체 요청에서 철거 한 세트와 가구 보양을 찾아 예시 단가표의 두 옵션을 더했습니다.',
      options: ['removal', 'protection'], team: '교체 설치 상담팀', question: '기존 기기 사진과 작업 가능한 시간대를 보내주시겠어요?',
      firstTask: '철거할 기기 사진과 작업 시간 확인', visitTask: '철거·보양 범위를 확인할 방문 일정 제안'
    },
    '낮은 천장 설치': {
      message: '천장이 낮은 집인데 시스템에어컨을 설치할 수 있을까요? 높이는 정확히 모르겠어요.',
      reason: '천장 안쪽 공간이 확인되지 않았습니다. 추가 공사비를 확정하기 전에 현장 확인이 필요합니다.',
      options: [], team: '현장 기술팀', question: '천장 점검구 사진이 있으신가요? 높이를 확인할 수 있는 방문 시간을 알려주세요.',
      firstTask: '천장 점검구 사진 요청 · 현장 기술팀 배정', visitTask: '기술팀 현장 실측 일정 제안'
    }
  };
  const stageTitles = ['카카오톡에 현장 사진이 도착했습니다.', 'AI가 공정별로 정리한 현장 앨범', 'AI 소재 추천과 채널별 발행', '고객 요청에 맞춘 견적과 후속 연락'];
  const nextLabels = ['현장 앨범 만들기 →', '홍보 콘텐츠 만들기 →', '문의·견적 관리 보기 →', '첫 도입 업무 고르기 ↓'];
  const priorities = {
    '홍보물 제작': ['홍보용 사진, 고객 질문, 기존 채널 게시물과 발행 주기', 'AI 추천 소재를 선택해 쇼츠·틱톡·인스타그램·블로그 콘텐츠를 제작하고 승인 후 일정에 맞춰 게시', '소재 선정부터 게시 승인까지 걸린 시간'],
    '반복 견적': ['제조사·대수별 단가표, 영업 지역, 자주 묻는 질문', '표준 조건의 예상 견적과 추가 질문, 채널별 발송 기준', '표준 견적 한 건의 작성 시간'],
    '후속 연락': ['기존 문의 양식, 담당자 배정 기준, 연락 가능 시간', '홈페이지 접수 안내, 담당자 알림, 오늘 연락할 고객 목록', '미응답 문의 수와 첫 연락까지 걸린 시간'],
    '사진 정리': ['작업팀 명단, 현장 식별 기준, 공정별 사진 예시', '카카오톡 사진 수신, 현장 앨범, 원본과 홍보용 사본 보관', '원하는 현장 사진을 찾는 시간']
  };
  const stage = document.getElementById('stage');
  const notice = document.getElementById('notice');
  const photoDialog = document.getElementById('photo-dialog');

  function initialState() {
    return {
      step: 0, album: '원본 앨범', filter: '전체', logo: true, enhanced: true,
      photoResolution: '검토 필요', campaign: window.ProposalCampaign.create(), source: '홈페이지',
      leads: Object.fromEntries(sources.map(source => [source, { status: -1, units: 4, scenario: '입주 전 설치' }]))
    };
  }
  let state = initialState();

  function photoURL(photo) {
    return 'assets/proposal/' + photo.file + '.webp';
  }

  function phaseOf(photo) {
    if (photo.file === '03' && state.photoResolution === '검토 필요') return '검토 필요';
    return photo.phase;
  }

  function aiResult(title, message, control = '') {
    return '<aside class="p-ai-result"><h4>' + title + '</h4><p>' + message + '</p>' + control + '</aside>';
  }

  function detailList(rows, className = 'p-record') {
    return '<dl class="' + className + '">' + rows.map(([label, value]) =>
      '<div><dt>' + label + '</dt><dd>' + value + '</dd></div>'
    ).join('') + '</dl>';
  }

  function tabs(items, current, action, label) {
    return '<div class="p-tabs" role="group" aria-label="' + label + '">' + items.map(item =>
      '<button type="button" data-action="' + action + '" data-value="' + item + '" aria-pressed="' + (item === current) + '">' + item + '</button>'
    ).join('') + '</div>';
  }

  function action(label, name, value = '', style = 'p-secondary') {
    return '<button class="p-button ' + style + '" type="button" data-action="' + name + '" data-value="' + value + '">' + label + '</button>';
  }

  function grid(shownPhotos, thumbnails = false) {
    return '<div class="p-photo-grid' + (thumbnails ? ' p-thumbnails' : '') + '">' + shownPhotos.map(photo =>
      '<figure><button type="button" data-action="photo" data-value="' + photo.file + '" aria-label="' + photo.title +
      ' 원본 확대"><img src="' + photoURL(photo) + '" alt="' + photo.title + ' 연출 이미지"></button><figcaption>' +
      photo.title + (phaseOf(photo) === '검토 필요' ? ' · 검토 필요' : '') + '</figcaption></figure>'
    ).join('') + '</div>';
  }

  function inbox() {
    const needsReview = state.photoResolution === '검토 필요';
    const teamNote = state.photoResolution === '팀 메모로 분류'
      ? '<div class="p-message"><small>설치 1팀 · 오후 4:34</small><p>세 번째 사진은 천장을 닫기 전 배관 단열 작업 중에 찍었습니다.</p></div>' : '';
    return {
      description: '카카오톡에 사진이나 작업 메모가 도착하면 AI가 현장·작업팀 정보를 대조하고 공정을 판독합니다. 근거가 부족한 사진은 검토 목록에 올립니다.',
      labels: [['현장', '서울 · 34평 아파트'], ['작업팀', '설치 1팀'], ['작업 내용', '거실 및 방 3곳 시스템에어컨 설치']],
      screen: '<div class="p-screen-head"><strong>시공사진 접수 채널</strong><span>카카오톡 수신 예시</span></div>' +
        '<div class="p-message"><small>설치 1팀 · 오후 4:32</small><p>오늘 작업 마쳤습니다. 시공 전·후와 배관 사진 보냅니다.</p></div>' +
        grid(photos, true) + teamNote + aiResult('사진 수신 후 AI 판독 예시',
          needsReview ? '6장을 같은 현장에 묶었습니다. 5장은 공정을 분류했고, 3번 배관 사진은 공사 중인지 완료 점검인지 확인할 메모가 필요합니다.'
            : '작업 중으로 확인된 배관 사진까지 현장별·공정별로 6장 모두 정리했습니다.',
          needsReview ? action('작업팀의 추가 메모 받기', 'receive-note') : '')
    };
  }

  function album() {
    const modes = ['원본 앨범', '전후 비교', '홍보용 편집'];
    let content;
    if (state.album === '원본 앨범') {
      const visible = photos.filter(photo => state.filter === '전체' || phaseOf(photo) === state.filter);
      content = tabs(['전체', '시공 전', '작업 중', '완료', '검토 필요'], state.filter, 'filter', '사진 공정 필터') +
        grid(visible) + '<p class="p-status">원본 6장 보관 · 선택한 공정 ' + visible.length + '장</p>';
      if (state.photoResolution === '검토 필요' && ['전체', '검토 필요'].includes(state.filter)) {
        content += aiResult('AI가 판단을 보류한 사진 1장', '3번 사진에는 천장 배관이 보입니다. 담당자가 촬영 시점을 확인하면 보관할 공정을 확정합니다.',
          action('3번을 작업 중으로 확정', 'confirm-phase'));
      }
    } else if (state.album === '전후 비교') {
      content = '<div class="p-comparison">' + [photos[0], photos[5]].map(photo =>
        '<figure><img src="' + photoURL(photo) + '" alt="' + photo.title + '"><figcaption>' + photo.title + '</figcaption></figure>'
      ).join('') + '</div><p class="p-status">동일 현장의 시공 전·완료 사진을 한 쌍으로 묶습니다.</p>';
    } else {
      content = '<figure class="p-edited' + (state.enhanced ? ' is-enhanced' : '') + '"><img src="' + photoURL(photos[5]) + '" alt="홍보용 정사각형 시공 완료 이미지">' +
        (state.logo ? '<span class="p-watermark">거니공조</span>' : '') + '</figure><div class="p-tabs" role="group" aria-label="편집 설정">' +
        '<button type="button" data-action="logo" aria-pressed="' + state.logo + '">로고 삽입</button>' +
        '<button type="button" data-action="enhance" aria-pressed="' + state.enhanced + '">밝기 보정</button></div>' +
        '<p class="p-status">정사각형 홍보용 사본 · 원본은 현장 기록에 보관합니다.</p>';
    }
    return {
      description: 'AI가 시공 전후 사진을 짝짓고 홍보용 사본의 화면 비율과 밝기를 맞춥니다. 새 작업 메모나 담당자 확인이 들어오면 앨범 분류도 갱신합니다.',
      labels: [['AI 분류', state.photoResolution === '검토 필요' ? '공정 분류 5장 · 확인 대기 1장' : '공정 분류 6장 · ' + state.photoResolution], ['원본 활용', '고객 상담 · A/S 이력'], ['편집본 활용', '홈페이지 사례 · 홍보 게시물']],
      screen: '<div class="p-screen-head"><strong>서울 34평 아파트</strong><span>현장 앨범</span></div>' +
        tabs(modes, state.album, 'album', '앨범 보기 방식') + content
    };
  }

  function inquiry() {
    const source = state.source;
    const lead = state.leads[source];
    const request = scenarios[lead.scenario];
    const amount = window.ArtQuote.calculate({ brand: 'samsung', units: lead.units, area: 34, model: 'standard', pipe: 'multi', options: request.options }).total;
    const cost = amount.toLocaleString('ko-KR') + '원';
    const sourceDetails = {
      '홈페이지': '고객이 문의를 남기면 AI가 설치 목적과 추가 조건을 읽고 답변을 작성합니다. 상담 진행 상황이 바뀔 때마다 다음 업무도 갱신합니다.',
      '숨고': 'AI가 새 요청에서 설치 조건을 읽어 예상 금액과 추가 질문을 작성합니다. 스마트견적의 서비스·지역·일일 예산 조건에 맞춰 발송합니다.',
      '크몽': 'AI가 들어온 질문의 의도를 읽어 반복 문의에는 안내를, 개별 설치 문의에는 예상 금액과 현장 확인 질문을 준비합니다. 건별 발송은 시범 계정에서 검증합니다.'
    };
    const requiresInspection = lead.scenario === '낮은 천장 설치';
    const startLabel = source === '홈페이지' ? '예시 문의 접수' : requiresInspection ? '현장 확인 질문 발송 시연' : '견적 자동 발송 시연';
    const statusLabel = lead.status === -1 ? (source === '홈페이지' ? '고객 입력 화면' : '새 견적 요청') : workflow[lead.status];
    const inputs = lead.status === -1
      ? '<div class="p-request-inputs"><label class="p-units">예시 문의 <select id="request-scenario">' + Object.keys(scenarios).map(name =>
        '<option' + (lead.scenario === name ? ' selected' : '') + '>' + name + '</option>').join('') +
        '</select></label><label class="p-units">실내기 수량 <select id="quote-units">' + [2, 3, 4, 5, 6].map(units =>
        '<option value="' + units + '"' + (lead.units === units ? ' selected' : '') + '>' + units + '대</option>').join('') + '</select></label></div>' : '';
    const customer = inputs + '<div class="p-estimate"><div><small>서울 · 34평 · 삼성 일반형 · ' + lead.units + '대</small><strong>' +
      (requiresInspection ? '실측 전 참고 금액 ' : '예상 견적 ') + cost + '</strong></div></div>';
    const pendingSources = sources.filter(channel => state.leads[channel].status === 0);
    const followups = '<aside class="p-followups" aria-label="오늘 연락할 고객"><h4>오늘 연락할 고객 <span>' + pendingSources.length + '건</span></h4>' +
      (pendingSources.length ? '<ul>' + pendingSources.map(channel => '<li>' + action(channel + ' · ' + customerNames[channel] + ' 상담 열기', 'source', channel) +
        '</li>').join('') + '</ul>' : '<p>첫 연락을 기다리는 고객이 없습니다.</p>') + '</aside>';
    let record;
    if (lead.status < 0) {
      record = '<div class="p-message"><small>' + customerNames[source] + ' 고객 · 가상 문의</small><p>' + request.message + '</p></div>' +
        aiResult('문의 내용에 따른 AI 판단', request.reason + ' 담당 팀은 ' + request.team + '입니다.') + action(startLabel, 'lead', '', 'p-primary');
    } else {
      const intro = source === '홈페이지' ? '문의가 접수되었습니다. ' : '거니공조입니다. ';
      const quoteMessage = requiresInspection ? '설치 가능 여부는 천장 안쪽 공간을 확인한 뒤 안내드리겠습니다. ' :
        '요청하신 ' + lead.scenario + ' ' + lead.units + '대 구성의 예상 금액은 ' + cost + '입니다. ';
      const nextTask = ['오늘 첫 연락 · ' + request.firstTask, request.visitTask, '예시 일정 · 금요일 14:00 현장 방문', '확인된 설치 조건을 시공팀에 전달'];
      record = '<div class="p-message"><small>고객에게 보낸 AI 답변 · 시연</small><p>' + intro + quoteMessage + request.question + '</p></div>' +
        detailList([['고객', customerNames[source] + ' · 가상 고객'], ['유입 경로', source === '홈페이지' ? '블로그 시공사례 → 홈페이지' : source + ' 견적 요청'], ['담당자', request.team], ['상담 상태', workflow[lead.status]], ['AI가 정리한 다음 업무', nextTask[lead.status]]]) +
        (lead.status < 3 ? action(leadActions[lead.status], 'lead', '', 'p-primary') : '<p class="p-status">계약 이력이 상담 카드에 기록되었습니다.</p>');
    }
    return {
      description: sourceDetails[source],
      labels: [['견적 기준', '기존 홈페이지의 예시 단가표'], ['현장 확인', '추가 배관 · 천장 마감 · 방문 가능일']],
      screen: '<div class="p-screen-head"><strong>상담 관리</strong><span>' + statusLabel + '</span></div>' +
        tabs(sources, source, 'source', '문의 채널') + customer + record + followups
    };
  }

  function render() {
    const data = [inbox, album, () => state.campaign.view(), inquiry][state.step]();
    stage.innerHTML = '<div class="p-stage-grid"><div class="p-stage-copy"><p class="p-eyebrow">' +
      ['작업팀', '현장 관리자', '홍보 담당자', '상담 담당자'][state.step] + '</p><h3 tabindex="-1">' +
      stageTitles[state.step] + '</h3><p>' + data.description + '</p>' + detailList(data.labels) +
      '</div><div class="p-screen">' + data.screen + '</div></div>';
    document.querySelectorAll('[data-step]').forEach((button, index) => {
      if (index === state.step) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    document.getElementById('previous').disabled = state.step === 0;
    document.getElementById('next').textContent = nextLabels[state.step];
  }

  function switchStep(step, focus = true) {
    state.step = step;
    render();
    if (focus) stage.querySelector('h3').focus({ preventScroll: true });
    notice.textContent = stageTitles[step];
  }

  function openPhoto(file) {
    const photo = photos.find(item => item.file === file);
    if (!photo) return;
    document.getElementById('large-photo').src = photoURL(photo);
    document.getElementById('large-photo').alt = photo.title;
    document.getElementById('photo-caption').textContent = '서울 34평 아파트 · ' + phaseOf(photo) + ' · ' + photo.title;
    photoDialog.setAttribute('aria-label', photo.title + ' 원본 보기');
    photoDialog.showModal();
  }

  const actions = {
    'receive-note': () => {
      state.photoResolution = '팀 메모로 분류';
      notice.textContent = '새 작업 메모를 반영해 3번 사진을 작업 중으로 분류했습니다.';
    },
    'confirm-phase': () => {
      state.photoResolution = '담당자 확인';
      state.filter = '작업 중';
      notice.textContent = '확정한 사진이 작업 중 앨범으로 이동했습니다.';
    },
    album: value => { state.album = value; },
    filter: value => { state.filter = value; },
    logo: () => { state.logo = !state.logo; },
    enhance: () => { state.enhanced = !state.enhanced; },
    source: value => { state.source = value; },
    lead: () => { const lead = state.leads[state.source]; lead.status = Math.min(3, lead.status + 1); notice.textContent = state.source + ' 상담 상태 ' + workflow[lead.status]; }
  };
  stage.addEventListener('click', event => {
    const control = event.target.closest('button[data-action]');
    if (!control) return;
    const { action: key, value } = control.dataset;
    if (key === 'photo') { openPhoto(value); return; }
    if (state.step === 2) {
      if (!state.campaign.handle(key, value)) return;
    } else {
      if (!actions[key]) return;
      actions[key](value);
    }
    render();
    const replacement = Array.from(stage.querySelectorAll('button[data-action]')).find(button =>
      button.dataset.action === key && button.dataset.value === value);
    (replacement || stage.querySelector('h3')).focus({ preventScroll: true });
  });

  stage.addEventListener('change', event => {
    const { id, value } = event.target;
    const lead = state.leads[state.source];
    if (id === 'quote-units') lead.units = Number(value);
    else if (id === 'request-scenario' && Object.hasOwn(scenarios, value)) lead.scenario = value;
    else return;
    render();
    stage.querySelector('#' + id).focus({ preventScroll: true });
    notice.textContent = lead.scenario + ' ' + lead.units + '대 조건에 따라 견적과 AI 판단을 갱신했습니다.';
  });

  const choices = document.getElementById('choices');
  choices.addEventListener('click', event => {
    const button = event.target.closest('[data-choice]');
    if (!button) return;
    const name = button.dataset.choice;
    const [materials, pilot, measure] = priorities[name];
    choices.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('priority-result').innerHTML = '<h3>' + name + '부터 시작하는 도입안</h3>' +
      detailList([['준비 자료', materials], ['첫 도입 범위', pilot], ['도입 전후 비교', measure]]);
  });

  document.getElementById('restart').addEventListener('click', () => {
    state = initialState();
    choices.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', 'false'));
    document.getElementById('priority-result').replaceChildren();
    switchStep(0);
  });
  document.getElementById('previous').addEventListener('click', () => switchStep(Math.max(0, state.step - 1)));
  document.getElementById('next').addEventListener('click', () => {
    if (state.step === 3) {
      document.getElementById('priorities').scrollIntoView();
      choices.querySelector('button').focus({ preventScroll: true });
    } else {
      switchStep(state.step + 1);
      document.querySelector('.p-steps').scrollIntoView({ block: 'start' });
    }
  });
  document.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => switchStep(Number(button.dataset.step)));
  });
  document.querySelectorAll('[data-jump]').forEach(link => {
    link.addEventListener('click', () => {
      if (link.dataset.source) state.source = link.dataset.source;
      switchStep(Number(link.dataset.jump), false);
    });
  });
  document.getElementById('close-photo').addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('click', event => {
    if (event.target === photoDialog) photoDialog.close();
  });
  render();
})();
