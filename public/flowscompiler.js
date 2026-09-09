        // ---- KONFIGURASI SUPABASE ----
        // Ganti 2 nilai ini dengan punya project Supabase kamu sendiri
        // (Project Settings -> API -> Project URL & anon public key).
        // anon key ini AMAN ditaruh di frontend selama Row Level Security (RLS)
        // sudah di-setup lewat SQL yang ada di README.md.
        const SUPABASE_URL = 'https://tywzbgszztnzjwlbirim.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5d3piZ3N6enRuemp3bGJpcmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NTIzNTEsImV4cCI6MjEwNDQyODM1MX0.jdwR1qA_ibGfOYt9hkfRCqqakT0qqzPKkYr3HFO4CLQ';

        const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const DAILY_LIMIT = 2;

        // --- BAHASA / TERJEMAHAN (i18n) ---
        // Catatan: terjemahan lengkap cuma disiapkan untuk Indonesia (id) dan English (en).
        // Negara lain di popup pilihan bahasa dipetakan ke English, bukan bahasa aslinya masing-masing,
        // karena menerjemahkan akurat ke puluhan bahasa sekaligus nggak realistis dilakukan otomatis.
        const LANG_KEY = 'flows_compiler_lang';

        const translations = {
            id: {
                login_title: 'Login Ke Flows Compiler',
                login_subtitle: 'Mulai kompilasi link dan file HTML lu jadi APK dengan mudah',
                login_google_btn: 'Login Dengan Google',
                tagline: 'Compile Link/file ke Apk',
                label_app_name: 'Nama Aplikasi',
                ph_app_name: 'Contoh: Aplikasi Keren Gue',
                label_package_name: 'Nama Package',
                label_version: 'Versi Aplikasi',
                label_source: 'Sumber Konten',
                label_daily_limit: 'Limit Harian',
                limit_saved_note: 'Tersimpan di akun Google kamu',
                label_icon: 'Ikon Aplikasi',
                label_log: 'Log Output',
                history_title: 'Riwayat Compile',
                build_btn_idle: 'Build Aplikasi',
                build_btn_loading: 'Sedang Build...',
                history_empty: 'Belum ada riwayat compile.',
                status_success: 'Sukses',
                status_failed: 'Gagal',
                status_progress: 'Proses...',
                action_download: 'Unduh',
                action_recheck: 'Cek Ulang',
                action_check_status: 'Cek Status',
                err_not_logged_in: 'Kamu belum login.',
                err_usage_not_ready: 'Data limit belum siap, coba lagi sebentar.',
                err_daily_limit_reached: 'Limit compile harian kamu sudah habis. Coba lagi besok.',
                err_name_package_required: 'Nama aplikasi dan Nama Package wajib diisi.',
                err_package_format: 'Format package name salah. Contoh benar: com.namakamu.aplikasi',
                err_url_required: 'URL wajib diisi untuk mode Link.',
                err_html_required: 'File index.html wajib diupload untuk mode File Html.',
                err_zip_required: 'File project.zip wajib diupload untuk mode Zip.',
            },
            en: {
                login_title: 'Login to Flows Compiler',
                login_subtitle: 'Start compiling your link or HTML file into an APK easily',
                login_google_btn: 'Sign in with Google',
                tagline: 'Compile Link/file to APK',
                label_app_name: 'App Name',
                ph_app_name: 'Example: My Cool App',
                label_package_name: 'Package Name',
                label_version: 'App Version',
                label_source: 'Content Source',
                label_daily_limit: 'Daily Limit',
                limit_saved_note: 'Saved to your Google account',
                label_icon: 'App Icon',
                label_log: 'Log Output',
                history_title: 'Build History',
                build_btn_idle: 'Build App',
                build_btn_loading: 'Building...',
                history_empty: 'No build history yet.',
                status_success: 'Success',
                status_failed: 'Failed',
                status_progress: 'In progress...',
                action_download: 'Download',
                action_recheck: 'Recheck',
                action_check_status: 'Check Status',
                err_not_logged_in: 'You are not logged in.',
                err_usage_not_ready: 'Usage data is not ready yet, please try again shortly.',
                err_daily_limit_reached: 'Your daily compile limit is used up. Try again tomorrow.',
                err_name_package_required: 'App Name and Package Name are required.',
                err_package_format: 'Invalid package name format. Correct example: com.yourname.app',
                err_url_required: 'URL is required for Link mode.',
                err_html_required: 'An index.html file is required for File Html mode.',
                err_zip_required: 'A project.zip file is required for Zip mode.',
            },
        };

        let currentLang = localStorage.getItem(LANG_KEY) || 'id';

        function t(key) {
            return (translations[currentLang] && translations[currentLang][key])
                || translations.id[key]
                || key;
        }

        function applyLanguage() {
            document.documentElement.lang = currentLang;

            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                el.textContent = t(key);
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                el.setAttribute('placeholder', t(key));
            });

            // Elemen yang isinya di-generate JS (bukan data-i18n statis) perlu di-refresh manual
            const buildBtn = document.getElementById('build-btn');
            if (buildBtn && !buildBtn.disabled) {
                buildBtn.innerHTML = `<i class="fa-solid fa-hammer"></i> ${t('build_btn_idle')}`;
            }
            renderHistory();
        }

        function setLanguage(code, flag) {
            currentLang = code;
            localStorage.setItem(LANG_KEY, code);
            document.getElementById('lang-current-flag').innerText = flag;
            localStorage.setItem('flows_compiler_lang_flag', flag);
            applyLanguage();
            closeLangModal();
        }

        function toggleLangModal() {
            document.getElementById('lang-modal').classList.toggle('hidden');
        }

        function closeLangModal() {
            document.getElementById('lang-modal').classList.add('hidden');
        }

        document.addEventListener('click', (e) => {
            const modal = document.getElementById('lang-modal');
            const trigger = document.getElementById('lang-trigger-btn');
            if (!modal || modal.classList.contains('hidden')) return;
            if (!modal.contains(e.target) && !trigger.contains(e.target)) {
                closeLangModal();
            }
        });

        let currentUser = null;   // { id, email, name }
        let currentUsage = null;  // row tabel usage: { today_count, usage_date, daily_limit }

        // --- LOGIN GOOGLE (via Supabase Auth) ---

        async function loginWithGoogle() {
            const btn = document.getElementById('google-login-btn');
            if (btn) {
                btn.disabled = true;
                btn.classList.add('opacity-60');
            }
            const { error } = await sb.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin + window.location.pathname },
            });
            if (error) {
                alert('Gagal login Google: ' + error.message);
                if (btn) {
                    btn.disabled = false;
                    btn.classList.remove('opacity-60');
                }
            }
            // Kalau sukses, browser akan redirect ke Google lalu balik lagi ke sini;
            // sisanya ditangani onAuthStateChange di initAuth().
        }

        async function logoutSession() {
            await sb.auth.signOut();
            currentUser = null;
            currentUsage = null;
            showLoginScreen();
        }

        function showLoginScreen() {
            document.getElementById('screen-login').classList.remove('hidden');
            document.getElementById('screen-compiler').classList.add('hidden');
        }

        function showCompilerScreen() {
            document.getElementById('screen-login').classList.add('hidden');
            document.getElementById('screen-compiler').classList.remove('hidden');
        }

        async function onLoggedIn(session) {
            const user = session.user;
            currentUser = {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name || (user.email ? user.email.split('@')[0] : 'User'),
            };
            document.getElementById('user-display-name').innerText = currentUser.name;

            await ensureUsageRow();
            refreshLimitDisplay();
            showCompilerScreen();
        }

        async function initAuth() {
            const { data: { session } } = await sb.auth.getSession();
            if (session) {
                await onLoggedIn(session);
            } else {
                showLoginScreen();
            }

            sb.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    await onLoggedIn(session);
                } else if (event === 'SIGNED_OUT') {
                    currentUser = null;
                    currentUsage = null;
                    showLoginScreen();
                }
            });
        }

        // --- LIMIT ASLI, TERSIMPAN DI SUPABASE (per akun Google, bukan per HP) ---

        function todayStr() {
            return new Date().toISOString().slice(0, 10);
        }

        async function ensureUsageRow() {
            const { data, error } = await sb
                .from('usage')
                .select('*')
                .eq('user_id', currentUser.id)
                .maybeSingle();

            if (error) {
                console.error('Gagal ambil data limit:', error.message);
                currentUsage = { today_count: 0, usage_date: todayStr(), daily_limit: DAILY_LIMIT };
                return;
            }

            if (!data) {
                const { data: inserted, error: insErr } = await sb
                    .from('usage')
                    .insert({ user_id: currentUser.id, email: currentUser.email, daily_limit: DAILY_LIMIT, today_count: 0, usage_date: todayStr() })
                    .select()
                    .single();
                currentUsage = insErr ? { today_count: 0, usage_date: todayStr(), daily_limit: DAILY_LIMIT } : inserted;
                return;
            }

            if (data.usage_date !== todayStr()) {
                const { data: updated, error: updErr } = await sb
                    .from('usage')
                    .update({ today_count: 0, usage_date: todayStr() })
                    .eq('user_id', currentUser.id)
                    .select()
                    .single();
                currentUsage = updErr ? data : updated;
                return;
            }

            currentUsage = data;
        }

        function refreshLimitDisplay() {
            if (!currentUsage) return;
            document.getElementById('display-limit').innerText = `${currentUsage.today_count}/${currentUsage.daily_limit} Compile`;
        }

        function canBuildNow() {
            if (!currentUser) return { ok: false, reason: t('err_not_logged_in') };
            if (!currentUsage) return { ok: false, reason: t('err_usage_not_ready') };
            if (currentUsage.today_count >= currentUsage.daily_limit) {
                return { ok: false, reason: t('err_daily_limit_reached') };
            }
            return { ok: true };
        }

        async function consumeBuildQuota() {
            const newCount = currentUsage.today_count + 1;
            const { data, error } = await sb
                .from('usage')
                .update({ today_count: newCount, updated_at: new Date().toISOString() })
                .eq('user_id', currentUser.id)
                .select()
                .single();

            if (!error && data) {
                currentUsage = data;
            } else {
                currentUsage.today_count = newCount;
            }
            refreshLimitDisplay();
        }

        // --- UPLOAD FILE (HTML/ZIP) FEEDBACK ---

        function handleFileSelected(inputEl, type) {
            const file = inputEl.files[0];
            const promptEl = document.getElementById(`${type}-upload-prompt`);
            const selectedEl = document.getElementById(`${type}-upload-selected`);
            const nameEl = document.getElementById(`${type}-file-name`);

            if (file) {
                nameEl.innerText = file.name;
                promptEl.classList.add('hidden');
                selectedEl.classList.remove('hidden');
                selectedEl.classList.add('flex');
            } else {
                promptEl.classList.remove('hidden');
                selectedEl.classList.add('hidden');
                selectedEl.classList.remove('flex');
            }
        }


        // --- COMPILER SCREEN LOGIC ---

        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('text-green-600', 'bg-white', 'shadow-sm');
                btn.classList.add('text-slate-500');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });

            const activeBtn = document.getElementById(`tab-${tab}`);
            activeBtn.classList.remove('text-slate-500');
            activeBtn.classList.add('text-green-600', 'bg-white', 'shadow-sm');

            document.getElementById(`input-${tab}`).classList.remove('hidden');
        }

        function previewIcon(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('upload-prompt').classList.add('hidden');
                    const previewImg = document.getElementById('icon-preview');
                    previewImg.src = e.target.result;
                    document.getElementById('icon-preview-container').classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        }

        // --- INTEGRASI BUILD SUNGGUHAN (GitHub Actions) ---

        let statusInterval = null;
        let currentBuildId = null;

        // -- Permission box --
        function getSelectedPermissions() {
            return Array.from(document.querySelectorAll('#permissions-box .perm-checkbox:checked'))
                .map(cb => cb.dataset.permission);
        }

        function updatePermCount() {
            const el = document.getElementById('perm-count');
            if (el) el.innerText = getSelectedPermissions().length;
        }

        document.addEventListener('DOMContentLoaded', () => {
            const savedFlag = localStorage.getItem('flows_compiler_lang_flag') || '🇮🇩';
            const flagEl = document.getElementById('lang-current-flag');
            if (flagEl) flagEl.innerText = savedFlag;
            applyLanguage();

            initAuth();
            document.querySelectorAll('#permissions-box .perm-checkbox').forEach(cb => {
                cb.addEventListener('change', updatePermCount);
            });
            updatePermCount();
            renderHistory();
        });

        // -- Riwayat Compile (localStorage) --
        const HISTORY_KEY = 'flows_compiler_history';

        function getHistory() {
            try {
                return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            } catch {
                return [];
            }
        }

        function saveHistory(list) {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 30)));
        }

        function addHistoryEntry(entry) {
            const list = getHistory();
            list.unshift(entry);
            saveHistory(list);
            renderHistory();
        }

        function updateHistoryEntry(buildId, patch) {
            const list = getHistory();
            const idx = list.findIndex(e => e.buildId === buildId);
            if (idx !== -1) {
                list[idx] = { ...list[idx], ...patch };
                saveHistory(list);
                renderHistory();
            }
        }

        function openHistoryModal() {
            renderHistory();
            document.getElementById('history-modal').classList.remove('hidden');
        }

        function closeHistoryModal() {
            document.getElementById('history-modal').classList.add('hidden');
        }

        function statusBadge(entry) {
            if (entry.status === 'completed' && entry.conclusion === 'success') {
                return `<span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">${t('status_success')}</span>`;
            }
            if (entry.status === 'completed') {
                return `<span class="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">${t('status_failed')}</span>`;
            }
            return `<span class="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">${t('status_progress')}</span>`;
        }

        function renderHistory() {
            const container = document.getElementById('history-list');
            if (!container) return;
            const list = getHistory();

            if (list.length === 0) {
                container.innerHTML = `<p class="text-xs text-slate-400 text-center py-8">${t('history_empty')}</p>`;
                return;
            }

            container.innerHTML = list.map(entry => {
                const time = new Date(entry.createdAt).toLocaleString(currentLang === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' });
                let actionBtn = '';
                if (entry.status === 'completed' && entry.conclusion === 'success') {
                    actionBtn = `<a href="/api/download?buildId=${entry.buildId}" class="text-[10px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-1"><i class="fa-solid fa-download"></i> ${t('action_download')}</a>`;
                } else if (entry.status === 'completed') {
                    actionBtn = `<button onclick="recheckHistory('${entry.buildId}')" class="text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg">${t('action_recheck')}</button>`;
                } else {
                    actionBtn = `<button onclick="recheckHistory('${entry.buildId}')" class="text-[10px] font-bold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg">${t('action_check_status')}</button>`;
                }
                return `
                <div class="border border-slate-100 rounded-2xl p-3">
                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                            <p class="text-xs font-extrabold text-slate-800 truncate">${entry.appName}</p>
                            <p class="text-[10px] text-slate-400 truncate">${entry.appId} · v${entry.versionName}</p>
                            <p class="text-[9px] text-slate-300 mt-0.5">${time}</p>
                        </div>
                        ${statusBadge(entry)}
                    </div>
                    <div class="mt-2 flex justify-end">${actionBtn}</div>
                </div>`;
            }).join('');
        }

        async function recheckHistory(buildId) {
            try {
                const res = await fetch(`/api/status?buildId=${buildId}`);
                const data = await res.json();
                updateHistoryEntry(buildId, {
                    status: data.status,
                    conclusion: data.conclusion,
                    runUrl: data.runUrl,
                });
            } catch (err) {
                console.error(err);
            }
        }

        function appendLog(text, className) {
            const consoleBox = document.getElementById('log-output');
            const line = document.createElement('div');
            line.className = className || 'text-green-400';
            line.innerText = text;
            consoleBox.appendChild(line);
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }

        function fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result); // data URL, backend akan buang prefix-nya
                reader.onerror = () => reject(new Error('Gagal membaca file ' + file.name));
                reader.readAsDataURL(file);
            });
        }

        function getActiveSourceTab() {
            const activeBtn = document.querySelector('.tab-btn.text-green-600');
            return activeBtn ? activeBtn.id.replace('tab-', '') : 'link';
        }

        function setBuildingState(isBuilding) {
            const btn = document.getElementById('build-btn');
            btn.disabled = isBuilding;
            btn.classList.toggle('opacity-60', isBuilding);
            btn.classList.toggle('cursor-not-allowed', isBuilding);
            btn.innerHTML = isBuilding
                ? `<i class="fa-solid fa-spinner fa-spin"></i> ${t('build_btn_loading')}`
                : `<i class="fa-solid fa-hammer"></i> ${t('build_btn_idle')}`;
        }

        async function startBuild() {
            if (statusInterval) clearInterval(statusInterval);
            const oldBtn = document.getElementById('download-apk-btn');
            if (oldBtn) oldBtn.remove();

            const consoleBox = document.getElementById('log-output');
            consoleBox.innerHTML = '';
            appendLog('[System] Menyiapkan data build...', 'text-green-400');

            const appName = document.getElementById('input-app-name').value.trim();
            const appId = document.getElementById('input-package-name').value.trim();
            const versionName = document.getElementById('input-version').value.trim() || '1.0.0';

            const limitCheck = canBuildNow();
            if (!limitCheck.ok) {
                appendLog(`[Error] ${limitCheck.reason}`, 'text-red-400');
                return;
            }

            if (!appName || !appId) {
                appendLog(`[Error] ${t('err_name_package_required')}`, 'text-red-400');
                return;
            }
            if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(appId)) {
                appendLog(`[Error] ${t('err_package_format')}`, 'text-red-400');
                return;
            }

            const sourceType = getActiveSourceTab();
            let sourceValue = '';

            try {
                if (sourceType === 'link') {
                    sourceValue = document.getElementById('input-link-url').value.trim();
                    if (!sourceValue) throw new Error(t('err_url_required'));
                } else if (sourceType === 'html') {
                    const file = document.getElementById('input-html-file').files[0];
                    if (!file) throw new Error(t('err_html_required'));
                    appendLog('[System] Membaca file HTML...', 'text-green-400');
                    sourceValue = await fileToBase64(file);
                } else if (sourceType === 'zip') {
                    const file = document.getElementById('input-zip-file').files[0];
                    if (!file) throw new Error(t('err_zip_required'));
                    appendLog('[System] Membaca file Zip...', 'text-green-400');
                    sourceValue = await fileToBase64(file);
                }
            } catch (err) {
                appendLog(`[Error] ${err.message}`, 'text-red-400');
                return;
            }

            let iconBase64 = null;
            const iconFile = document.getElementById('icon-input').files[0];
            if (iconFile) {
                appendLog('[System] Membaca ikon aplikasi...', 'text-green-400');
                iconBase64 = await fileToBase64(iconFile);
            }

            const permissions = getSelectedPermissions();

            setBuildingState(true);
            appendLog('[System] Mengirim data ke server build (Cloudflare -> GitHub Actions)...', 'text-green-400');

            let buildId;
            try {
                const res = await fetch('/api/build', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appName, appId, versionName, sourceType, sourceValue, iconBase64, permissions }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Gagal memicu build.');
                buildId = data.buildId;
                currentBuildId = buildId;
                appendLog(`[System] Build dipicu di GitHub Actions. ID: ${buildId}`, 'text-emerald-300');

                await consumeBuildQuota();

                addHistoryEntry({
                    buildId,
                    appName,
                    appId,
                    versionName,
                    sourceType,
                    createdAt: Date.now(),
                    status: 'in_progress',
                    conclusion: null,
                });
            } catch (err) {
                appendLog(`[Error] ${err.message}`, 'text-red-400');
                setBuildingState(false);
                return;
            }

            pollStatus(buildId);
        }

        function pollStatus(buildId) {
            let lastStep = '';
            statusInterval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/status?buildId=${buildId}`);
                    const data = await res.json();

                    if (data.currentStep && data.currentStep !== lastStep) {
                        appendLog(`[Actions] ${data.currentStep}`, 'text-yellow-400');
                        lastStep = data.currentStep;
                    }

                    if (data.status === 'completed') {
                        clearInterval(statusInterval);
                        setBuildingState(false);

                        updateHistoryEntry(buildId, {
                            status: data.status,
                            conclusion: data.conclusion,
                            runUrl: data.runUrl,
                        });

                        if (data.conclusion === 'success' && data.downloadUrl) {
                            appendLog('[Success] APK berhasil dibuat!', 'text-emerald-300 font-bold');
                            showDownloadButton(buildId);
                        } else {
                            appendLog(`[Error] Build gagal (${data.conclusion || 'unknown'}). Cek log lengkap: ${data.runUrl || '-'}`, 'text-red-400');
                        }
                    }
                } catch (err) {
                    appendLog(`[Error] Gagal cek status: ${err.message}`, 'text-red-400');
                }
            }, 4000);
        }

        function showDownloadButton(buildId) {
            let btn = document.getElementById('download-apk-btn');
            if (!btn) {
                btn = document.createElement('a');
                btn.id = 'download-apk-btn';
                btn.className = 'w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-sm btn-glow tracking-wider flex items-center justify-center gap-2 uppercase';
                btn.innerHTML = '<i class="fa-solid fa-download"></i> Download APK';
                document.getElementById('build-button-container').appendChild(btn);
            }
            // Download lewat proxy server sendiri (Cloudflare Function), jadi tetap di web ini,
            // TIDAK redirect/pindah ke domain github.com.
            btn.href = `/api/download?buildId=${buildId}`;
            btn.setAttribute('download', '');
        }
