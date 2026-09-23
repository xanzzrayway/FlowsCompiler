// functions/api/build.js
// Endpoint: POST /api/build
// Menerima data form dari frontend, commit payload (html/zip/icon) ke repo GitHub
// bila perlu, lalu memicu workflow_dispatch untuk build APK.
//
// Environment variables yang WAJIB diset di Cloudflare Pages -> Settings -> Environment variables:
//   GITHUB_TOKEN  = fine-grained PAT dengan permission Contents (read/write) + Actions (read/write)
//   GITHUB_OWNER  = username/organisasi GitHub, mis. "bidzqwerty"
//   GITHUB_REPO   = nama repo, mis. "flows-compiler"
//   GITHUB_BRANCH = branch default, mis. "main" (opsional, default "main")

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const {
      appName,
      appId,
      versionName,
      sourceType,   // 'link' | 'html' | 'zip'
      sourceValue,  // URL string, atau base64 (data URL atau base64 murni)
      iconBase64,   // opsional, base64 gambar
      permissions,  // array string, mis. ['INTERNET','SYSTEM_ALERT_WINDOW']
    } = body;

    if (!appName || !appId || !sourceType || !sourceValue) {
      return json({ error: 'Data tidak lengkap: appName, appId, sourceType, sourceValue wajib diisi.' }, 400);
    }
    if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(appId)) {
      return json({ error: 'Format package name tidak valid. Contoh: com.namakamu.aplikasi' }, 400);
    }

    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const token = env.GITHUB_TOKEN;
    const branch = env.GITHUB_BRANCH || 'main';

    if (!owner || !repo || !token) {
      return json({ error: 'Server belum dikonfigurasi (GITHUB_OWNER/GITHUB_REPO/GITHUB_TOKEN belum diset).' }, 500);
    }

    const buildId = crypto.randomUUID().slice(0, 8);
    const ghHeaders = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'flows-compiler',
      'Content-Type': 'application/json',
    };

    let sourceRef = sourceValue;
    let iconRef = '';

    if (sourceType === 'html' || sourceType === 'zip') {
      const ext = sourceType === 'html' ? 'html' : 'zip';
      const path = `payload/${buildId}/site.${ext}`;
      await putFile({ owner, repo, branch, ghHeaders, path, contentBase64: sourceValue });
      sourceRef = path;
    } else if (sourceType !== 'link') {
      return json({ error: 'sourceType harus salah satu: link, html, zip' }, 400);
    }

    if (iconBase64) {
      const path = `payload/${buildId}/icon.png`;
      await putFile({ owner, repo, branch, ghHeaders, path, contentBase64: iconBase64 });
      iconRef = path;
    }

    const dispatchRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/build-apk.yml/dispatches`,
      {
        method: 'POST',
        headers: ghHeaders,
        body: JSON.stringify({
          ref: branch,
          inputs: {
            build_id: buildId,
            app_name: appName,
            app_id: appId,
            version_name: versionName || '1.0.0',
            source_type: sourceType,
            source_ref: sourceRef,
            icon_ref: iconRef,
            permissions_csv: (permissions && permissions.length ? permissions : ['INTERNET']).join(','),
          },
        }),
      }
    );

    if (!dispatchRes.ok) {
      const errText = await dispatchRes.text();
      return json({ error: 'Gagal memicu GitHub Actions.', detail: errText }, 502);
    }

    return json({ buildId });
  } catch (err) {
    return json({ error: err.message || 'Terjadi kesalahan tak terduga.' }, 500);
  }
}

async function putFile({ owner, repo, branch, ghHeaders, path, contentBase64 }) {
  const cleanBase64 = contentBase64.includes(',') ? contentBase64.split(',')[1] : contentBase64;
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: ghHeaders,
    body: JSON.stringify({
      message: `chore: tambah payload ${path}`,
      content: cleanBase64,
      branch,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gagal upload ${path}: ${errText}`);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
