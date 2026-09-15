(() => {
  'use strict';
  const dialog = document.createElement('dialog');
  dialog.id = 'dental-chat';
  dialog.className = 'dental-chat';
  dialog.setAttribute('aria-labelledby', 'chat-title');
  dialog.innerHTML = `<header class="chat-header"><span class="chat-avatar" aria-hidden="true">✳</span><div><h2 id="chat-title">Hello, smile.</h2><p>Hello Teeth · automated dental guide</p></div><button type="button" class="chat-close" aria-label="Close dental chat">×</button></header><p class="chat-disclosure">General information, not diagnosis or live staff chat. Messages stay on this page and are not sent to the clinic.</p><div class="chat-log" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions"></div><div class="chat-topics" aria-label="Suggested questions"></div><form class="chat-composer"><label for="chat-question" class="sr-only">Your dental question</label><input id="chat-question" name="question" maxlength="600" autocomplete="off" placeholder="Ask about your smile…" required><button type="submit" aria-label="Send question">↑</button></form><div class="chat-bottom"><button type="button" class="chat-reset">Clear chat</button><a href="contact">Contact the clinic ↗</a></div>`;
  document.body.append(dialog);
  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'chat-launcher';
  launcher.setAttribute('aria-label', 'Open dental help chat');
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-controls', 'dental-chat');
  launcher.innerHTML = '<span aria-hidden="true">✳</span> Smile help';
  document.body.append(launcher);
  const log = dialog.querySelector('.chat-log');
  const input = dialog.querySelector('input');
  const topics = dialog.querySelector('.chat-topics');
  const guide = window.DentalConversations.create(window.CLINIC_CONFIG || {});
  const browser = document.createElement('details');
  browser.className = 'chat-question-browser';
  browser.innerHTML = '<summary>Browse common questions</summary><label for="chat-category">Choose a topic</label><select id="chat-category"><option value="">Select a topic</option></select><label for="chat-library-question">Choose a question</label><select id="chat-library-question" disabled><option value="">Select a topic first</option></select>';
  dialog.querySelector('.chat-disclosure').after(browser);
  const categorySelect = browser.querySelector('#chat-category');
  const questionSelect = browser.querySelector('#chat-library-question');
  window.DentalConversations.groups.forEach(group => categorySelect.add(new Option(group.name,group.name)));
  categorySelect.addEventListener('change', () => {
    const group = window.DentalConversations.groups.find(group => group.name === categorySelect.value);
    questionSelect.replaceChildren(new Option(group ? 'Select a question' : 'Select a topic first',''));
    questionSelect.disabled = !group;
    if (group) group.questions.forEach(question => questionSelect.add(new Option(question,question)));
  });
  questionSelect.addEventListener('change', () => {
    if (!questionSelect.value) return;
    guide.selectCategory(categorySelect.value);
    send(questionSelect.value); questionSelect.value = ''; browser.open = false;
  });
  let returnFocus;
  function append(role, message, links = []) {
    const bubble = document.createElement('div');
    bubble.className = `chat-message chat-${role}`;
    const label = document.createElement('span');
    label.className = 'chat-speaker';
    label.textContent = role === 'user' ? 'You' : 'Smile guide';
    const text = document.createElement('p');
    text.textContent = message;
    bubble.append(label, text);
    links.forEach(([name, href]) => {
      const link = document.createElement('a');
      link.textContent = name + ' ↗';
      link.href = href;
      if (href.startsWith('https://')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      bubble.append(link);
    });
    log.append(bubble);
    while (log.children.length > 60) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
  function suggestions(labels) {
    topics.replaceChildren();
    labels.forEach(label => {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = label;
      button.addEventListener('click', () => send(label));
      topics.append(button);
    });
  }
  const defaultTopics = window.DentalConversations.home;
  function reset() {
    guide.reset(); log.replaceChildren(); input.value = ''; browser.open = false;
    categorySelect.value = ''; questionSelect.replaceChildren(new Option('Select a topic first','')); questionSelect.disabled = true;
    append('bot', 'Hello! How can I help you? If you’d like to contact the doctor, please fill out the contact form.', [['Open contact form', 'contact']]);
    suggestions(defaultTopics);
  }
  function send(value) {
    const question = value.trim().slice(0, 600);
    if (!question) return;
    input.value = '';
    if (question === 'Start over') { reset(); input.focus(); return; }
    append('user', question);
    const {message, links, choices} = guide.answer(question);
    append('bot', message, links); suggestions(choices); input.focus();
  }
  function open(event) {
    event?.preventDefault();
    if (dialog.open) return;
    returnFocus = document.activeElement;
    dialog.showModal(); document.body.classList.add('dental-chat-open');
    input.focus(); log.scrollTop = log.scrollHeight;
  }
  launcher.addEventListener('click', open);
  document.querySelectorAll('[data-open-chat]').forEach(button => button.addEventListener('click', open));
  dialog.querySelector('.chat-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('dental-chat-open'); returnFocus?.focus(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.querySelector('form').addEventListener('submit', event => { event.preventDefault(); send(input.value); });
  dialog.querySelector('.chat-reset').addEventListener('click', () => { reset(); input.focus(); });
  reset();
})();
