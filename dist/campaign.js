(() => {
  'use strict';

  const assetPath = 'assets/proposal/';
  const channels = ['유튜브 쇼츠', '인스타그램', '네이버 블로그', '틱톡'];
  const topics = {
    site: {
      name: '34평 아파트 시공 전후', tag: '현장 기록',
      reason: '작업팀이 보낸 사진 6장이 한 현장에 모였습니다.',
      video: 'site-short.mp4', cover: '06.webp',
      title: '거실 천장이 달라지기까지', hook: '같은 거실입니다. 천장에서 달라진 곳이 보이나요?',
      hashtag: '#시공전후 #시스템에어컨',
      cards: [
        ['시공 전 거실', '창과 천장 높이를 살피고 실내기 위치를 잡습니다.', '01.webp'],
        ['바닥 보양', '자재가 드나드는 동선부터 바닥을 보호합니다.', '02.webp'],
        ['배관과 단열', '천장 마감 전에 배관 연결부를 확인합니다.', '03.webp'],
        ['실내기 설치', '천장 높이에 맞춰 실내기를 고정합니다.', '04.webp'],
        ['실외기 설치', '바람이 빠져나갈 공간을 확인합니다.', '05.webp'],
        ['마감을 마친 거실', '작동을 확인하고 시공 전 모습과 비교합니다.', '06.webp']
      ],
      blogTitle: '34평 아파트 시스템에어컨, 보양부터 마감까지',
      blog: '거실과 방 세 곳에 실내기를 설치하는 현장을 예시로 정리했습니다. 바닥을 보양하고 배관과 단열 상태를 점검한 뒤 천장을 마감했습니다. 사진을 비교할 때는 실내기 위치와 주변 마감선을 함께 살펴보세요.'
    },
    move: {
      name: '입주 전 설치 시점', tag: '입주 준비',
      reason: '예시 상담에 입주일과 도배 순서를 묻는 질문이 들어왔습니다.',
      video: 'move-in.mp4', cover: 'move-in.webp',
      title: '입주 전, 설치 일정은 언제 잡을까요?', hook: '도배 날짜를 정하셨나요? 설치팀에도 먼저 알려주세요.',
      hashtag: '#입주준비 #인테리어일정',
      cards: [
        ['입주일에서 거꾸로', '입주일과 현장에 들어갈 수 있는 첫날을 적어 두세요.'],
        ['천장·도배 일정 확인', '천장 개구와 마감이 필요한지 설치팀과 인테리어팀에 함께 확인하세요.'],
        ['방문 전 자료 준비', '평면도와 희망 실내기 위치를 공유하면 일정 상담에 도움이 됩니다.']
      ],
      blogTitle: '입주가 한 달 남았다면, 시스템에어컨 설치 일정 잡는 법',
      blog: '입주 예정일, 천장 공사일, 도배일을 한 장에 정리해 주세요. 배관을 넣기 위해 천장을 열어야 하는지에 따라 작업 순서가 달라집니다. 현장 방문 때 인테리어팀과 설치팀이 마감 시점을 함께 맞추면 날짜를 정하기 수월합니다.'
    },
    quote: {
      name: '견적 비교 체크리스트', tag: '견적 상담',
      reason: '예시 견적 문의에서 기본 설치비와 추가 배관비를 함께 물었습니다.',
      video: 'quote-tips.mp4', cover: 'quote-tips.webp',
      title: '견적서 두 장, 어디부터 비교할까요?', hook: '가격이 다른 두 견적서, 이 세 줄부터 맞춰 보세요.',
      hashtag: '#견적비교 #설치체크리스트',
      cards: [
        ['제품 구성을 맞추기', '실내기 수량뿐 아니라 모델명과 용량까지 같은지 확인하세요.'],
        ['배관 범위 확인', '기본 설치에 포함된 배관 길이와 추가 작업 기준을 물어보세요.'],
        ['마감 범위 확인', '천장 복구·도배가 견적에 포함되는지 확인한 뒤 총액을 비교하세요.']
      ],
      blogTitle: '시스템에어컨 견적을 같은 기준으로 비교하는 세 가지 질문',
      blog: '합계만 보면 설치 범위의 차이를 놓치기 쉽습니다. 먼저 모델명·용량·수량을 맞춰 보고, 배관과 전기 작업의 포함 범위를 살펴보세요. 천장 마감과 기존 기기 철거 비용도 계약 전에 항목별로 확인해 두면 좋습니다.'
    },
    filter: {
      name: '에어컨 필터 관리', tag: '사용·관리',
      reason: '예시 A/S 기록에 필터 알림과 청소 방법 문의가 쌓였습니다.',
      video: 'filter-care.mp4', cover: 'filter-care.webp',
      title: '필터 알림이 켜지면 먼저 확인할 것', hook: '필터 청소 전, 물을 써도 되는 필터인지 확인하셨나요?',
      hashtag: '#필터관리 #에어컨청소',
      cards: [
        ['모델명 확인', '사용설명서에서 필터를 꺼내는 방법과 청소 기준을 확인하세요.'],
        ['필터 종류 확인', '물세척용과 교체용은 관리 방법이 다릅니다. 설명서 안내를 따르세요.'],
        ['다시 끼우기 전', '물세척이 가능한 필터는 충분히 말리고 무리한 분해는 피하세요.']
      ],
      blogTitle: '시스템에어컨 필터 관리, 모델별 설명서에서 확인할 항목',
      blog: '필터 알림이 보이면 모델명을 확인하고 설명서의 필터 관리 항목을 찾아보세요. 물세척이 가능한 필터와 교체가 필요한 필터는 관리법이 다릅니다. 전원을 끈 상태에서 안내된 절차를 따르고, 접근이 어려운 천장형은 점검을 요청하세요.'
    }
  };
  const signals = {
    moving: { label: '입주 상담 증가', order: ['move', 'quote', 'site', 'filter'], finding: '입주 예정 고객의 일정 질문을 반영해 설치 시점을 우선 추천했습니다.' },
    comparing: { label: '비교 문의 증가', order: ['quote', 'site', 'move', 'filter'], finding: '가격과 설치 범위를 묻는 상담이 들어와 견적 비교 체크리스트를 우선 추천했습니다.' },
    service: { label: '관리 문의 증가', order: ['filter', 'quote', 'site', 'move'], finding: '필터 관련 A/S 문의를 반영해 사용·관리 소재를 우선 추천했습니다.' }
  };
  const slots = {
    morning: { label: '오전 게시', make: 8, post: 10 },
    evening: { label: '저녁 게시', make: 14, post: 18 }
  };
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

  function moment(hour) {
    return weekdays[Math.floor(hour / 24) % 7] + '요일 ' + String(hour % 24).padStart(2, '0') + ':00';
  }

  function button(label, action, value = '', options = {}) {
    const { style = 'p-button p-secondary', pressed, disabled = false } = options;
    return '<button type="button" class="' + style + '" data-action="campaign-' + action + '" data-value="' + value + '"' +
      (pressed === undefined ? '' : ' aria-pressed="' + pressed + '"') +
      (disabled ? ' disabled' : '') + '>' + label + '</button>';
  }

  function choices(items, selected, action, label) {
    return '<div class="p-tabs" role="group" aria-label="' + label + '">' + items.map(([value, text]) =>
      button(text, action, value, { style: '', pressed: selected === value })
    ).join('') + '</div>';
  }

  function preview(topic, channel, frame) {
    if (channel === '네이버 블로그') {
      return '<article class="p-preview p-blog"><small>거니공조 블로그 · ' + topic.tag +
        '</small><h4>' + topic.blogTitle + '</h4><img src="' + assetPath + topic.cover +
        '" alt="' + topic.name + ' 시안"><p>' + topic.blog + '</p></article>' +
        '<p class="p-status">승인되면 등록 자동화 솔루션이 브라우저 글쓰기 화면에 본문과 이미지를 넣고 카테고리·예약 시각을 설정합니다.</p>';
    }
    if (channel === '인스타그램') {
      const [title, copy, photo] = topic.cards[frame];
      return '<article class="p-preview p-social"><strong>거니공조</strong><img src="' + assetPath + (photo || topic.cover) +
        '" alt="' + topic.name + ' 예시 이미지"><div><small>카드 ' + (frame + 1) + ' / ' + topic.cards.length + '</small><h4>' +
        title + '</h4><p>' + copy + '</p></div></article>' + button('다음 카드 보기 →', 'card');
    }
    const tiktok = channel === '틱톡';
    return '<figure class="p-preview p-short' + (tiktok ? ' c-tiktok' : '') + '"><small>' +
      (tiktok ? 'TikTok · 질문으로 시작하는 영상' : 'YouTube Shorts · 세로 영상') + '</small><h4>' +
      (tiktok ? topic.hook : topic.title) + '</h4><video controls muted playsinline preload="none" src="' +
      assetPath + topic.video + '" poster="' + assetPath + topic.cover + '" aria-label="' + topic.name + ' ' + channel +
      ' 영상 시안"></video><figcaption>' + (tiktok ? topic.hashtag : topic.name + ' · 거니공조') + '</figcaption></figure>';
  }

  function create() {
    const selected = new Set(['site', 'move']);
    let signal = 'moving';
    let slot = 'morning';
    let jobs = [];
    let now = -1;
    let activeId = '';
    let channel = channels[0];
    let frame = 0;

    function planning() {
      const recommendation = signals[signal];
      const topicChips = recommendation.order.map(id => {
        const topic = topics[id];
        return button('<strong>' + topic.name + '</strong><small>' + topic.reason + '</small>', 'topic', id,
          { style: 'c-topic', pressed: selected.has(id) });
      }).join('');
      return '<div class="p-screen-head"><strong>이번 주에 다룰 소재</strong><span>AI 추천 시연</span></div>' +
        '<section class="c-section"><h4>어떤 문의가 들어왔나요?</h4>' +
        choices(Object.entries(signals).map(([key, item]) => [key, item.label]), signal, 'signal', '예시 상담 흐름') +
        '<p class="p-status">' + recommendation.finding + '</p></section>' +
        '<section class="c-section"><h4>제작할 소재 선택 · ' + selected.size + '개</h4><div class="c-topics" role="group" aria-label="제작할 소재 복수 선택">' +
        topicChips + '</div></section><section class="c-section"><h4>평일 제작·게시 시간</h4>' +
        choices(Object.entries(slots).map(([key, item]) => [key, item.label]), slot, 'slot', '발행 시간대') +
        '<p>월요일부터 하루에 소재 하나를 ' + slots[slot].make + '시에 제작하고, 승인된 콘텐츠를 ' + slots[slot].post +
        '시에 네 채널에 게시합니다.</p></section>' +
        button('선택한 ' + selected.size + '개 소재로 일정 확정', 'plan', '', { style: 'p-button p-primary', disabled: !selected.size });
    }

    function plan() {
      const hours = slots[slot];
      jobs = signals[signal].order.filter(id => selected.has(id)).map((id, day) => ({
        id, make: day * 24 + hours.make, post: day * 24 + hours.post, status: '제작 대기'
      }));
      activeId = '';
      now = -1;
    }

    function nextEvent() {
      const times = [];
      for (const job of jobs) {
        if (job.status === '제작 대기') times.push(job.make);
        if (job.status === '승인 대기' || job.status === '게시 예약') times.push(job.post);
      }
      return Math.min(...times.filter(at => at > now));
    }

    function advance() {
      const at = nextEvent();
      if (!Number.isFinite(at)) return;
      now = at;
      for (const job of jobs) {
        if (job.make === now && job.status === '제작 대기') {
          job.status = '승인 대기';
          activeId = job.id;
          frame = 0;
        }
        if (job.post === now && job.status === '게시 예약') job.status = '게시 완료';
        if (job.post === now && job.status === '승인 대기') job.status = '승인 보류';
      }
    }

    function approve() {
      const job = jobs.find(item => item.id === activeId);
      if (!job || !['승인 대기', '승인 보류'].includes(job.status)) return;
      if (job.post <= now) job.post = (Math.floor(now / 24) + 1) * 24 + slots[slot].post;
      job.status = '게시 예약';
    }

    function calendar() {
      const rows = jobs.map(job => '<tr' + (job.id === activeId ? ' aria-current="true"' : '') + '><td>' +
        button(topics[job.id].name, 'open', job.id, { style: 'c-topic-label', disabled: job.status === '제작 대기' }) +
        '</td><td>' + moment(job.make) + '</td><td>' + moment(job.post) + '</td><td>' + job.status + '</td></tr>').join('');
      const upcoming = nextEvent();
      const makeDue = jobs.some(item => item.status === '제작 대기' && item.make === upcoming);
      const clockAction = Number.isFinite(upcoming)
        ? button(moment(upcoming) + (makeDue ? ' 제작 시각으로 →' : ' 게시 시각으로 →'), 'advance', '', { style: 'p-button p-primary' })
        : '';
      return '<table class="p-week c-schedule"><caption>주간 제작·게시 일정</caption><thead><tr><th scope="col">소재</th><th scope="col">AI 제작</th><th scope="col">게시</th><th scope="col">상태</th></tr></thead><tbody>' +
        rows + '</tbody></table><div class="c-clock"><span>시연 시각 · ' + (now < 0 ? '일정 확정 직후' : moment(now)) +
        '</span>' + clockAction + '</div>';
    }

    function review() {
      const job = jobs.find(item => item.id === activeId);
      if (!job) return '<p class="p-status">첫 제작 시각으로 이동하면 AI가 해당 소재의 채널별 시안을 만듭니다.</p>';
      const topic = topics[job.id];
      const canApprove = job.status === '승인 대기' || job.status === '승인 보류';
      let status = '네 채널에 게시한 결과가 현장·소재 기록에 반영되었습니다.';
      if (job.status === '승인 대기') status = '네 채널에 맞춰 시안을 만들었습니다. 담당자가 결과를 확인한 뒤 묶음 승인합니다.';
      if (job.status === '승인 보류') status = '예정 시각까지 승인이 없어 게시를 보류했습니다. 지금 승인하면 다음 날 같은 시각으로 예약합니다.';
      if (job.status === '게시 예약') status = '담당자 승인 완료 · ' + moment(job.post) + ' 자동 게시 예정';
      return '<section class="c-review"><div class="p-screen-head"><strong>' + topic.name + '</strong><span>' + job.status +
        '</span></div>' + choices(channels.map(label => [label, label]), channel, 'channel', '채널별 제작 시안') +
        preview(topic, channel, frame) + '<p class="p-status">' + status + '</p>' +
        (canApprove ? button('이 소재의 4채널 시안 승인·예약', 'approve', '', { style: 'p-button p-primary' }) : '') + '</section>';
    }

    function view() {
      return {
        description: 'AI가 새 상담 질문과 현장 기록을 읽고 홍보 소재를 추천합니다. 선택한 소재는 주간 일정에 맞춰 제작하고, 담당자가 승인하면 채널별로 자동 게시합니다.',
        labels: [['추천 기준', signals[signal].label + ' · 예시 데이터'], ['제작 채널', channels.join(' · ')], ['게시 조건', '담당자 승인 및 예약 시각 도달']],
        screen: jobs.length
          ? '<div class="p-screen-head"><strong>AI 콘텐츠 제작 일정</strong><span>' + jobs.length + '개 소재 · 4개 채널</span></div>' +
            calendar() + review() + '<div class="c-actions">' + button('새 일정으로 다시 시연', 'reset') + '</div>'
          : planning()
      };
    }

    function handle(action, value) {
      if (!action.startsWith('campaign-')) return false;
      switch (action) {
        case 'campaign-signal': if (!jobs.length && Object.hasOwn(signals, value)) signal = value; break;
        case 'campaign-topic':
          if (!jobs.length && Object.hasOwn(topics, value)) {
            if (selected.has(value)) selected.delete(value);
            else selected.add(value);
          }
          break;
        case 'campaign-slot': if (!jobs.length && Object.hasOwn(slots, value)) slot = value; break;
        case 'campaign-plan': if (!jobs.length && selected.size) plan(); break;
        case 'campaign-advance': advance(); break;
        case 'campaign-open':
          if (jobs.some(job => job.id === value && job.status !== '제작 대기')) { activeId = value; frame = 0; }
          break;
        case 'campaign-channel':
          if (channels.includes(value)) { channel = value; frame = 0; }
          break;
        case 'campaign-card': if (activeId) frame = (frame + 1) % topics[activeId].cards.length; break;
        case 'campaign-approve': approve(); break;
        case 'campaign-reset': jobs = []; activeId = ''; now = -1; frame = 0; channel = channels[0]; break;
        default: return false;
      }
      return true;
    }
    return { view, handle };
  }

  window.ProposalCampaign = { create };
})();
