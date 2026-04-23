/* =========================================
   NAYARA LEAL ARQUITETURA — JavaScript
   ========================================= */

// Esta função em volta de tudo é como uma "bolha de segurança". 
// Ela garante que o seu código não se misture nem cause erro com outros códigos externos.
(function () {
  'use strict'; // O 'use strict' avisa ao navegador para ser rigoroso, evitando erros comuns de digitação.

  /* --- 1. BARRA DE NAVEGAÇÃO: Sombra ao rolar + Link Ativo --- */
  
  // 'const' cria uma "caixa" (variável) que guarda um elemento que não vai mudar.
  // 'document.getElementById' busca um elemento no HTML pelo ID dele.
  const navbar  = document.getElementById('navbar');
  
  // 'querySelectorAll' busca todos os elementos que usam uma certa etiqueta ou classe.
  const sections = document.querySelectorAll('section[id]'); // Pega todas as seções que têm ID.
  const navLinks = document.querySelectorAll('.nav__links a'); // Pega todos os links do menu.

  // Esta é uma função: um conjunto de instruções que demos o nome de 'onScroll'.
  function onScroll() {
    
    // --- Efeito de Sombra no Menu ---
    // 'window.scrollY' mede quantos pixels você rolou a página para baixo.
    if (window.scrollY > 40) {
      // Se rolou mais de 40px, adiciona a classe 'scrolled' (que tem sombra no CSS).
      navbar.classList.add('scrolled');
    } else {
      // Se voltou ao topo, remove a sombra.
      navbar.classList.remove('scrolled');
    }

    // --- Destacar o link onde o usuário está navegando ---
    let current = ''; // Criamos uma caixa vazia chamada 'current' (atual).

    sections.forEach(section => {
      // 'offsetTop' é a posição da seção no topo da página.
      const sectionTop = section.offsetTop - 100;
      // Se o scroll do usuário passou do topo da seção, a seção atual é essa.
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      // Remove a cor de destaque de todos os links...
      link.classList.remove('active');
      // ...e coloca apenas no link que corresponde à seção onde o usuário está.
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // 'addEventListener' é como um vigia. Ele fica ouvindo o 'scroll' (rolagem).
  // Quando o usuário rola, ele executa a função 'onScroll'.
  window.addEventListener('scroll', onScroll, { passive: true });


  /* --- 2. MENU CELULAR (HAMBÚRGUER) --- */
  
  const toggle   = document.getElementById('navToggle'); // O botão de 3 risquinhos.
  const navMenu  = document.getElementById('navLinks');  // A lista de links.

  // Quando o usuário clicar no botão do menu...
  toggle.addEventListener('click', () => {
    // 'toggle' aqui funciona como um interruptor de luz (liga/desliga a classe 'open').
    const isOpen = navMenu.classList.toggle('open');
    // Avisa aos leitores de tela para cegos se o menu está aberto ou fechado.
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Fecha o menu automaticamente se o usuário clicar em qualquer link (para ir a uma seção).
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });


  /* --- 3. ANIMAÇÃO DE SURGIR (FADE-IN) --- */
  
  // Selecionamos todos os elementos que queremos que "apareçam" suavemente ao rolar.
  const fadeEls = document.querySelectorAll(
    '.project-card, .service-item, .about__img-col, .about__content, .contact__inner'
  );

  // Antes de começarem a aparecer, nós os deixamos invisíveis e um pouco abaixo da posição original.
  fadeEls.forEach(el => {
    el.style.opacity = '0'; // Invisível
    el.style.transform = 'translateY(28px)'; // 28 pixels para baixo
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease'; // Tempo da animação
  });

  // O 'IntersectionObserver' é um "olho" que observa se o elemento apareceu na tela do usuário.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Se o elemento estiver visível na tela...
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'; // Fica visível
        entry.target.style.transform = 'translateY(0)'; // Volta para a posição original (sobe)
        // Depois que animou uma vez, para de observar para economizar memória.
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 }); // O elemento precisa estar 12% visível para a animação começar.

  // Manda o "olho" observar cada um dos elementos da nossa lista.
  fadeEls.forEach(el => observer.observe(el));


  /* --- 4. FORMULÁRIO DE CONTATO: Feedback Visual --- */
  
  const form = document.querySelector('.contact__form');
  
  // Se existir um formulário na página...
  if (form) {
    // Quando o usuário clicar no botão de enviar (submit)...
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Impede a página de recarregar (comportamento padrão chato).
      
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent; // Guarda o texto original "Enviar Solicitação".

      // Muda o botão para dar um retorno visual ao usuário.
      btn.textContent = 'Enviando...';
      btn.disabled = true; // Desativa o botão para o usuário não clicar mil vezes.

      try {
        // 'fetch' envia os dados para o Formspree (ou outro serviço) de forma invisível.
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        // Se o envio deu certo (status ok)...
        if (res.ok) {
          btn.textContent = '✓ Mensagem enviada!';
          btn.style.background = '#2e7d32'; // Muda para verde.
          form.reset(); // Limpa os campos do formulário.
        } else {
          throw new Error(); // Se não deu ok, pula para o erro (catch).
        }
      } catch {
        // Se a internet cair ou der erro no servidor...
        btn.textContent = 'Erro — tente novamente';
        btn.style.background = '#c62828'; // Muda para vermelho.
      } finally {
        // Depois de 4 segundos (4000 milissegundos), volta o botão ao estado normal.
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }
    });
  }

})(); // Fim da "bolha de segurança".

/* 
   RESUMO PARA INICIANTES:
   - Variáveis (const/let): Guardam elementos do HTML.
   - Eventos (addEventListener): Esperam uma ação (clique, scroll).
   - ClassList (add/remove/toggle): Muda o visual do HTML usando o CSS.
   - Functions: São "receitas de bolo" que o computador segue quando chamamos.
*/