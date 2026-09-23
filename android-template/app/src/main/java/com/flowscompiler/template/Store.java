package com.flowscompiler.template;

import android.content.Context;
import android.content.SharedPreferences;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.util.HashSet;
import java.util.Set;

/** Penyimpanan sandi (hash SHA-256 + salt) dan kode cadangan untuk fitur Kunci Layar. */
public class Store {
    private static final String SALT = "flowscompiler.bubble.v1:";

    static SharedPreferences p(Context c) {
        return c.getApplicationContext().getSharedPreferences("bubble_lock", Context.MODE_PRIVATE);
    }

    static String hash(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] b = md.digest((SALT + s).getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte x : b) sb.append(String.format("%02x", x));
            return sb.toString();
        } catch (UnsupportedEncodingException | java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    static boolean hasPassword(Context c) {
        return p(c).getString("pw", null) != null;
    }

    static void setPassword(Context c, String pw) {
        p(c).edit().putString("pw", hash(pw)).apply();
    }

    static boolean checkMain(Context c, String in) {
        String saved = p(c).getString("pw", null);
        return saved != null && saved.equals(hash(in));
    }

    /** Cocok dengan sandi utama ATAU salah satu kode cadangan. */
    static boolean checkAny(Context c, String in) {
        if (in == null || in.isEmpty()) return false;
        if (checkMain(c, in)) return true;
        return p(c).getStringSet("codes", new HashSet<String>()).contains(hash(in));
    }

    static void addCode(Context c, String code) {
        Set<String> cur = new HashSet<>(p(c).getStringSet("codes", new HashSet<String>()));
        cur.add(hash(code));
        p(c).edit().putStringSet("codes", cur).apply();
    }

    static int codeCount(Context c) {
        return p(c).getStringSet("codes", new HashSet<String>()).size();
    }

    static boolean isLocked(Context c) {
        return p(c).getBoolean("locked", false);
    }

    static void setLocked(Context c, boolean v) {
        p(c).edit().putBoolean("locked", v).apply();
    }

    static boolean bubbleEnabled(Context c) {
        return p(c).getBoolean("bubble_enabled", false);
    }

    static void setBubbleEnabled(Context c, boolean v) {
        p(c).edit().putBoolean("bubble_enabled", v).apply();
    }
}
