package com.flowscompiler.template;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.provider.Settings;

/** Menyalakan lagi bola ngambang otomatis setelah HP direstart. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        if (Store.hasPassword(c) && Store.bubbleEnabled(c) && Settings.canDrawOverlays(c)) {
            Intent s = new Intent(c, BubbleService.class);
            if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(s);
            else c.startService(s);
        }
    }
}
