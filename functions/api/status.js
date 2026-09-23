// functions/api/status.js
// Endpoint: GET /api/status?buildId=xxxxx
// Mengecek status workflow run di GitHub Actions dan, jika sukses,
// mengembalikan link download APK dari GitHub Release.

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const buildId = url.searchParams.get('buildId');
  if (!buildId) return json({ error: 'Parameter buildId wajib diisi.' }, 400);

  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const token = env.GITHUB_TOKEN;

  const ghHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'flows-compiler',
  };

  const runsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/build-apk.yml/runs?per_page=20&_=${Date.now()}`,
    { headers: ghHeaders, cache: 'no-store' }
  );
  if (!runsRes.ok) return json({ error: 'Gagal mengambil daftar run dari GitHub.' }, 502);

  const runsData = await runsRes.json();
  const run = (runsData.workflow_runs || []).find(r => r.name === `Build-${buildId}`);

  if (!run) {
    return json({ status: 'queued', message: 'Menunggu run terdeteksi di GitHub Actions...' });
  }

  const result = {
    status: run.status,          // queued | in_progress | completed
    conclusion: run.conclusion,  // success | failure | cancelled | null
    runUrl: run.html_url,
  };

  if (run.status !== 'completed') {
    const jobsRes = await fetch(`${run.jobs_url}?_=${Date.now()}`, { headers: ghHeaders, cache: 'no-store' });
    if (jobsRes.ok) {
      const jobsData = await jobsRes.json();
      const steps = jobsData.jobs?.[0]?.steps || [];
      const running = steps.find(s => s.status === 'in_progress');
      const lastDone = [...steps].reverse().find(s => s.status === 'completed');
      result.currentStep = running?.name || lastDone?.name || 'Menunggu runner...';
    }
  }

  if (run.status === 'completed' && run.conclusion === 'success') {
    // Ambil dari daftar releases (bukan lookup tag tunggal) — pada sebagian kasus
    // endpoint /releases/tags/{tag} lebih lambat sinkron dibanding /releases biasa
    // segera setelah asset baru saja di-upload.
    const releasesRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10&_=${Date.now()}`,
      { headers: ghHeaders, cache: 'no-store' }
    );
    if (releasesRes.ok) {
      const releasesData = await releasesRes.json();
      const releaseData = (releasesData || []).find(r => r.tag_name === `build-${buildId}`);
      if (!releaseData) {
        result.debug = `Release build-${buildId} belum muncul di daftar releases.`;
      } else {
        const hasApk = (releaseData.assets || []).some(a => a.name.endsWith('.apk'));
        if (hasApk) {
          // Arahkan ke proxy /api/download milik kita sendiri, BUKAN url github.com,
          // supaya user tidak pernah pindah domain saat download.
          result.downloadUrl = `/api/download?buildId=${buildId}`;
        } else {
          result.debug = `Release ada, tapi 0 asset .apk (assets: ${(releaseData.assets || []).map(a => a.name).join(', ') || 'kosong'})`;
        }
      }
    } else {
      const errText = await releasesRes.text().catch(() => '');
      result.debug = `Gagal fetch daftar release (HTTP ${releasesRes.status}): ${errText.slice(0, 200)}`;
    }
  }

  return json(result);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
