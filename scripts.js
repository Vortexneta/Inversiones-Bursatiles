const copyEmailLinks = document.querySelectorAll('.copy-email');
const copyNotice = document.querySelector('.copy-notice');
let noticeTimeout;

function showCopyNotice() {
  copyNotice.classList.add('visible');
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => {
    copyNotice.classList.remove('visible');
  }, 1800);
}

function copyWithFallback(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand('copy');
  textArea.remove();
  return copied;
}

copyEmailLinks.forEach((link) => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const email = link.dataset.email;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else if (!copyWithFallback(email)) {
        return;
      }
      showCopyNotice();
    } catch {
      if (copyWithFallback(email)) {
        showCopyNotice();
      }
    }
  });
});