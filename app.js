const button = document.getElementById('fontButton');

button.addEventListener('click', () => {
  const active = document.body.classList.toggle('large-text');
  button.textContent = active ? '기본 글자로 보기' : '글자 크게 보기';
  button.setAttribute('aria-pressed', String(active));
  localStorage.setItem('largeText', active ? '1' : '0');
});

if (localStorage.getItem('largeText') === '1') button.click();

const galleryData = {
  step1: [
    ['assets/steps/step1-1.jpg', '스토어에서 아이파킹 앱을 검색합니다.'],
    ['assets/steps/step1-2.jpg', '아이파킹 앱을 선택하고 설치합니다.'],
    ['assets/steps/step1-3.jpg', '앱을 실행한 뒤 마이페이지를 누릅니다.'],
    ['assets/steps/step1-4.jpg', '로그인 또는 회원가입을 누릅니다.']
  ],
  step2: [
    ['assets/steps/step2-1.jpg', '마이페이지에서 입주민 신청하기를 선택합니다.'],
    ['assets/steps/step2-2.jpg', '거주지를 선택합니다.'],
    ['assets/steps/step2-3.jpg', '아파트 이름이나 주소를 검색하고 거주지를 선택합니다.'],
    ['assets/steps/step2-4.jpg', '동·호를 선택하고 신청 버튼을 누릅니다.'],
    ['assets/steps/step2-5.jpg', '입주민 정보를 입력하면 신청이 완료되고 관리실에서 승인합니다.'],
    ['assets/steps/step2-6.jpg', '마이페이지와 앱 홈에서 승인 여부를 확인합니다.']
  ],
  step3: [
    ['assets/steps/step3-1.jpg', '앱 홈에서 입주민 방문차량을 선택합니다.'],
    ['assets/steps/step3-2.jpg', '방문차량 예약을 선택합니다.'],
    ['assets/steps/step3-3.jpg', '차량번호 예약을 선택합니다.'],
    ['assets/steps/step3-4.jpg', '방문 예정일 입력란을 선택합니다.'],
    ['assets/steps/step3-5.jpg', '달력에서 방문 예정일을 선택합니다.'],
    ['assets/steps/step3-6.jpg', '차량번호와 방문 정보를 입력하고 등록합니다.'],
    ['assets/steps/step3-7.jpg', '예약 완료를 확인하고 필요하면 방문객에게 공유합니다.']
  ],
  step4: [
    ['assets/steps/step4-1.jpg', '앱 홈에서 입주민 방문차량을 선택합니다.'],
    ['assets/steps/step4-2.jpg', '예약내역을 선택합니다.'],
    ['assets/steps/step4-3.jpg', '방문 키오스크 탭에서 비밀번호 재설정을 선택합니다.'],
    ['assets/steps/step4-4.jpg', '숫자 4자리 비밀번호를 입력하고 재설정합니다.']
  ]
};

function renderGallery(container) {
  const items = galleryData[container.dataset.gallery];
  let current = 0;
  let touchStartX = 0;

  container.innerHTML = `
    <div class="gallery-counter" aria-live="polite"></div>
    <img class="gallery-image" alt="">
    <p class="gallery-caption"></p>
    <div class="gallery-controls">
      <button type="button" data-direction="prev">← 이전 화면</button>
      <div class="gallery-dots" aria-hidden="true"></div>
      <button type="button" data-direction="next">다음 화면 →</button>
    </div>
    <p class="gallery-tip">화면을 누르면 원본 크기로 볼 수 있습니다.</p>
  `;

  const image = container.querySelector('.gallery-image');
  const caption = container.querySelector('.gallery-caption');
  const counter = container.querySelector('.gallery-counter');
  const dots = container.querySelector('.gallery-dots');
  const previous = container.querySelector('[data-direction="prev"]');
  const next = container.querySelector('[data-direction="next"]');

  dots.innerHTML = items.map(() => '<i></i>').join('');

  function update() {
    const [src, text] = items[current];
    image.src = src;
    image.alt = `${current + 1}번 화면: ${text}`;
    image.setAttribute('aria-label', `${image.alt} 원본 크기로 보기`);
    caption.innerHTML = `<b>${current + 1}</b><span>${text}</span>`;
    counter.textContent = `${current + 1} / ${items.length}`;
    previous.disabled = current === 0;
    next.disabled = current === items.length - 1;
    dots.querySelectorAll('i').forEach((dot, index) => dot.classList.toggle('active', index === current));
  }

  container.addEventListener('click', (event) => {
    const direction = event.target.closest('button')?.dataset.direction;
    if (direction === 'prev' && current > 0) current -= 1;
    if (direction === 'next' && current < items.length - 1) current += 1;
    if (direction) update();
  });

  image.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  image.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (distance < -45 && current < items.length - 1) current += 1;
    if (distance > 45 && current > 0) current -= 1;
    if (Math.abs(distance) > 45) update();
  }, { passive: true });

  update();
}

