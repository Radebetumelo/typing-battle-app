package com.typingbattleapp;

import android.app.Activity;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ActivityEventListener;

import androidx.annotation.NonNull;

public class ScreenRecorderModule extends ReactContextBaseJavaModule {
    private static final int SCREEN_RECORD_REQUEST_CODE = 1234;
    private final ReactApplicationContext reactContext;
    private Promise recordingPromise;

    public ScreenRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        reactContext.addActivityEventListener(new ActivityEventListener() {
            @Override
            public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
                if (requestCode == SCREEN_RECORD_REQUEST_CODE && recordingPromise != null) {
                    if (resultCode == Activity.RESULT_OK) {
                        recordingPromise.resolve("Recording started");
                    } else {
                        recordingPromise.reject("RECORDING_DENIED", "User denied screen recording permission.");
                    }
                    recordingPromise = null;
                }
            }

            @Override
            public void onNewIntent(Intent intent) {
            }
        });
    }

    @NonNull
    @Override
    public String getName() {
        return "ScreenRecorder";
    }

    @ReactMethod
    public void startRecording(Promise promise) {
        this.recordingPromise = promise;
        Activity activity = getCurrentActivity();
        if (activity != null) {
            MediaProjectionManager mgr = (MediaProjectionManager) activity
                    .getSystemService(Activity.MEDIA_PROJECTION_SERVICE);
            Intent captureIntent = mgr.createScreenCaptureIntent();
            activity.startActivityForResult(captureIntent, SCREEN_RECORD_REQUEST_CODE);
        } else {
            promise.reject("NO_ACTIVITY", "Current activity is null.");
        }
    }

    @ReactMethod
    public void stopRecording(Promise promise) {
        // Placeholder - you can stop recording logic here if using a foreground
        // service.
        promise.resolve("Recording stopped (not yet implemented).");
    }
}
