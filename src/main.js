document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeroAnimation();
  initQuiz();
  initContactForm();
  initCookiePopup();
});

/* =========================================
 1. MOBILE MENU LOGIC
 ========================================= */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.header__burger');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');

  if (!burgerBtn || !mobileMenu) return;

  function openMenu() {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
  }

  burgerBtn.addEventListener('click', openMenu);

  if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
  }

  menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
  });
}

/* =========================================
 2. THREE.JS HERO ANIMATION
 ========================================= */
function initHeroAnimation() {
  const container = document.getElementById('hero-canvas-container');

  // Check if Three.js is loaded and container exists
  if (!container || typeof THREE === 'undefined') return;

  // SETUP
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // GROUP & GEOMETRY
  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(180, 1);

  const pointsMaterial = new THREE.PointsMaterial({
      color: 0x4F46E5, // Indigo
      size: 6,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0EA5E9, // Sky Blue
      wireframe: true,
      transparent: true,
      opacity: 0.15
  });

  const pointsMesh = new THREE.Points(geometry, pointsMaterial);
  const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);

  group.add(pointsMesh);
  group.add(wireframeMesh);

  // BACKGROUND PARTICLES
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 200;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 800;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
      color: 0x4F46E5,
      size: 3,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  group.add(particlesMesh);

  // MOUSE TRACKING
  let mouseX = 0;
  let mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
  });

  // ANIMATE
  const animate = () => {
      requestAnimationFrame(animate);

      const targetRotationX = mouseY * 0.0005;
      const targetRotationY = mouseX * 0.0005;

      group.rotation.y += 0.003 + (targetRotationY - group.rotation.y) * 0.05;
      group.rotation.x += 0.001 + (targetRotationX - group.rotation.x) * 0.05;

      particlesMesh.rotation.y -= 0.001;

      // Pulse effect
      const time = Date.now() * 0.001;
      const scale = 1 + Math.sin(time) * 0.03;
      pointsMesh.scale.set(scale, scale, scale);
      wireframeMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
  };

  animate();

  window.addEventListener('resize', () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

/* =========================================
 3. QUIZ LOGIC
 ========================================= */
function initQuiz() {
  const quizBox = document.getElementById('quiz-box');
  const startBtn = document.getElementById('start-quiz');

  if (!quizBox || !startBtn) return;

  const questions = [
      {
          text: "Какая цель вашего проекта?",
          options: ["Автоматизация поддержки", "Рост продаж", "Обучение сотрудников", "Личный помощник"]
      },
      {
          text: "Какой объем аудитории планируется?",
          options: ["До 1,000 пользователей", "1,000 - 50,000", "Более 100,000", "Внутреннее ПО"]
      },
      {
          text: "Есть ли у вас опыт работы с AI?",
          options: ["Нет, нужен полный цикл", "Есть базовые знания", "Есть команда разработчиков", "Ищу готовое решение"]
      }
  ];

  let currentStep = 0;

  function renderQuestion(index) {
      quizBox.innerHTML = '';

      const qTitle = document.createElement('h3');
      qTitle.className = 'quiz__question';
      qTitle.innerText = `${index + 1}. ${questions[index].text}`;

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'quiz__options';

      questions[index].options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'quiz-btn';
          btn.innerText = opt;
          btn.onclick = () => nextStep();
          optionsDiv.appendChild(btn);
      });

      quizBox.appendChild(qTitle);
      quizBox.appendChild(optionsDiv);
  }

  function nextStep() {
      currentStep++;

      if (currentStep < questions.length) {
          quizBox.style.opacity = 0;
          setTimeout(() => {
              renderQuestion(currentStep);
              quizBox.style.opacity = 1;
          }, 300);
      } else {
          showResult();
      }
  }

  function showResult() {
      quizBox.innerHTML = `
          <div style="text-align: center;">
              <i class="fa-solid fa-check-circle" style="font-size: 3rem; color: #2DD4BF; margin-bottom: 20px;"></i>
              <h3 style="font-size: 1.5rem; margin-bottom: 15px; color: #fff;">Отличные перспективы!</h3>
              <p style="margin-bottom: 25px; color: rgba(255,255,255,0.8);">
                  Ваш проект идеально подходит для внедрения архитектуры Zephyr-Vista.
                  Мы подготовили для вас персональную стратегию.
              </p>
              <a href="#contact" class="btn btn--primary">Получить стратегию бесплатно</a>
          </div>
      `;
  }

  startBtn.addEventListener('click', () => {
      renderQuestion(0);
  });
}

/* =========================================
 4. CONTACT FORM & VALIDATION
 ========================================= */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const phoneInput = document.getElementById('phone');
  const captchaInput = document.getElementById('captcha');
  const captchaQuestion = document.getElementById('captcha-question');
  const successMsg = document.getElementById('form-success');

  // 1. Phone Validation: Digits only
  phoneInput.addEventListener('input', function(e) {
      this.value = this.value.replace(/\D/g, ''); // Удаляет всё, кроме цифр
  });

  // 2. Math Captcha Simulation
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const captchaResult = num1 + num2;

  if (captchaQuestion) {
      captchaQuestion.innerText = `${num1} + ${num2}`;
  }

  // 3. Form Submission
  form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      const formGroups = form.querySelectorAll('.form-group');
      formGroups.forEach(group => group.classList.remove('error'));

      // Basic fields check (HTML5 required handles basic empty check, but let's add class)
      const inputs = form.querySelectorAll('input[required]');
      inputs.forEach(input => {
          if (!input.value.trim()) {
              input.closest('.form-group').classList.add('error');
              isValid = false;
          }
      });

      // Email regex check
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value && !emailRegex.test(email.value)) {
          email.closest('.form-group').classList.add('error');
          isValid = false;
      }

      // Captcha Check
      if (parseInt(captchaInput.value) !== captchaResult) {
          captchaInput.closest('.form-group').classList.add('error');
          isValid = false;
      }

      if (isValid) {
          const btn = form.querySelector('button[type="submit"]');
          const originalText = btn.innerText;

          // Loading State
          btn.disabled = true;
          btn.innerText = 'Отправка...';

          // Simulate AJAX
          setTimeout(() => {
              successMsg.classList.add('active');
              form.reset();
              btn.disabled = false;
              btn.innerText = originalText;

              // Note: We do NOT hide the message automatically, as requested
              // "Никаких багов с автопоявлением сообщения" - оно остается висеть
          }, 2000);
      }
  });
}

/* =========================================
 5. COOKIE POPUP
 ========================================= */
function initCookiePopup() {
  const popup = document.getElementById('cookie-popup');
  const acceptBtn = document.getElementById('cookie-accept');

  if (!popup || !acceptBtn) return;

  // Check localStorage
  if (!localStorage.getItem('zephyrCookieAccepted')) {
      // Show with slight delay
      setTimeout(() => {
          popup.style.display = 'flex';
      }, 2000);
  }

  acceptBtn.addEventListener('click', () => {
      localStorage.setItem('zephyrCookieAccepted', 'true');
      popup.style.display = 'none';
  });
}
