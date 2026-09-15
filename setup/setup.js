'use strict';

(function () {
  const scriptSource = document.getElementById('script-source');
  const copyStatus = document.getElementById('copy-status');
  const linkStatus = document.getElementById('link-status');
  const formUrlInput = document.getElementById('form-url');
  const configResult = document.getElementById('config-result');
  const configLine = document.getElementById('config-line');
  const script = window.HELLO_TEETH_FORM_SCRIPT || '';
  scriptSource.value = script;

  function showStatus(element, text, isError) {
    element.textContent = text;
    element.classList.toggle('error', Boolean(isError));
  }

  async function copyText(text, source, status, successMessage) {
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      showStatus(status, successMessage, false);
    } catch (_) {
      if (source === scriptSource) document.getElementById('script-details').open = true;
      source.focus();
      source.select();
      showStatus(status, 'Text selected. Press Ctrl+C (or Command+C on Mac) to copy it.', false);
    }
  }

  document.getElementById('copy-script').addEventListener('click', function () {
    if (!script) {
      showStatus(copyStatus, 'The script could not load. Download the .gs file and open it in a text editor.', true);
      return;
    }
    copyText(script, scriptSource, copyStatus, 'Copied. Paste it into Code.gs in your Google Apps Script project.');
  });

  document.getElementById('link-helper').addEventListener('submit', function (event) {
    event.preventDefault();
    configResult.hidden = true;
    let url;
    try {
      url = new URL(formUrlInput.value.trim());
      const validPath = /^\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]+\/viewform\/?$/;
      if (url.protocol !== 'https:' || url.hostname !== 'docs.google.com' || url.username || url.password || url.port || !validPath.test(url.pathname)) {
        throw new Error('Not a public Google Form URL');
      }
    } catch (_) {
      formUrlInput.setAttribute('aria-invalid', 'true');
      showStatus(linkStatus, 'Paste the full public Google Form URL ending in /viewform. Editor links, spreadsheet links, and short links cannot be used here.', true);
      formUrlInput.focus();
      return;
    }

    formUrlInput.removeAttribute('aria-invalid');
    const publicUrl = url.origin + url.pathname.replace(/\/$/, '');
    configLine.value = 'googleFormUrl: "' + publicUrl + '",';
    document.getElementById('preview-form').href = publicUrl;
    configResult.hidden = false;
    showStatus(linkStatus, 'Setting prepared. Copy it into clinic-config.js. This checks the link format; use “Open your form” to verify access.', false);
    configLine.focus();
    configLine.select();
  });

  formUrlInput.addEventListener('input', function () {
    formUrlInput.removeAttribute('aria-invalid');
    configResult.hidden = true;
    showStatus(linkStatus, '', false);
  });

  document.getElementById('copy-config').addEventListener('click', function () {
    copyText(configLine.value, configLine, linkStatus, 'Copied. Replace the googleFormUrl line in clinic-config.js, then save and refresh your website.');
  });
})();
