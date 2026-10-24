// functions/api/download.js
// Endpoint: GET /api/download?buildId=xxxxx
// Mem-proxy file APK dari GitHub Release lewat server (pakai GITHUB_TOKEN),
// jadi user download langsung dari domain Cloudflare Pages kamu sendiri,
// TIDAK pernah diarahkan/redirect ke halaman github.com.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const buildId = url.searchParams.get('buildId');
  if (!buildId) return new Response('Parameter buildId wajib diisi.', { status: 400 });

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const token = env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    return new Response('Server belum dikonfigurasi.', { status: 500 });
  }

  const ghHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'flows-compiler',
  };

  const releaseRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/tags/build-${buildId}`,
    { headers: ghHeaders }
  );
  if (!releaseRes.ok) {
    return new Response('Release untuk build ini tidak ditemukan.', { status: 404 });
  }
  const releaseData = await releaseRes.json();
  const asset = (releaseData.assets || []).find(a => a.name.endsWith('.apk'));
  if (!asset) {
    return new Response('File APK tidak ditemukan di release ini.', { status: 404 });
  }

  // Ambil file mentahnya lewat GitHub Assets API (butuh Accept: application/octet-stream),
  // supaya file-nya di-stream langsung dari server kita, bukan lewat redirect browser.
  const assetRes = await fetch(asset.url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/octet-stream',
      'User-Agent': 'flows-compiler',
    },
  });

  if (!assetRes.ok) {
    return new Response('Gagal mengambil file APK dari GitHub.', { status: 502 });
  }

  const safeName = (asset.name || 'app-release.apk').replace(/[^a-zA-Z0-9._-]/g, '_');

  return new Response(assetRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': `attachment; filename="${safeName}"`,
      ...(asset.size ? { 'Content-Length': String(asset.size) } : {}),
    },
  });
}
