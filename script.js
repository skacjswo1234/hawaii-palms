// DOM 요소들
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const navMenu = document.getElementById('navMenu');
const btnTop = document.getElementById('btnTop');
const draggableCircle = document.getElementById('draggableCircle');
const heroSection = document.querySelector('.hero-section');
const fireworkLeft = document.querySelector('.firework-left');
const fireworkRight = document.querySelector('.firework-right');
const navLinks = document.querySelectorAll('.nav-list a');

// 메뉴 오버레이
const menuOverlay = document.getElementById('menuOverlay');

// 메뉴 토글 기능
menuToggle.addEventListener('click', () => {
    navMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

menuClose.addEventListener('click', () => {
    closeMenu();
});

menuOverlay.addEventListener('click', () => {
    closeMenu();
});

function closeMenu() {
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// 네비게이션 링크 클릭 시 메뉴 닫기
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            closeMenu();
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    });
});

// TOP 버튼 기능
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        btnTop.classList.remove('hidden');
    } else {
        btnTop.classList.add('hidden');
    }
});

btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 폭죽 애니메이션 (최초 진입 시 한 번만)
let fireworksPlayed = false;

function playFireworks() {
    if (!fireworksPlayed) {
        // 각 파티클에 원형으로 퍼지는 좌표 설정
        const leftParticles = fireworkLeft.querySelectorAll('.particle');
        const rightParticles = fireworkRight.querySelectorAll('.particle');
        
        // 왼쪽 폭죽 파티클 설정
        leftParticles.forEach((particle, index) => {
            const angle = (index / leftParticles.length) * 360 * (Math.PI / 180);
            const distance = 120 + Math.random() * 80;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            particle.style.setProperty('--x', x);
            particle.style.setProperty('--y', y);
        });
        
        // 오른쪽 폭죽 파티클 설정
        rightParticles.forEach((particle, index) => {
            const angle = (index / rightParticles.length) * 360 * (Math.PI / 180);
            const distance = 120 + Math.random() * 80;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            particle.style.setProperty('--x', x);
            particle.style.setProperty('--y', y);
        });
        
        fireworkLeft.classList.add('animate');
        fireworkRight.classList.add('animate');
        fireworksPlayed = true;
        
        // 애니메이션 종료 후 클래스 제거
        setTimeout(() => {
            fireworkLeft.classList.remove('animate');
            fireworkRight.classList.remove('animate');
        }, 1200);
    }
}

// 페이지 로드 시 폭죽 애니메이션 실행
window.addEventListener('load', () => {
    setTimeout(() => {
        playFireworks();
    }, 500);
});

// 드래그 가능한 원 기능
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// 초기 위치 설정 (화면 중앙)
function setInitialPosition() {
    if (!draggableCircle) return;
    const circleWidth = window.innerWidth > 768 ? 120 : 100;
    const circleHeight = window.innerWidth > 768 ? 120 : 100;
    xOffset = (window.innerWidth - circleWidth) / 2;
    yOffset = (window.innerHeight - circleHeight) / 2;
    setTranslate(xOffset, yOffset, draggableCircle);
}

// 초기 위치 설정
if (draggableCircle) {
    window.addEventListener('load', () => {
        setInitialPosition();
    });
    window.addEventListener('resize', setInitialPosition);
}

draggableCircle.addEventListener('mousedown', dragStart);
draggableCircle.addEventListener('touchstart', dragStart);

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);

document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);

function dragStart(e) {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target === draggableCircle || draggableCircle.contains(e.target)) {
        isDragging = true;
        draggableCircle.classList.add('dragging');
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();

        if (e.type === 'touchmove') {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, draggableCircle);
    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
    draggableCircle.classList.remove('dragging');
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

// 히어로 섹션에서만 마우스를 따라다니는 원
let heroHoverCircle = null;
let heroAnimationFrameId = null;
let heroTargetX = 0;
let heroTargetY = 0;
let heroCurrentX = 0;
let heroCurrentY = 0;

// 부드러운 애니메이션을 위한 함수
function animateHeroCircle() {
    if (!heroHoverCircle) return;
    
    // 부드러운 이동을 위한 보간 (easing)
    const easing = 0.12;
    heroCurrentX += (heroTargetX - heroCurrentX) * easing;
    heroCurrentY += (heroTargetY - heroCurrentY) * easing;
    
    heroHoverCircle.style.left = `${heroCurrentX}px`;
    heroHoverCircle.style.top = `${heroCurrentY}px`;
    
    // 움직임이 계속되면 애니메이션 계속
    if (Math.abs(heroTargetX - heroCurrentX) > 0.1 || Math.abs(heroTargetY - heroCurrentY) > 0.1) {
        heroAnimationFrameId = requestAnimationFrame(animateHeroCircle);
    }
}

// 히어로 섹션 내에서만 원 표시
if (heroSection) {
    // 히어로 호버 원 생성
    heroHoverCircle = document.createElement('div');
    heroHoverCircle.className = 'hero-hover-circle';
    heroHoverCircle.style.cssText = `
        position: absolute;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(5px);
        pointer-events: none;
        z-index: 10;
        display: none;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s;
        will-change: transform;
    `;
    heroHoverCircle.innerHTML = '<span style="color: #333; font-size: 12px; font-weight: 600; text-align: center; padding: 10px; line-height: 1.4;">하와이팜스어학원</span>';
    heroSection.appendChild(heroHoverCircle);

    // 히어로 섹션 내에서만 마우스 이동 감지
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 히어로 섹션 내부에 있는지 확인
        if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
            heroHoverCircle.style.display = 'flex';
            heroHoverCircle.style.opacity = '1';
            
            heroTargetX = mouseX - 60;
            heroTargetY = mouseY - 60;
            
            // 애니메이션 시작
            if (!heroAnimationFrameId) {
                heroAnimationFrameId = requestAnimationFrame(animateHeroCircle);
            }
        }
    }, { passive: true });

    // 히어로 섹션에서 벗어나면 원 숨기기
    heroSection.addEventListener('mouseleave', () => {
        if (heroHoverCircle) {
            heroHoverCircle.style.opacity = '0';
            setTimeout(() => {
                if (heroHoverCircle) {
                    heroHoverCircle.style.display = 'none';
                }
            }, 300);
        }
        if (heroAnimationFrameId) {
            cancelAnimationFrame(heroAnimationFrameId);
            heroAnimationFrameId = null;
        }
    });
}

// 네이버톡톡 버튼은 HTML의 href 속성으로 직접 연결됨

// 섹션 이미지 로드 최적화
const sectionImages = document.querySelectorAll('.section-image');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

sectionImages.forEach(img => {
    imageObserver.observe(img);
});

// 스크롤 시 헤더 스타일 변경
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

