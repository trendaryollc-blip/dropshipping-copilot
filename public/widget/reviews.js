(function () {
  var el = document.getElementById('dropease-reviews');
  if (!el) return;
  var productId = el.getAttribute('data-product') || 'all';
  var theme = el.getAttribute('data-theme') || 'light';
  el.innerHTML = '<div style="font-family:system-ui;padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:' +
    (theme === 'dark' ? '#1f2937;color:#f9fafb' : '#fff;color:#111') +
    '"><strong>DropEase Reviews</strong><p style="margin:8px 0 0;font-size:14px">★★★★★ 4.8 average · Product: ' +
    productId + '</p></div>';
})();
