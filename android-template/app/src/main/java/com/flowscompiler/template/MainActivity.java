package com.flowscompiler.template;

import android.Manifest;
import android.app.WallpaperManager;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PermissionInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private static final int PERMISSION_REQUEST_CODE = 1001;
    private static final int STARTUP_PERMISSION_REQUEST_CODE = 2001;

    private WebView webView;
    private PermissionRequest pendingWebPermissionRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Minta semua izin "dangerous" yang tercentang user waktu compile,
        // langsung saat aplikasi pertama kali dibuka (bukan nunggu dipanggil dari web).
        requestAllDangerousPermissions();
        requestManageStorageIfNeeded();

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebViewClient(new WebViewClient());

        // Jembatan JS <-> Android: dipanggil dari web lewat window.AndroidWallpaper.setWallpaper(base64)
        webView.addJavascriptInterface(new WallpaperBridge(), "AndroidWallpaper");

        // Jembatan JS <-> Android: file manager (lihat/baca/tulis/ubah nama/hapus file di HP)
        webView.addJavascriptInterface(new FileManagerBridge(), "AndroidFiles");

        // Ini kuncinya: tanpa WebChromeClient + onPermissionRequest, getUserMedia()
        // (kamera/mikrofon/senter) di halaman web SELALU ditolak WebView,
        // walaupun izin CAMERA/RECORD_AUDIO di Android sudah dicentang user.
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(() -> handleWebPermissionRequest(request));
            }
        });

        if (BuildConfig.LOAD_LOCAL) {
            webView.loadUrl("file:///android_asset/index.html");
        } else {
            String url = getString(R.string.target_url);
            webView.loadUrl(url);
        }
    }

    // Baca semua permission yang tercentang user waktu compile (tertanam otomatis di
    // AndroidManifest.xml oleh workflow build), lalu minta semua yang tipe "dangerous"
    // (butuh persetujuan user) sekaligus saat aplikasi pertama kali dibuka.
    private void requestAllDangerousPermissions() {
        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_PERMISSIONS);
            String[] declaredPerms = info.requestedPermissions;
            if (declaredPerms == null) return;

            List<String> toRequest = new ArrayList<>();
            for (String perm : declaredPerms) {
                try {
                    PermissionInfo pInfo = getPackageManager().getPermissionInfo(perm, 0);
                    int protectionLevel = pInfo.protectionLevel & PermissionInfo.PROTECTION_MASK_BASE;
                    boolean isDangerous = protectionLevel == PermissionInfo.PROTECTION_DANGEROUS;
                    boolean notGrantedYet = ContextCompat.checkSelfPermission(this, perm) != PackageManager.PERMISSION_GRANTED;

                    if (isDangerous && notGrantedYet) {
                        toRequest.add(perm);
                    }
                } catch (PackageManager.NameNotFoundException ignored) {
                    // Permission tidak dikenal di versi Android ini / OEM tertentu, lewati saja
                }
            }

            if (!toRequest.isEmpty()) {
                ActivityCompat.requestPermissions(this, toRequest.toArray(new String[0]), STARTUP_PERMISSION_REQUEST_CODE);
            }
        } catch (PackageManager.NameNotFoundException ignored) {
            // Tidak seharusnya terjadi (getPackageName() selalu valid untuk app sendiri)
        }
    }

    // MANAGE_EXTERNAL_STORAGE itu izin khusus (bukan tipe "dangerous" biasa) —
    // di Android 11+ (API 30+) harus di-approve lewat halaman Settings tersendiri,
    // tidak bisa lewat dialog izin normal. Fungsi ini otomatis arahin ke situ
    // kalau izin ini termasuk yang dicentang user waktu compile.
    private void requestManageStorageIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return;

        try {
            PackageInfo info = getPackageManager().getPackageInfo(getPackageName(), PackageManager.GET_PERMISSIONS);
            String[] declaredPerms = info.requestedPermissions;
            if (declaredPerms == null) return;

            boolean declaresManageStorage = false;
            for (String p : declaredPerms) {
                if ("android.permission.MANAGE_EXTERNAL_STORAGE".equals(p)) {
                    declaresManageStorage = true;
                    break;
                }
            }

            if (declaresManageStorage && !Environment.isExternalStorageManager()) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                intent.setData(Uri.parse("package:" + getPackageName()));
                startActivity(intent);
            }
        } catch (PackageManager.NameNotFoundException ignored) {
        }
    }

    private void handleWebPermissionRequest(PermissionRequest request) {
        List<String> androidPermsNeeded = new ArrayList<>();

        for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)
                    && ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                androidPermsNeeded.add(Manifest.permission.CAMERA);
            } else if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)
                    && ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                androidPermsNeeded.add(Manifest.permission.RECORD_AUDIO);
            }
        }

        if (androidPermsNeeded.isEmpty()) {
            // Izin Android sudah ada semua (atau memang tidak dibutuhkan) -> langsung izinkan WebView-nya
            request.grant(request.getResources());
            return;
        }

        // Minta izin Android dulu (munculin dialog sistem), WebView baru di-grant setelah user menjawab
        pendingWebPermissionRequest = request;
        ActivityCompat.requestPermissions(this, androidPermsNeeded.toArray(new String[0]), PERMISSION_REQUEST_CODE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode != PERMISSION_REQUEST_CODE || pendingWebPermissionRequest == null) {
            return;
        }

        boolean allGranted = grantResults.length > 0;
        for (int result : grantResults) {
            if (result != PackageManager.PERMISSION_GRANTED) {
                allGranted = false;
                break;
            }
        }

        if (allGranted) {
            pendingWebPermissionRequest.grant(pendingWebPermissionRequest.getResources());
        } else {
            pendingWebPermissionRequest.deny();
        }
        pendingWebPermissionRequest = null;
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // Jembatan JS <-> Android untuk fitur "Ubah Wallpaper" di halaman web.
    // Dipanggil dari JS lewat: window.AndroidWallpaper.setWallpaper(base64String)
    private class WallpaperBridge {
        @JavascriptInterface
        public void setWallpaper(String base64Image) {
            try {
                byte[] imageBytes = Base64.decode(base64Image, Base64.DEFAULT);
                Bitmap bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);

                if (bitmap == null) {
                    notifyWallpaperResult(false, "Gagal membaca gambar.");
                    return;
                }

                WallpaperManager.getInstance(MainActivity.this).setBitmap(bitmap);
                notifyWallpaperResult(true, "Wallpaper berhasil diubah!");
            } catch (IOException e) {
                notifyWallpaperResult(false, "Gagal set wallpaper: " + e.getMessage());
            } catch (IllegalArgumentException e) {
                notifyWallpaperResult(false, "Data gambar tidak valid.");
            }
        }

        private void notifyWallpaperResult(boolean success, String message) {
            runOnUiThread(() -> {
                Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
                String escaped = message.replace("'", "\\'");
                webView.evaluateJavascript(
                        "window.onWallpaperResult && window.onWallpaperResult(" + success + ", '" + escaped + "')",
                        null
                );
            });
        }
    }

    // Jembatan JS <-> Android untuk File Manager (lihat/baca/tulis/ubah nama/hapus file di HP).
    // Semua method return String (JSON) atau boolean, dan bisa dipanggil SINKRON dari JS,
    // contoh: const result = JSON.parse(window.AndroidFiles.listFiles('/storage/emulated/0'));
    private class FileManagerBridge {

        @JavascriptInterface
        public String getRootPath() {
            return Environment.getExternalStorageDirectory().getAbsolutePath();
        }

        @JavascriptInterface
        public String listFiles(String path) {
            try {
                File dir = new File(path);
                if (!dir.exists() || !dir.isDirectory()) {
                    return errorJson("Folder tidak ditemukan atau bukan direktori.");
                }

                File[] files = dir.listFiles();
                JSONArray arr = new JSONArray();
                if (files != null) {
                    for (File f : files) {
                        JSONObject obj = new JSONObject();
                        obj.put("name", f.getName());
                        obj.put("path", f.getAbsolutePath());
                        obj.put("isDirectory", f.isDirectory());
                        obj.put("size", f.length());
                        obj.put("lastModified", f.lastModified());
                        arr.put(obj);
                    }
                }

                JSONObject result = new JSONObject();
                result.put("path", dir.getAbsolutePath());
                result.put("parent", dir.getParent());
                result.put("files", arr);
                return result.toString();
            } catch (Exception e) {
                return errorJson("Gagal baca folder: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public String readFile(String path) {
            try {
                File file = new File(path);
                if (!file.exists() || file.isDirectory()) {
                    return errorJson("File tidak ditemukan.");
                }
                if (file.length() > 5 * 1024 * 1024) {
                    return errorJson("File terlalu besar untuk dibuka di editor (maks 5MB).");
                }

                byte[] bytes = new byte[(int) file.length()];
                try (FileInputStream fis = new FileInputStream(file)) {
                    fis.read(bytes);
                }

                JSONObject result = new JSONObject();
                result.put("content", new String(bytes, "UTF-8"));
                return result.toString();
            } catch (Exception e) {
                return errorJson("Gagal baca file: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public boolean writeFile(String path, String content) {
            try (FileOutputStream fos = new FileOutputStream(new File(path))) {
                fos.write(content.getBytes("UTF-8"));
                return true;
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public boolean createFolder(String path) {
            try {
                return new File(path).mkdirs();
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public boolean renameFile(String oldPath, String newPath) {
            try {
                return new File(oldPath).renameTo(new File(newPath));
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public boolean deleteFile(String path) {
            try {
                return deleteRecursive(new File(path));
            } catch (Exception e) {
                return false;
            }
        }

        private boolean deleteRecursive(File file) {
            if (file.isDirectory()) {
                File[] children = file.listFiles();
                if (children != null) {
                    for (File child : children) {
                        deleteRecursive(child);
                    }
                }
            }
            return file.delete();
        }

        private String errorJson(String message) {
            try {
                JSONObject obj = new JSONObject();
                obj.put("error", message);
                return obj.toString();
            } catch (Exception e) {
                return "{\"error\":\"unknown error\"}";
            }
        }
    }
}
