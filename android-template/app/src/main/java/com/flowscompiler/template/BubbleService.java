package com.flowscompiler.template;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.graphics.drawable.GradientDrawable;
import android.os.Build;
import android.os.IBinder;
import android.text.InputType;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Foreground service yang menggambar 3 overlay di atas aplikasi lain:
 * 1. bola ngambang (bisa di-drag)
 * 2. menu kecil (Kunci Layar / Tambahkan Kode)
 * 3. layar kunci full screen + dialog tambah kode
 */
public class BubbleService extends Service {

    private static final int BUBBLE_SIZE_DP = 56;
    public static final String ACTION_SHOW_LOCK = "com.flowscompiler.template.SHOW_LOCK";

    private WindowManager wm;
    private TextView bubble;
    private WindowManager.LayoutParams bubbleLp;
    private LinearLayout menu;
    private FrameLayout lockView;
    private FrameLayout codeView;

    private int dp(int v) {
        return (int) (v * getResources().getDisplayMetrics().density);
    }

    private static int overlayType() {
        return Build.VERSION.SDK_INT >= 26
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;
    }

    @Override
    public IBinder onBind(Intent i) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        wm = (WindowManager) getSystemService(Context.WINDOW_SERVICE);
        startForeground(1, buildNotification());
        createBubble();
        // Kalau service mati saat terkunci, kunci lagi begitu hidup
        if (Store.isLocked(this)) showLock();
    }

    @Override
    public int onStartCommand(Intent i, int f, int id) {
        if (i != null && ACTION_SHOW_LOCK.equals(i.getAction())) {
            showLock();
        }
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        safeRemove(bubble);
        safeRemove(menu);
        safeRemove(lockView);
        safeRemove(codeView);
        super.onDestroy();
    }

    private void safeRemove(View v) {
        try {
            if (v != null && v.isAttachedToWindow()) wm.removeView(v);
        } catch (Exception ignored) {
        }
    }

    private Notification buildNotification() {
        String ch = "bubble";
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel c = new NotificationChannel(ch, "Bola ngambang",
                    NotificationManager.IMPORTANCE_MIN);
            getSystemService(NotificationManager.class).createNotificationChannel(c);
        }
        Notification.Builder b = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(this, ch) : new Notification.Builder(this);
        return b.setContentTitle("Flows Bubble aktif")
                .setContentText("Bola ngambang sedang berjalan")
                .setSmallIcon(android.R.drawable.ic_lock_idle_lock)
                .setOngoing(true)
                .build();
    }

    // ================= BOLA =================
    private void createBubble() {
        bubble = new TextView(this);
        bubble.setText("●");
        bubble.setTextColor(Color.WHITE);
        bubble.setTextSize(22);
        bubble.setGravity(Gravity.CENTER);
        GradientDrawable g = new GradientDrawable();
        g.setShape(GradientDrawable.OVAL);
        g.setColors(new int[]{Color.parseColor("#4f46e5"), Color.parseColor("#7c3aed")});
        g.setOrientation(GradientDrawable.Orientation.TL_BR);
        bubble.setBackground(g);
        bubble.setElevation(dp(6));

        int s = dp(BUBBLE_SIZE_DP);
        bubbleLp = new WindowManager.LayoutParams(s, s, overlayType(),
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.TRANSLUCENT);
        bubbleLp.gravity = Gravity.TOP | Gravity.START;
        bubbleLp.x = getResources().getDisplayMetrics().widthPixels - s - dp(12);
        bubbleLp.y = dp(240);

        bubble.setOnTouchListener(new View.OnTouchListener() {
            int startX, startY;
            float touchX, touchY;
            boolean moved;

            @Override
            public boolean onTouch(View v, MotionEvent e) {
                switch (e.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        startX = bubbleLp.x;
                        startY = bubbleLp.y;
                        touchX = e.getRawX();
                        touchY = e.getRawY();
                        moved = false;
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        int dx = (int) (e.getRawX() - touchX);
                        int dy = (int) (e.getRawY() - touchY);
                        if (Math.abs(dx) > dp(6) || Math.abs(dy) > dp(6)) moved = true;
                        if (moved) {
                            bubbleLp.x = startX + dx;
                            bubbleLp.y = startY + dy;
                            wm.updateViewLayout(bubble, bubbleLp);
                            hideMenu();
                        }
                        return true;
                    case MotionEvent.ACTION_UP:
                        if (!moved) toggleMenu();
                        return true;
                }
                return false;
            }
        });
        wm.addView(bubble, bubbleLp);
    }

    // ================= MENU KECIL =================
    private void toggleMenu() {
        if (menu != null && menu.isAttachedToWindow()) {
            hideMenu();
            return;
        }
        menu = new LinearLayout(this);
        menu.setOrientation(LinearLayout.VERTICAL);
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.WHITE);
        bg.setCornerRadius(dp(14));
        menu.setBackground(bg);
        menu.setElevation(dp(8));

        menu.addView(menuItem("🔒  Kunci Layar", v -> {
            hideMenu();
            Store.setLocked(this, true);
            showLock();
        }));
        menu.addView(menuItem("➕  Tambahkan Kode", v -> {
            hideMenu();
            showAddCode();
        }));

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                overlayType(),
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                        | WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
                PixelFormat.TRANSLUCENT);
        lp.gravity = Gravity.TOP | Gravity.START;
        int screenW = getResources().getDisplayMetrics().widthPixels;
        int menuW = dp(190);
        lp.x = Math.max(dp(8), Math.min(bubbleLp.x - menuW + dp(BUBBLE_SIZE_DP), screenW - menuW - dp(8)));
        lp.y = Math.max(dp(8), bubbleLp.y - dp(112));
        if (bubbleLp.y < dp(130)) lp.y = bubbleLp.y + dp(BUBBLE_SIZE_DP) + dp(6);

        menu.setOnTouchListener((v, e) -> {
            if (e.getAction() == MotionEvent.ACTION_OUTSIDE) hideMenu();
            return false;
        });
        wm.addView(menu, lp);
    }

    private Button menuItem(String t, View.OnClickListener l) {
        Button b = new Button(this);
        b.setText(t);
        b.setAllCaps(false);
        b.setTextSize(15);
        b.setTextColor(Color.parseColor("#222222"));
        b.setGravity(Gravity.CENTER_VERTICAL | Gravity.START);
        b.setBackgroundColor(Color.TRANSPARENT);
        b.setMinWidth(dp(190));
        b.setOnClickListener(l);
        return b;
    }

    private void hideMenu() {
        safeRemove(menu);
        menu = null;
    }

    // ================= KUNCI LAYAR (FULL SCREEN) =================
    private void showLock() {
        if (lockView != null && lockView.isAttachedToWindow()) return;
        hideMenu();
        bubble.setVisibility(View.GONE);

        // View yang menelan tombol Back
        lockView = new FrameLayout(this) {
            @Override
            public boolean dispatchKeyEvent(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.KEYCODE_BACK) return true;
                return super.dispatchKeyEvent(e);
            }
        };
        lockView.setBackgroundColor(Color.parseColor("#1e1b4b"));
        lockView.setClickable(true);   // telan semua sentuhan
        lockView.setFocusable(true);
        lockView.setFocusableInTouchMode(true);

        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        col.setGravity(Gravity.CENTER);
        col.setPadding(dp(32), dp(32), dp(32), dp(32));

        TextView icon = new TextView(this);
        icon.setText("🔒");
        icon.setTextSize(56);
        icon.setGravity(Gravity.CENTER);
        col.addView(icon);

        TextView title = new TextView(this);
        title.setText("Layar Terkunci");
        title.setTextColor(Color.WHITE);
        title.setTextSize(24);
        title.setGravity(Gravity.CENTER);
        col.addView(title);

        TextView sub = new TextView(this);
        sub.setText("Masukkan sandi atau kode untuk membuka");
        sub.setTextColor(Color.parseColor("#b3b0e0"));
        sub.setTextSize(14);
        sub.setGravity(Gravity.CENTER);
        sub.setPadding(0, dp(6), 0, dp(24));
        col.addView(sub);

        final EditText pin = new EditText(this);
        pin.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        pin.setGravity(Gravity.CENTER);
        pin.setTextColor(Color.BLACK);
        pin.setTextSize(20);
        GradientDrawable pbg = new GradientDrawable();
        pbg.setColor(Color.WHITE);
        pbg.setCornerRadius(dp(12));
        pin.setBackground(pbg);
        pin.setPadding(dp(16), dp(12), dp(16), dp(12));
        col.addView(pin, new LinearLayout.LayoutParams(dp(260), LinearLayout.LayoutParams.WRAP_CONTENT));

        final TextView err = new TextView(this);
        err.setTextColor(Color.parseColor("#f87171"));
        err.setTextSize(13);
        err.setGravity(Gravity.CENTER);
        err.setPadding(0, dp(8), 0, dp(8));
        col.addView(err);

        Button ok = new Button(this);
        ok.setText("Buka Kunci");
        ok.setAllCaps(false);
        ok.setTextColor(Color.WHITE);
        GradientDrawable obg = new GradientDrawable();
        obg.setColor(Color.parseColor("#7c3aed"));
        obg.setCornerRadius(dp(12));
        ok.setBackground(obg);
        col.addView(ok, new LinearLayout.LayoutParams(dp(260), dp(48)));

        Runnable tryUnlock = () -> {
            String in = pin.getText().toString();
            if (Store.checkAny(this, in)) {
                InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(pin.getWindowToken(), 0);
                Store.setLocked(this, false);
                safeRemove(lockView);
                lockView = null;
                bubble.setVisibility(View.VISIBLE);
            } else {
                err.setText("Sandi salah, coba lagi");
                pin.setText("");
            }
        };
        ok.setOnClickListener(v -> tryUnlock.run());
        pin.setOnEditorActionListener((v, a, e) -> {
            tryUnlock.run();
            return true;
        });

        lockView.addView(col, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                overlayType(),
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                        | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
                        | WindowManager.LayoutParams.FLAG_FULLSCREEN
                        | WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
                PixelFormat.OPAQUE);
        lp.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE;
        wm.addView(lockView, lp);
    }

    // ================= TAMBAHKAN KODE =================
    private void showAddCode() {
        if (codeView != null && codeView.isAttachedToWindow()) return;

        codeView = new FrameLayout(this);
        codeView.setBackgroundColor(Color.parseColor("#99000000"));
        codeView.setClickable(true);

        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(dp(20), dp(20), dp(20), dp(16));
        GradientDrawable bg = new GradientDrawable();
        bg.setColor(Color.WHITE);
        bg.setCornerRadius(dp(16));
        box.setBackground(bg);

        TextView t = new TextView(this);
        t.setText("Tambahkan Kode Cadangan");
        t.setTextSize(18);
        t.setTextColor(Color.BLACK);
        t.setTypeface(null, android.graphics.Typeface.BOLD);
        box.addView(t);

        TextView d = new TextView(this);
        d.setText("Kode cadangan juga bisa membuka Kunci Layar. Tersimpan: "
                + Store.codeCount(this));
        d.setTextSize(12);
        d.setTextColor(Color.GRAY);
        d.setPadding(0, dp(4), 0, dp(10));
        box.addView(d);

        final EditText cur = new EditText(this);
        cur.setHint("Sandi utama");
        cur.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        box.addView(cur);

        final EditText nw = new EditText(this);
        nw.setHint("Kode baru (min. 4 karakter)");
        nw.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
        box.addView(nw);

        LinearLayout row = new LinearLayout(this);
        row.setGravity(Gravity.END);
        row.setPadding(0, dp(12), 0, 0);
        Button cancel = new Button(this);
        cancel.setText("Batal");
        cancel.setAllCaps(false);
        Button save = new Button(this);
        save.setText("Simpan");
        save.setAllCaps(false);
        row.addView(cancel);
        row.addView(save);
        box.addView(row);

        cancel.setOnClickListener(v -> closeAddCode(cur));
        save.setOnClickListener(v -> {
            String c = nw.getText().toString();
            if (!Store.checkMain(this, cur.getText().toString())) {
                Toast.makeText(this, "Sandi utama salah", Toast.LENGTH_SHORT).show();
            } else if (c.length() < 4) {
                Toast.makeText(this, "Kode minimal 4 karakter", Toast.LENGTH_SHORT).show();
            } else {
                Store.addCode(this, c);
                Toast.makeText(this, "Kode ditambahkan", Toast.LENGTH_SHORT).show();
                closeAddCode(cur);
            }
        });

        FrameLayout.LayoutParams flp = new FrameLayout.LayoutParams(
                dp(300), FrameLayout.LayoutParams.WRAP_CONTENT, Gravity.CENTER);
        codeView.addView(box, flp);

        WindowManager.LayoutParams lp = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                overlayType(),
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN
                        | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.TRANSLUCENT);
        lp.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE;
        wm.addView(codeView, lp);
    }

    private void closeAddCode(View anyInside) {
        InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(anyInside.getWindowToken(), 0);
        safeRemove(codeView);
        codeView = null;
    }
}
