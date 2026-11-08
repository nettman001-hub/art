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
  const channels = {
    '유튜브 쇼츠': { slot: '월요일 09:00', format: '세로 영상', copy: '시공 전부터 천장형 실내기 설치까지, 거실이 달라지는 과정을 짧은 영상으로 편집합니다.' },
    '인스타그램': { slot: '수요일 18:00', format: '카드 게시물', copy: '보양부터 마감까지 담은 카드 이미지에 현장 설명을 붙여 인스타그램에 게시합니다.' },
    '네이버 블로그': { slot: '금요일 10:00', format: '시공사례 글', copy: '등록 자동화 솔루션이 브라우저 글쓰기 화면에 제목·사진·캡션·본문을 입력하고 카테고리와 발행 시각을 설정합니다.' }
  };
  const sources = ['홈페이지', '숨고', '크몽'];
  const customerNames = { '홈페이지': '김○○', '숨고': '박○○', '크몽': '이○○' };
  const workflow = ['신규 접수', '연락 완료', '방문 예정', '계약 완료'];
  const leadActions = ['첫 연락 완료 처리', '현장 방문 일정 잡기', '계약 완료 처리'];
  const stageTitles = ['작업팀의 사진이 도착했습니다.', '공정별로 정리된 현장 앨범', '한 현장, 세 가지 홍보물', '문의가 들어오면 다음 할 일까지'];
  const nextLabels = ['현장 앨범 만들기 →', '홍보 콘텐츠 만들기 →', '문의·견적 관리 보기 →', '첫 도입 업무 고르기 ↓'];
  const priorities = {
    '홍보물 제작': ['홍보에 쓸 수 있는 사진과 기존 채널 게시물', '현장 한 건의 쇼츠·카드·블로그 글 제작과 주간 발행표', '현장 한 건의 콘텐츠 준비 시간'],
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
      channel: '유튜브 쇼츠', publication: {}, frame: 0, source: '홈페이지',
      leads: Object.fromEntries(sources.map(source => [source, { status: -1, units: 4 }]))
    };
  }
  let state = initialState();

  function photoURL(photo) {
    return 'assets/proposal/' + photo.file + '.webp';
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
      photo.title + '</figcaption></figure>'
    ).join('') + '</div>';
  }

  function inbox() {
    return {
      description: '작업팀은 당일 배정된 현장을 선택하고 카카오톡으로 사진을 보냅니다. 보낸 사람과 현장 정보가 함께 기록됩니다.',
      labels: [['현장', '서울 · 34평 아파트'], ['작업팀', '설치 1팀'], ['작업 내용', '거실 및 방 3곳 시스템에어컨 설치']],
      screen: '<div class="p-screen-head"><strong>시공사진 접수 채널</strong><span>카카오톡 수신 예시</span></div>' +
        '<div class="p-message"><small>설치 1팀 · 오후 4:32</small><p>오늘 작업 마쳤습니다. 시공 전·후와 배관 사진 보냅니다.</p></div>' +
        grid(photos, true) + '<p class="p-status">사진 6장 수신 · 현장 선택 완료</p>'
    };
  }

  function album() {
    const modes = ['원본 앨범', '전후 비교', '홍보용 편집'];
    let content;
    if (state.album === '원본 앨범') {
      const visible = photos.filter(photo => state.filter === '전체' || photo.phase === state.filter);
      content = tabs(['전체', '시공 전', '작업 중', '완료'], state.filter, 'filter', '사진 공정 필터') +
        grid(visible) + '<p class="p-status">원본 6장 보관 · 선택한 공정 ' + visible.length + '장</p>';
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
      description: '현장별로 원본을 보관하고 시공 전·작업 중·완료 사진을 나눕니다. 구분이 모호한 사진은 팀장이 확인합니다. 홍보에 사용할 사본은 노출 정보를 가리고 채널 규격에 맞춰 편집합니다.',
      labels: [['원본 활용', '고객 상담 · A/S 이력'], ['편집본 활용', '홈페이지 사례 · 홍보 게시물']],
      screen: '<div class="p-screen-head"><strong>서울 34평 아파트</strong><span>현장 앨범</span></div>' +
        tabs(modes, state.album, 'album', '앨범 보기 방식') + content
    };
  }

  function reel() {
    return '<figure class="p-preview p-short"><video controls muted playsinline preload="none" src="assets/proposal/site-short.mp4" poster="assets/proposal/06.webp" aria-label="거니공조 시공 전후 세로 영상 시안">' +
      '거실 공사 전부터 시공 완료까지 여섯 장면이 이어지는 영상입니다.</video><figcaption>서울 34평 아파트 · 시공 기록 쇼츠</figcaption></figure>';
  }

  function instagram() {
    const selected = photos[state.frame];
    return '<div class="p-preview p-social"><strong>거니공조</strong><img src="' + photoURL(selected) + '" alt="' + selected.title + '">' +
      '<div><small>카드 ' + (state.frame + 1) + ' / 6</small><h4>' + selected.title + '</h4><p>서울 34평 아파트의 설치 기록. 바닥 보양부터 천장형 실내기 마감까지 살펴보세요.</p></div></div>' +
      action('다음 카드 보기 →', 'card');
  }

  function blog() {
    return '<article class="p-preview p-blog"><small>거니공조 블로그 / 아파트 시공사례</small><h4>34평 아파트, 거실과 방 3곳에 시스템에어컨을 설치했습니다</h4>' +
      '<img src="' + photoURL(photos[2]) + '" alt="천장 배관 단열 작업"><p>천장을 마감하기 전, 배관의 단열과 연결 상태를 먼저 살폈습니다. 이번 현장은 거실과 방 세 곳을 함께 시공했습니다.</p>' +
      '<small>사진 설명 · 천장 마감 전 배관 단열 상태</small></article>';
  }

  function publication() {
    const name = state.channel;
    const channel = channels[name];
    const status = state.publication[name];
    const previews = { '유튜브 쇼츠': reel, '인스타그램': instagram, '네이버 블로그': blog };
    const chosenTime = '<strong>' + channel.slot + '</strong>';
    let publishControl = action('예약 등록 시연', 'schedule', '', 'p-primary');
    if (status === '예약') publishControl = action('발행 결과 시연', 'publish');
    if (status === '완료') publishControl = '<span class="p-status">게시 결과를 현장 기록에 저장했습니다.</span>';
    const week = '<table class="p-week"><caption>주간 발행표</caption><thead><tr><th scope="col">일정</th><th scope="col">채널</th><th scope="col">상태</th></tr></thead><tbody>' +
      Object.entries(channels).map(([label, item]) => '<tr><td>' + item.slot + '</td><td>' + label + '</td><td>' +
        ({ '예약': '예약 완료', '완료': '게시 완료' }[state.publication[label]] || '시안 준비') + '</td></tr>').join('') + '</tbody></table>';
    return {
      description: channel.copy,
      labels: [['홍보 소재', '서울 34평 아파트 설치 기록'], ['제작 형태', channel.format], ['주간 발행표', channel.slot]],
      screen: '<div class="p-screen-head"><strong>채널별 콘텐츠</strong><span>시안 미리보기</span></div>' +
        tabs(Object.keys(channels), name, 'channel', '홍보 채널') + previews[name]() +
        '<div class="p-calendar"><div><small>' + (status === '완료' ? '시연 발행 완료' : status === '예약' ? '시연 예약 완료' : '예정 발행 시간') + '</small>' +
        chosenTime + '</div>' + publishControl + '</div>' + week
    };
  }

  function inquiry() {
    const source = state.source;
    const lead = state.leads[source];
    const amount = window.ArtQuote.calculate({ brand: 'samsung', units: lead.units, area: 34, model: 'standard', pipe: 'multi' }).total;
    const cost = amount.toLocaleString('ko-KR') + '원';
    const sourceDetails = {
      '홈페이지': '현장에서 공개한 블로그 시공사례를 읽고 비슷한 아파트에 살고 있는 고객이 간편견적을 열었습니다. 선택한 구성이 상담 카드로 전달됩니다.',
      '숨고': '스마트견적에 등록한 서비스·지역 조건과 일일 발송 예산에 맞는 요청을 대상으로 기본 견적을 보냅니다. 현장별 추가 공사가 예상되면 별도 확인합니다.',
      '크몽': '자주 묻는 질문에 자동 응답하고, 개별 요청에 맞춰 단가표 기반 견적과 추가 질문을 메시지로 준비해 발송하는 범위를 제안합니다. 건별 발송은 시범 계정에서 검증합니다.'
    };
    const startLabel = source === '홈페이지' ? '예시 문의 접수' : '견적 자동 발송 시연';
    const statusLabel = lead.status === -1 ? (source === '홈페이지' ? '고객 입력 화면' : '새 견적 요청') : workflow[lead.status];
    const config = lead.status === -1
      ? '<label class="p-units">실내기 수량 <select id="quote-units">' + [2, 3, 4, 5, 6].map(units => '<option value="' + units + '"' + (lead.units === units ? ' selected' : '') + '>' + units + '대</option>').join('') + '</select></label>'
      : '<span>실내기 ' + lead.units + '대</span>';
    const customer = '<div class="p-estimate"><div><small>서울 · 34평 · 삼성 일반형</small><strong>예상 견적 ' + cost + '</strong></div>' + config + '</div>';
    const pendingSources = sources.filter(channel => state.leads[channel].status === 0);
    const followups = '<aside class="p-followups" aria-label="오늘 연락할 고객"><h4>오늘 연락할 고객 <span>' + pendingSources.length + '건</span></h4>' +
      (pendingSources.length ? '<ul>' + pendingSources.map(channel => '<li>' + action(channel + ' · ' + customerNames[channel] + ' 상담 열기', 'source', channel) +
        '</li>').join('') + '</ul>' : '<p>첫 연락을 기다리는 고객이 없습니다.</p>') + '</aside>';
    let record;
    if (lead.status < 0) {
      record = '<div class="p-message"><small>' + customerNames[source] + ' 고객 · 가상 문의</small><p>입주 전에 설치하고 싶어요. 이 구성으로 비용과 방문 가능 일정을 알려주세요.</p></div>' + action(startLabel, 'lead', '', 'p-primary');
    } else {
      const replies = {
        '홈페이지': '문의가 접수되었습니다. 설치 희망일과 공간 구성을 확인한 뒤 담당자가 연락드리겠습니다.',
        '숨고': '요청하신 기본 구성의 예상 금액은 ' + cost + '입니다. 추가 공사 확인을 위해 실외기 위치와 예상 배관 길이를 알려주세요.',
        '크몽': '서울 34평, 실내기 ' + lead.units + '대 기본 구성은 ' + cost + '으로 예상됩니다. 천장 상태와 입주 예정일을 알려주시면 현장 조건을 확인해 드리겠습니다.'
      };
      const nextTask = ['오늘 17시까지 첫 연락', '희망일 확인 후 현장 방문 일정 제안', '예시 일정 · 금요일 14:00 현장 방문', '시공팀에 현장 정보 전달'];
      record = '<div class="p-message"><small>고객에게 보낸 ' + (source === '홈페이지' ? '접수 안내' : '견적 메시지') + ' · 시연</small><p>' + replies[source] + '</p></div>' +
        detailList([['고객', customerNames[source] + ' · 가상 고객'], ['유입 경로', source === '홈페이지' ? '블로그 시공사례 → 홈페이지' : source + ' 견적 요청'], ['담당자', '거니공조 상담팀'], ['상담 상태', workflow[lead.status]], ['다음 업무', nextTask[lead.status]]]) +
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
    const data = [inbox, album, publication, inquiry][state.step]();
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
    document.getElementById('photo-caption').textContent = '서울 34평 아파트 · ' + photo.phase + ' · ' + photo.title;
    photoDialog.setAttribute('aria-label', photo.title + ' 원본 보기');
    photoDialog.showModal();
  }

  const actions = {
    album: value => { state.album = value; },
    filter: value => { state.filter = value; },
    logo: () => { state.logo = !state.logo; },
    enhance: () => { state.enhanced = !state.enhanced; },
    channel: value => { state.channel = value; state.frame = 0; },
    card: () => { state.frame = (state.frame + 1) % photos.length; },
    schedule: () => { state.publication[state.channel] = '예약'; notice.textContent = state.channel + ' 예약 등록 시연을 완료했습니다.'; },
    publish: () => { state.publication[state.channel] = '완료'; notice.textContent = state.channel + ' 발행 완료 이력을 저장했습니다.'; },
    source: value => { state.source = value; },
    lead: () => { const lead = state.leads[state.source]; lead.status = Math.min(3, lead.status + 1); notice.textContent = state.source + ' 상담 상태 ' + workflow[lead.status]; }
  };
  stage.addEventListener('click', event => {
    const control = event.target.closest('button[data-action]');
    if (!control) return;
    const { action: key, value } = control.dataset;
    if (key === 'photo') { openPhoto(value); return; }
    if (!actions[key]) return;
    actions[key](value);
    render();
    const replacement = Array.from(stage.querySelectorAll('button[data-action]')).find(button =>
      button.dataset.action === key && button.dataset.value === value);
    (replacement || stage.querySelector('h3')).focus({ preventScroll: true });
  });

  stage.addEventListener('change', event => {
    if (event.target.id !== 'quote-units') return;
    state.leads[state.source].units = Number(event.target.value);
    render();
    stage.querySelector('#quote-units').focus({ preventScroll: true });
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
