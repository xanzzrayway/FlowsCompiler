package com.flowscompiler.template;

import android.Manifest;
import android.app.WallpaperManager;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private static final int PERMISSION_REQUEST_CODE = 1001;

    private WebView webView;
    private PermissionRequest pendingWebPermissionRequest;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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
}
