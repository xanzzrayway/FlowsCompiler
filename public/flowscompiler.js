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
        // 17 bahasa asli tersedia (bukan cuma id/en): id, en, ms, hi, ja, ko, zh, ar,
        // de, fr, es, pt, ru, vi, th, tl, nl — dipetakan sesuai negara yang dipilih di popup.
        // Label 51 izin teknis (nama constant Android + deskripsinya) tetap id/en saja,
        // karena menerjemahkan istilah teknis Android ke 17 bahasa berisiko kurang akurat;
        // bahasa lain otomatis pakai deskripsi English untuk bagian izin ini.
        const LANG_KEY = 'flows_compiler_lang';

        const translations = {
            id: {
                login_title: "Login Ke Flows Compiler",
                login_subtitle: "Mulai kompilasi link dan file HTML lu jadi APK dengan mudah",
                login_google_btn: "Login Dengan Google",
                tagline: "Compile Link/file ke Apk",
                label_app_name: "Nama Aplikasi",
                ph_app_name: "Contoh: Aplikasi Keren Gue",
                label_package_name: "Nama Package",
                label_version: "Versi Aplikasi",
                label_source: "Sumber Konten",
                label_daily_limit: "Limit Harian",
                limit_saved_note: "Tersimpan di akun Google kamu",
                label_icon: "Ikon Aplikasi",
                label_log: "Log Output",
                history_title: "Riwayat Compile",
                build_btn_idle: "Build Aplikasi",
                build_btn_loading: "Sedang Build...",
                history_empty: "Belum ada riwayat compile.",
                status_success: "Sukses",
                status_failed: "Gagal",
                status_progress: "Proses...",
                action_download: "Unduh",
                action_recheck: "Cek Ulang",
                action_check_status: "Cek Status",
                err_not_logged_in: "Kamu belum login.",
                err_usage_not_ready: "Data limit belum siap, coba lagi sebentar.",
                err_daily_limit_reached: "Limit compile harian kamu sudah habis. Coba lagi besok.",
                err_name_package_required: "Nama aplikasi dan Nama Package wajib diisi.",
                err_package_format: "Format package name salah. Contoh benar: com.namakamu.aplikasi",
                err_url_required: "URL wajib diisi untuk mode Link.",
                err_html_required: "File index.html wajib diupload untuk mode File Html.",
                err_zip_required: "File project.zip wajib diupload untuk mode Zip.",
                label_permissions: "Perizinan Aplikasi",
                perm_selected_suffix: "dipilih",
                perm_scroll_hint: "Scroll untuk lihat semua izin ({n} izin tersedia)",
            },
            en: {
                login_title: "Login to Flows Compiler",
                login_subtitle: "Start compiling your link or HTML file into an APK easily",
                login_google_btn: "Sign in with Google",
                tagline: "Compile Link/file to APK",
                label_app_name: "App Name",
                ph_app_name: "Example: My Cool App",
                label_package_name: "Package Name",
                label_version: "App Version",
                label_source: "Content Source",
                label_daily_limit: "Daily Limit",
                limit_saved_note: "Saved to your Google account",
                label_icon: "App Icon",
                label_log: "Log Output",
                history_title: "Build History",
                build_btn_idle: "Build App",
                build_btn_loading: "Building...",
                history_empty: "No build history yet.",
                status_success: "Success",
                status_failed: "Failed",
                status_progress: "In progress...",
                action_download: "Download",
                action_recheck: "Recheck",
                action_check_status: "Check Status",
                err_not_logged_in: "You are not logged in.",
                err_usage_not_ready: "Usage data is not ready yet, please try again shortly.",
                err_daily_limit_reached: "Your daily compile limit is used up. Try again tomorrow.",
                err_name_package_required: "App Name and Package Name are required.",
                err_package_format: "Invalid package name format. Correct example: com.yourname.app",
                err_url_required: "URL is required for Link mode.",
                err_html_required: "An index.html file is required for File Html mode.",
                err_zip_required: "A project.zip file is required for Zip mode.",
                label_permissions: "App Permissions",
                perm_selected_suffix: "selected",
                perm_scroll_hint: "Scroll to see all permissions ({n} available)",
            },
            ms: {
                login_title: "Log Masuk Ke Flows Compiler",
                login_subtitle: "Mula kompil pautan dan fail HTML anda jadi APK dengan mudah",
                login_google_btn: "Log Masuk Dengan Google",
                tagline: "Kompil Pautan/fail ke APK",
                label_app_name: "Nama Aplikasi",
                ph_app_name: "Contoh: Aplikasi Hebat Saya",
                label_package_name: "Nama Pakej",
                label_version: "Versi Aplikasi",
                label_source: "Sumber Kandungan",
                label_daily_limit: "Had Harian",
                limit_saved_note: "Disimpan dalam akaun Google anda",
                label_icon: "Ikon Aplikasi",
                label_log: "Log Output",
                history_title: "Sejarah Kompil",
                build_btn_idle: "Bina Aplikasi",
                build_btn_loading: "Sedang Membina...",
                history_empty: "Belum ada sejarah kompil.",
                status_success: "Berjaya",
                status_failed: "Gagal",
                status_progress: "Sedang Diproses...",
                action_download: "Muat Turun",
                action_recheck: "Semak Semula",
                action_check_status: "Semak Status",
                err_not_logged_in: "Anda belum log masuk.",
                err_usage_not_ready: "Data had belum sedia, cuba lagi sebentar.",
                err_daily_limit_reached: "Had kompil harian anda sudah habis. Cuba lagi esok.",
                err_name_package_required: "Nama Aplikasi dan Nama Pakej wajib diisi.",
                err_package_format: "Format nama pakej salah. Contoh betul: com.namaanda.aplikasi",
                err_url_required: "URL wajib diisi untuk mod Pautan.",
                err_html_required: "Fail index.html wajib dimuat naik untuk mod Fail Html.",
                err_zip_required: "Fail project.zip wajib dimuat naik untuk mod Zip.",
                label_permissions: "Kebenaran Aplikasi",
                perm_selected_suffix: "dipilih",
                perm_scroll_hint: "Tatal untuk lihat semua kebenaran ({n} tersedia)",
            },
            hi: {
                login_title: "Flows Compiler में लॉगिन करें",
                login_subtitle: "अपने लिंक या HTML फाइल को आसानी से APK में कंपाइल करें",
                login_google_btn: "Google से लॉगिन करें",
                tagline: "लिंक/फाइल को APK में कंपाइल करें",
                label_app_name: "ऐप का नाम",
                ph_app_name: "उदाहरण: मेरा कूल ऐप",
                label_package_name: "पैकेज नाम",
                label_version: "ऐप वर्शन",
                label_source: "कंटेंट सोर्स",
                label_daily_limit: "दैनिक सीमा",
                limit_saved_note: "आपके Google अकाउंट में सेव है",
                label_icon: "ऐप आइकन",
                label_log: "लॉग आउटपुट",
                history_title: "कंपाइल इतिहास",
                build_btn_idle: "ऐप बनाएं",
                build_btn_loading: "बन रहा है...",
                history_empty: "अभी तक कोई इतिहास नहीं है।",
                status_success: "सफल",
                status_failed: "असफल",
                status_progress: "प्रगति में...",
                action_download: "डाउनलोड करें",
                action_recheck: "फिर से जांचें",
                action_check_status: "स्थिति जांचें",
                err_not_logged_in: "आपने लॉगिन नहीं किया है।",
                err_usage_not_ready: "सीमा डेटा अभी तैयार नहीं है, कृपया थोड़ी देर बाद कोशिश करें।",
                err_daily_limit_reached: "आपकी दैनिक कंपाइल सीमा समाप्त हो गई है। कल फिर कोशिश करें।",
                err_name_package_required: "ऐप का नाम और पैकेज नाम आवश्यक है।",
                err_package_format: "पैकेज नाम का फॉर्मेट गलत है। सही उदाहरण: com.aapkanaam.app",
                err_url_required: "लिंक मोड के लिए URL आवश्यक है।",
                err_html_required: "File Html मोड के लिए index.html फाइल आवश्यक है।",
                err_zip_required: "Zip मोड के लिए project.zip फाइल आवश्यक है।",
                label_permissions: "ऐप अनुमतियां",
                perm_selected_suffix: "चयनित",
                perm_scroll_hint: "सभी अनुमतियां देखने के लिए स्क्रॉल करें ({n} उपलब्ध)",
            },
            ja: {
                login_title: "Flows Compiler にログイン",
                login_subtitle: "リンクやHTMLファイルを簡単にAPKにコンパイルしよう",
                login_google_btn: "Googleでログイン",
                tagline: "リンク/ファイルをAPKにコンパイル",
                label_app_name: "アプリ名",
                ph_app_name: "例: すごいアプリ",
                label_package_name: "パッケージ名",
                label_version: "アプリバージョン",
                label_source: "コンテンツソース",
                label_daily_limit: "1日の制限",
                limit_saved_note: "Googleアカウントに保存されます",
                label_icon: "アプリアイコン",
                label_log: "ログ出力",
                history_title: "ビルド履歴",
                build_btn_idle: "アプリをビルド",
                build_btn_loading: "ビルド中...",
                history_empty: "まだビルド履歴がありません。",
                status_success: "成功",
                status_failed: "失敗",
                status_progress: "処理中...",
                action_download: "ダウンロード",
                action_recheck: "再確認",
                action_check_status: "状態を確認",
                err_not_logged_in: "ログインしていません。",
                err_usage_not_ready: "利用データがまだ準備できていません。しばらくしてから再試行してください。",
                err_daily_limit_reached: "本日のコンパイル制限に達しました。明日また試してください。",
                err_name_package_required: "アプリ名とパッケージ名は必須です。",
                err_package_format: "パッケージ名の形式が正しくありません。正しい例: com.yourname.app",
                err_url_required: "リンクモードにはURLが必要です。",
                err_html_required: "File Htmlモードには index.html ファイルが必要です。",
                err_zip_required: "Zipモードには project.zip ファイルが必要です。",
                label_permissions: "アプリの権限",
                perm_selected_suffix: "選択済み",
                perm_scroll_hint: "スクロールしてすべての権限を見る（{n}件）",
            },
            ko: {
                login_title: "Flows Compiler 로그인",
                login_subtitle: "링크나 HTML 파일을 쉽게 APK로 컴파일하세요",
                login_google_btn: "Google로 로그인",
                tagline: "링크/파일을 APK로 컴파일",
                label_app_name: "앱 이름",
                ph_app_name: "예: 멋진 내 앱",
                label_package_name: "패키지 이름",
                label_version: "앱 버전",
                label_source: "콘텐츠 소스",
                label_daily_limit: "일일 한도",
                limit_saved_note: "Google 계정에 저장됩니다",
                label_icon: "앱 아이콘",
                label_log: "로그 출력",
                history_title: "빌드 기록",
                build_btn_idle: "앱 빌드",
                build_btn_loading: "빌드 중...",
                history_empty: "아직 빌드 기록이 없습니다.",
                status_success: "성공",
                status_failed: "실패",
                status_progress: "진행 중...",
                action_download: "다운로드",
                action_recheck: "다시 확인",
                action_check_status: "상태 확인",
                err_not_logged_in: "로그인하지 않았습니다.",
                err_usage_not_ready: "사용량 데이터가 아직 준비되지 않았습니다. 잠시 후 다시 시도하세요.",
                err_daily_limit_reached: "오늘의 컴파일 한도를 모두 사용했습니다. 내일 다시 시도하세요.",
                err_name_package_required: "앱 이름과 패키지 이름은 필수입니다.",
                err_package_format: "패키지 이름 형식이 잘못되었습니다. 올바른 예: com.yourname.app",
                err_url_required: "링크 모드에는 URL이 필요합니다.",
                err_html_required: "File Html 모드에는 index.html 파일이 필요합니다.",
                err_zip_required: "Zip 모드에는 project.zip 파일이 필요합니다.",
                label_permissions: "앱 권한",
                perm_selected_suffix: "선택됨",
                perm_scroll_hint: "모든 권한을 보려면 스크롤하세요 ({n}개 사용 가능)",
            },
            zh: {
                login_title: "登录 Flows Compiler",
                login_subtitle: "轻松将链接或HTML文件编译成APK",
                login_google_btn: "使用 Google 登录",
                tagline: "将链接/文件编译成APK",
                label_app_name: "应用名称",
                ph_app_name: "例如：我的酷应用",
                label_package_name: "包名",
                label_version: "应用版本",
                label_source: "内容来源",
                label_daily_limit: "每日限额",
                limit_saved_note: "已保存到您的 Google 账户",
                label_icon: "应用图标",
                label_log: "日志输出",
                history_title: "编译历史",
                build_btn_idle: "编译应用",
                build_btn_loading: "编译中...",
                history_empty: "暂无编译历史。",
                status_success: "成功",
                status_failed: "失败",
                status_progress: "进行中...",
                action_download: "下载",
                action_recheck: "重新检查",
                action_check_status: "检查状态",
                err_not_logged_in: "您尚未登录。",
                err_usage_not_ready: "使用数据尚未准备好，请稍后再试。",
                err_daily_limit_reached: "今日编译额度已用完，请明天再试。",
                err_name_package_required: "应用名称和包名为必填项。",
                err_package_format: "包名格式错误。正确示例：com.yourname.app",
                err_url_required: "链接模式需要填写 URL。",
                err_html_required: "File Html 模式需要上传 index.html 文件。",
                err_zip_required: "Zip 模式需要上传 project.zip 文件。",
                label_permissions: "应用权限",
                perm_selected_suffix: "已选择",
                perm_scroll_hint: "滚动查看所有权限（共 {n} 项）",
            },
            ar: {
                login_title: "تسجيل الدخول إلى Flows Compiler",
                login_subtitle: "ابدأ بتحويل الرابط أو ملف HTML إلى APK بسهولة",
                login_google_btn: "تسجيل الدخول عبر Google",
                tagline: "تحويل الرابط/الملف إلى APK",
                label_app_name: "اسم التطبيق",
                ph_app_name: "مثال: تطبيقي الرائع",
                label_package_name: "اسم الحزمة",
                label_version: "إصدار التطبيق",
                label_source: "مصدر المحتوى",
                label_daily_limit: "الحد اليومي",
                limit_saved_note: "محفوظ في حساب Google الخاص بك",
                label_icon: "أيقونة التطبيق",
                label_log: "سجل الإخراج",
                history_title: "سجل التحويلات",
                build_btn_idle: "إنشاء التطبيق",
                build_btn_loading: "جارٍ الإنشاء...",
                history_empty: "لا يوجد سجل تحويلات بعد.",
                status_success: "نجاح",
                status_failed: "فشل",
                status_progress: "قيد التنفيذ...",
                action_download: "تنزيل",
                action_recheck: "إعادة التحقق",
                action_check_status: "تحقق من الحالة",
                err_not_logged_in: "لم تقم بتسجيل الدخول.",
                err_usage_not_ready: "بيانات الحد غير جاهزة بعد، حاول مرة أخرى بعد قليل.",
                err_daily_limit_reached: "لقد استنفدت حد التحويل اليومي. حاول مرة أخرى غدًا.",
                err_name_package_required: "اسم التطبيق واسم الحزمة مطلوبان.",
                err_package_format: "صيغة اسم الحزمة غير صحيحة. مثال صحيح: com.yourname.app",
                err_url_required: "الرابط مطلوب في وضع Link.",
                err_html_required: "ملف index.html مطلوب في وضع File Html.",
                err_zip_required: "ملف project.zip مطلوب في وضع Zip.",
                label_permissions: "أذونات التطبيق",
                perm_selected_suffix: "محدد",
                perm_scroll_hint: "مرر لرؤية جميع الأذونات ({n} متاحة)",
            },
            de: {
                login_title: "Bei Flows Compiler anmelden",
                login_subtitle: "Kompiliere deinen Link oder deine HTML-Datei ganz einfach zu einer APK",
                login_google_btn: "Mit Google anmelden",
                tagline: "Link/Datei zu APK kompilieren",
                label_app_name: "App-Name",
                ph_app_name: "Beispiel: Meine coole App",
                label_package_name: "Paketname",
                label_version: "App-Version",
                label_source: "Inhaltsquelle",
                label_daily_limit: "Tageslimit",
                limit_saved_note: "In deinem Google-Konto gespeichert",
                label_icon: "App-Symbol",
                label_log: "Log-Ausgabe",
                history_title: "Build-Verlauf",
                build_btn_idle: "App erstellen",
                build_btn_loading: "Wird erstellt...",
                history_empty: "Noch kein Build-Verlauf vorhanden.",
                status_success: "Erfolgreich",
                status_failed: "Fehlgeschlagen",
                status_progress: "In Bearbeitung...",
                action_download: "Herunterladen",
                action_recheck: "Erneut prüfen",
                action_check_status: "Status prüfen",
                err_not_logged_in: "Du bist nicht angemeldet.",
                err_usage_not_ready: "Nutzungsdaten sind noch nicht bereit, versuche es gleich noch einmal.",
                err_daily_limit_reached: "Dein Tageslimit für Kompilierungen ist aufgebraucht. Versuche es morgen erneut.",
                err_name_package_required: "App-Name und Paketname sind erforderlich.",
                err_package_format: "Ungültiges Paketname-Format. Richtiges Beispiel: com.deinname.app",
                err_url_required: "Im Link-Modus ist eine URL erforderlich.",
                err_html_required: "Im File-Html-Modus ist eine index.html-Datei erforderlich.",
                err_zip_required: "Im Zip-Modus ist eine project.zip-Datei erforderlich.",
                label_permissions: "App-Berechtigungen",
                perm_selected_suffix: "ausgewählt",
                perm_scroll_hint: "Scrollen, um alle Berechtigungen zu sehen ({n} verfügbar)",
            },
            fr: {
                login_title: "Connexion à Flows Compiler",
                login_subtitle: "Compilez facilement votre lien ou fichier HTML en APK",
                login_google_btn: "Se connecter avec Google",
                tagline: "Compiler un lien/fichier en APK",
                label_app_name: "Nom de l'application",
                ph_app_name: "Exemple : Mon appli cool",
                label_package_name: "Nom du package",
                label_version: "Version de l'application",
                label_source: "Source du contenu",
                label_daily_limit: "Limite quotidienne",
                limit_saved_note: "Enregistré dans votre compte Google",
                label_icon: "Icône de l'application",
                label_log: "Journal de sortie",
                history_title: "Historique de compilation",
                build_btn_idle: "Compiler l'application",
                build_btn_loading: "Compilation en cours...",
                history_empty: "Aucun historique de compilation pour le moment.",
                status_success: "Réussi",
                status_failed: "Échoué",
                status_progress: "En cours...",
                action_download: "Télécharger",
                action_recheck: "Revérifier",
                action_check_status: "Vérifier le statut",
                err_not_logged_in: "Vous n'êtes pas connecté.",
                err_usage_not_ready: "Les données d'utilisation ne sont pas encore prêtes, réessayez dans un instant.",
                err_daily_limit_reached: "Votre limite quotidienne de compilation est atteinte. Réessayez demain.",
                err_name_package_required: "Le nom de l'application et le nom du package sont obligatoires.",
                err_package_format: "Format du nom de package invalide. Exemple correct : com.votrenom.app",
                err_url_required: "Une URL est requise pour le mode Lien.",
                err_html_required: "Un fichier index.html est requis pour le mode Fichier Html.",
                err_zip_required: "Un fichier project.zip est requis pour le mode Zip.",
                label_permissions: "Autorisations de l'application",
                perm_selected_suffix: "sélectionné(s)",
                perm_scroll_hint: "Faites défiler pour voir toutes les autorisations ({n} disponibles)",
            },
            es: {
                login_title: "Iniciar sesión en Flows Compiler",
                login_subtitle: "Compila fácilmente tu enlace o archivo HTML en un APK",
                login_google_btn: "Iniciar sesión con Google",
                tagline: "Compilar enlace/archivo a APK",
                label_app_name: "Nombre de la app",
                ph_app_name: "Ejemplo: Mi app genial",
                label_package_name: "Nombre del paquete",
                label_version: "Versión de la app",
                label_source: "Fuente del contenido",
                label_daily_limit: "Límite diario",
                limit_saved_note: "Guardado en tu cuenta de Google",
                label_icon: "Icono de la app",
                label_log: "Salida de registro",
                history_title: "Historial de compilaciones",
                build_btn_idle: "Compilar app",
                build_btn_loading: "Compilando...",
                history_empty: "Aún no hay historial de compilaciones.",
                status_success: "Éxito",
                status_failed: "Fallido",
                status_progress: "En proceso...",
                action_download: "Descargar",
                action_recheck: "Volver a comprobar",
                action_check_status: "Comprobar estado",
                err_not_logged_in: "No has iniciado sesión.",
                err_usage_not_ready: "Los datos de uso aún no están listos, inténtalo de nuevo en un momento.",
                err_daily_limit_reached: "Se agotó tu límite diario de compilación. Inténtalo de nuevo mañana.",
                err_name_package_required: "El nombre de la app y el nombre del paquete son obligatorios.",
                err_package_format: "Formato de nombre de paquete incorrecto. Ejemplo correcto: com.tunombre.app",
                err_url_required: "Se requiere una URL para el modo Enlace.",
                err_html_required: "Se requiere un archivo index.html para el modo Archivo Html.",
                err_zip_required: "Se requiere un archivo project.zip para el modo Zip.",
                label_permissions: "Permisos de la app",
                perm_selected_suffix: "seleccionado(s)",
                perm_scroll_hint: "Desplázate para ver todos los permisos ({n} disponibles)",
            },
            pt: {
                login_title: "Entrar no Flows Compiler",
                login_subtitle: "Compile facilmente seu link ou arquivo HTML em um APK",
                login_google_btn: "Entrar com o Google",
                tagline: "Compilar link/arquivo em APK",
                label_app_name: "Nome do aplicativo",
                ph_app_name: "Exemplo: Meu app legal",
                label_package_name: "Nome do pacote",
                label_version: "Versão do aplicativo",
                label_source: "Fonte do conteúdo",
                label_daily_limit: "Limite diário",
                limit_saved_note: "Salvo na sua conta do Google",
                label_icon: "Ícone do aplicativo",
                label_log: "Saída de log",
                history_title: "Histórico de compilações",
                build_btn_idle: "Compilar app",
                build_btn_loading: "Compilando...",
                history_empty: "Ainda não há histórico de compilações.",
                status_success: "Sucesso",
                status_failed: "Falhou",
                status_progress: "Em andamento...",
                action_download: "Baixar",
                action_recheck: "Verificar novamente",
                action_check_status: "Verificar status",
                err_not_logged_in: "Você não está conectado.",
                err_usage_not_ready: "Os dados de uso ainda não estão prontos, tente novamente em instantes.",
                err_daily_limit_reached: "Seu limite diário de compilação acabou. Tente novamente amanhã.",
                err_name_package_required: "Nome do app e Nome do pacote são obrigatórios.",
                err_package_format: "Formato de nome de pacote inválido. Exemplo correto: com.seunome.app",
                err_url_required: "É necessário informar uma URL no modo Link.",
                err_html_required: "É necessário enviar um arquivo index.html no modo File Html.",
                err_zip_required: "É necessário enviar um arquivo project.zip no modo Zip.",
                label_permissions: "Permissões do app",
                perm_selected_suffix: "selecionada(s)",
                perm_scroll_hint: "Role para ver todas as permissões ({n} disponíveis)",
            },
            ru: {
                login_title: "Вход в Flows Compiler",
                login_subtitle: "Легко скомпилируйте вашу ссылку или HTML-файл в APK",
                login_google_btn: "Войти через Google",
                tagline: "Компиляция ссылки/файла в APK",
                label_app_name: "Название приложения",
                ph_app_name: "Пример: Моё крутое приложение",
                label_package_name: "Имя пакета",
                label_version: "Версия приложения",
                label_source: "Источник контента",
                label_daily_limit: "Дневной лимит",
                limit_saved_note: "Сохранено в вашем аккаунте Google",
                label_icon: "Иконка приложения",
                label_log: "Вывод журнала",
                history_title: "История сборок",
                build_btn_idle: "Собрать приложение",
                build_btn_loading: "Идёт сборка...",
                history_empty: "Пока нет истории сборок.",
                status_success: "Успешно",
                status_failed: "Ошибка",
                status_progress: "В процессе...",
                action_download: "Скачать",
                action_recheck: "Проверить снова",
                action_check_status: "Проверить статус",
                err_not_logged_in: "Вы не вошли в систему.",
                err_usage_not_ready: "Данные лимита ещё не готовы, попробуйте снова через мгновение.",
                err_daily_limit_reached: "Ваш дневной лимит компиляций исчерпан. Попробуйте снова завтра.",
                err_name_package_required: "Название приложения и имя пакета обязательны.",
                err_package_format: "Неверный формат имени пакета. Правильный пример: com.вашеимя.app",
                err_url_required: "Для режима Ссылка требуется URL.",
                err_html_required: "Для режима File Html требуется файл index.html.",
                err_zip_required: "Для режима Zip требуется файл project.zip.",
                label_permissions: "Разрешения приложения",
                perm_selected_suffix: "выбрано",
                perm_scroll_hint: "Прокрутите, чтобы увидеть все разрешения (доступно: {n})",
            },
            vi: {
                login_title: "Đăng nhập vào Flows Compiler",
                login_subtitle: "Bắt đầu biên dịch link hoặc file HTML thành APK thật dễ dàng",
                login_google_btn: "Đăng nhập với Google",
                tagline: "Biên dịch Link/file thành APK",
                label_app_name: "Tên ứng dụng",
                ph_app_name: "Ví dụ: Ứng dụng ngầu của tôi",
                label_package_name: "Tên gói (Package)",
                label_version: "Phiên bản ứng dụng",
                label_source: "Nguồn nội dung",
                label_daily_limit: "Giới hạn hàng ngày",
                limit_saved_note: "Đã lưu vào tài khoản Google của bạn",
                label_icon: "Biểu tượng ứng dụng",
                label_log: "Nhật ký đầu ra",
                history_title: "Lịch sử biên dịch",
                build_btn_idle: "Biên dịch ứng dụng",
                build_btn_loading: "Đang biên dịch...",
                history_empty: "Chưa có lịch sử biên dịch.",
                status_success: "Thành công",
                status_failed: "Thất bại",
                status_progress: "Đang xử lý...",
                action_download: "Tải xuống",
                action_recheck: "Kiểm tra lại",
                action_check_status: "Kiểm tra trạng thái",
                err_not_logged_in: "Bạn chưa đăng nhập.",
                err_usage_not_ready: "Dữ liệu giới hạn chưa sẵn sàng, vui lòng thử lại sau giây lát.",
                err_daily_limit_reached: "Bạn đã dùng hết giới hạn biên dịch hôm nay. Hãy thử lại vào ngày mai.",
                err_name_package_required: "Tên ứng dụng và Tên gói là bắt buộc.",
                err_package_format: "Định dạng tên gói không đúng. Ví dụ đúng: com.tenban.app",
                err_url_required: "Cần có URL cho chế độ Link.",
                err_html_required: "Cần có file index.html cho chế độ File Html.",
                err_zip_required: "Cần có file project.zip cho chế độ Zip.",
                label_permissions: "Quyền của ứng dụng",
                perm_selected_suffix: "đã chọn",
                perm_scroll_hint: "Cuộn để xem tất cả quyền ({n} quyền có sẵn)",
            },
            th: {
                login_title: "เข้าสู่ระบบ Flows Compiler",
                login_subtitle: "เริ่มคอมไพล์ลิงก์หรือไฟล์ HTML ของคุณเป็น APK ได้อย่างง่ายดาย",
                login_google_btn: "เข้าสู่ระบบด้วย Google",
                tagline: "คอมไพล์ลิงก์/ไฟล์เป็น APK",
                label_app_name: "ชื่อแอป",
                ph_app_name: "ตัวอย่าง: แอปสุดเจ๋งของฉัน",
                label_package_name: "ชื่อแพ็กเกจ",
                label_version: "เวอร์ชันแอป",
                label_source: "แหล่งที่มาของเนื้อหา",
                label_daily_limit: "โควตารายวัน",
                limit_saved_note: "บันทึกไว้ในบัญชี Google ของคุณ",
                label_icon: "ไอคอนแอป",
                label_log: "บันทึกผลลัพธ์",
                history_title: "ประวัติการคอมไพล์",
                build_btn_idle: "สร้างแอป",
                build_btn_loading: "กำลังสร้าง...",
                history_empty: "ยังไม่มีประวัติการคอมไพล์",
                status_success: "สำเร็จ",
                status_failed: "ล้มเหลว",
                status_progress: "กำลังดำเนินการ...",
                action_download: "ดาวน์โหลด",
                action_recheck: "ตรวจสอบอีกครั้ง",
                action_check_status: "ตรวจสอบสถานะ",
                err_not_logged_in: "คุณยังไม่ได้เข้าสู่ระบบ",
                err_usage_not_ready: "ข้อมูลโควตายังไม่พร้อม โปรดลองอีกครั้งในอีกสักครู่",
                err_daily_limit_reached: "โควตาคอมไพล์รายวันของคุณหมดแล้ว ลองใหม่พรุ่งนี้",
                err_name_package_required: "ต้องกรอกชื่อแอปและชื่อแพ็กเกจ",
                err_package_format: "รูปแบบชื่อแพ็กเกจไม่ถูกต้อง ตัวอย่างที่ถูกต้อง: com.yourname.app",
                err_url_required: "ต้องกรอก URL สำหรับโหมด Link",
                err_html_required: "ต้องอัปโหลดไฟล์ index.html สำหรับโหมด File Html",
                err_zip_required: "ต้องอัปโหลดไฟล์ project.zip สำหรับโหมด Zip",
                label_permissions: "สิทธิ์การเข้าถึงของแอป",
                perm_selected_suffix: "เลือกแล้ว",
                perm_scroll_hint: "เลื่อนเพื่อดูสิทธิ์ทั้งหมด (มี {n} รายการ)",
            },
            tl: {
                login_title: "Mag-login sa Flows Compiler",
                login_subtitle: "Simulan ang pag-compile ng link o HTML file mo papuntang APK nang madali",
                login_google_btn: "Mag-login gamit ang Google",
                tagline: "I-compile ang Link/file papuntang APK",
                label_app_name: "Pangalan ng App",
                ph_app_name: "Halimbawa: Ang Astig Kong App",
                label_package_name: "Pangalan ng Package",
                label_version: "Bersyon ng App",
                label_source: "Pinagmulan ng Content",
                label_daily_limit: "Araw-araw na Limitasyon",
                limit_saved_note: "Naka-save sa Google account mo",
                label_icon: "Icon ng App",
                label_log: "Log Output",
                history_title: "Kasaysayan ng Compile",
                build_btn_idle: "I-build ang App",
                build_btn_loading: "Bumubuo...",
                history_empty: "Wala pang kasaysayan ng compile.",
                status_success: "Matagumpay",
                status_failed: "Nabigo",
                status_progress: "Isinasagawa...",
                action_download: "I-download",
                action_recheck: "I-check Ulit",
                action_check_status: "Suriin ang Status",
                err_not_logged_in: "Hindi ka pa naka-login.",
                err_usage_not_ready: "Hindi pa handa ang usage data, subukan ulit sandali.",
                err_daily_limit_reached: "Naubos na ang araw-araw mong limitasyon sa pag-compile. Subukan ulit bukas.",
                err_name_package_required: "Kailangan ang Pangalan ng App at Pangalan ng Package.",
                err_package_format: "Mali ang format ng package name. Tamang halimbawa: com.pangalanmo.app",
                err_url_required: "Kailangan ng URL para sa Link mode.",
                err_html_required: "Kailangan ng index.html file para sa File Html mode.",
                err_zip_required: "Kailangan ng project.zip file para sa Zip mode.",
                label_permissions: "Mga Pahintulot ng App",
                perm_selected_suffix: "napili",
                perm_scroll_hint: "Mag-scroll para makita lahat ng pahintulot ({n} available)",
            },
            nl: {
                login_title: "Inloggen bij Flows Compiler",
                login_subtitle: "Compileer eenvoudig je link of HTML-bestand naar een APK",
                login_google_btn: "Inloggen met Google",
                tagline: "Link/bestand compileren naar APK",
                label_app_name: "App-naam",
                ph_app_name: "Voorbeeld: Mijn coole app",
                label_package_name: "Pakketnaam",
                label_version: "App-versie",
                label_source: "Contentbron",
                label_daily_limit: "Dagelijkse limiet",
                limit_saved_note: "Opgeslagen in je Google-account",
                label_icon: "App-icoon",
                label_log: "Loguitvoer",
                history_title: "Buildgeschiedenis",
                build_btn_idle: "App bouwen",
                build_btn_loading: "Bezig met bouwen...",
                history_empty: "Nog geen buildgeschiedenis.",
                status_success: "Gelukt",
                status_failed: "Mislukt",
                status_progress: "Bezig...",
                action_download: "Downloaden",
                action_recheck: "Opnieuw controleren",
                action_check_status: "Status controleren",
                err_not_logged_in: "Je bent niet ingelogd.",
                err_usage_not_ready: "Gebruiksgegevens zijn nog niet klaar, probeer het straks opnieuw.",
                err_daily_limit_reached: "Je dagelijkse compilelimiet is bereikt. Probeer het morgen opnieuw.",
                err_name_package_required: "App-naam en pakketnaam zijn verplicht.",
                err_package_format: "Ongeldig pakketnaamformaat. Juist voorbeeld: com.jouwnaam.app",
                err_url_required: "Een URL is vereist voor de Link-modus.",
                err_html_required: "Een index.html-bestand is vereist voor de File Html-modus.",
                err_zip_required: "Een project.zip-bestand is vereist voor de Zip-modus.",
                label_permissions: "App-machtigingen",
                perm_selected_suffix: "geselecteerd",
                perm_scroll_hint: "Scroll om alle machtigingen te zien ({n} beschikbaar)",
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

            // Label 51 izin: cuma tersedia id/en, bahasa lain fallback ke English
            const permLangAttr = currentLang === 'id' ? 'data-label-id' : 'data-label-en';
            document.querySelectorAll('#permissions-box .perm-checkbox').forEach(cb => {
                const labelEl = cb.closest('.perm-item')?.querySelector('.perm-label');
                if (labelEl) labelEl.textContent = cb.getAttribute(permLangAttr);
            });

            const scrollHintEl = document.getElementById('perm-scroll-hint');
            if (scrollHintEl) {
                const total = document.querySelectorAll('#permissions-box .perm-checkbox').length;
                scrollHintEl.textContent = t('perm_scroll_hint').replace('{n}', total);
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