document.querySelectorAll('.screen-gallery').forEach(renderGallery);

const viewer = document.createElement('div');
viewer.className = 'image-viewer';
viewer.setAttribute('aria-hidden', 'true');
viewer.innerHTML = `
  <div class="viewer-toolbar" role="toolbar" aria-label="이미지 확대 도구">
    <button type="button" data-action="close" aria-label="확대 화면 닫기">닫기</button>
    <span class="viewer-title">화면 예시</span>
    <button type="button" data-action="minus" aria-label="이미지 축소">−</button>
    <output class="viewer-zoom" aria-live="polite">맞춤</output>
    <button type="button" data-action="plus" aria-label="이미지 확대">＋</button>
  </div>
  <div class="viewer-stage">
    <img alt="">
  </div>
  <p class="viewer-help">이미지를 누르면 원본 크기로 확대·축소됩니다.</p>
`;
document.body.appendChild(viewer);

const viewerStage = viewer.querySelector('.viewer-stage');
const viewerImage = viewer.querySelector('img');
const viewerTitle = viewer.querySelector('.viewer-title');
const viewerZoom = viewer.querySelector('.viewer-zoom');
let fitScale = 1;
let scale = 1;

function setScale(nextScale) {
  scale = Math.max(fitScale, Math.min(1, nextScale));
  viewerImage.style.width = `${Math.round(viewerImage.naturalWidth * scale)}px`;
  viewerZoom.textContent = scale >= .995 ? '원본 100%' : `${Math.round(scale * 100)}%`;
}

function calculateFitScale() {
  const availableWidth = Math.max(240, viewerStage.clientWidth - 32);
  const availableHeight = Math.max(240, viewerStage.clientHeight - 32);
  fitScale = Math.min(1, availableWidth / viewerImage.naturalWidth, availableHeight / viewerImage.naturalHeight);
  setScale(fitScale);
}

function openViewer(sourceImage) {
  viewerImage.alt = sourceImage.alt;
  viewerTitle.textContent = sourceImage.alt || '화면 예시';
  viewer.classList.add('open');
  viewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('viewer-open');
  viewerImage.onload = () => {
    calculateFitScale();
    viewerStage.scrollTo({ left: 0, top: 0 });
  };
  viewerImage.src = sourceImage.currentSrc || sourceImage.src;
  viewer.querySelector('[data-action="close"]').focus();
}

function closeViewer() {
  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('viewer-open');
  viewerImage.removeAttribute('src');
}

document.querySelectorAll('.gallery-image').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `${image.alt} 확대해서 보기`);
  image.addEventListener('click', () => openViewer(image));
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openViewer(image);
    }
  });
});

viewer.addEventListener('click', (event) => {
  const action = event.target.closest('button')?.dataset.action;
  if (action === 'close') closeViewer();
  if (action === 'plus') setScale(scale * 1.35);
  if (action === 'minus') setScale(scale / 1.35);
});

viewerImage.addEventListener('click', () => {
  setScale(scale >= .995 ? fitScale : 1);
});

viewer.addEventListener('click', (event) => {
  if (event.target === viewer) closeViewer();
});

window.addEventListener('resize', () => {
  if (viewer.classList.contains('open')) calculateFitScale();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && viewer.classList.contains('open')) closeViewer();
});
