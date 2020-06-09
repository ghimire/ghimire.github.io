var ZoomSampleApp = (function () {
    var latestZoomSessionResult = null;
    var latestZoomIDScanResult = null;
    // Wait for onload to be complete before attempting to access the Browser SDK.
    window.onload = function () {
        // Set a the directory path for other ZoOm Resources.
        ZoomSDK.setResourceDirectory("../../../core-sdk/ZoomAuthentication.js/resources");
        // Set the directory path for required ZoOm images.
        ZoomSDK.setImagesDirectory("../../../core-sdk/zoom_images");
        // Initialize ZoOm and configure the UI features.
        ZoomSDK.initialize(ZoomGlobalState.DeviceLicenseKeyIdentifier, ZoomGlobalState.PublicFaceMapEncryptionKey, function (initializedSuccessfully) {
            if (initializedSuccessfully) {
                SampleAppUtilities.enableAllButtons();
                ZoomGlobalState.currentCustomization = new ZoomSDK.ZoomCustomization();
                SampleAppUtilities.configureGuidanceScreenTextForDevice();
            }
            SampleAppUtilities.displayStatus(ZoomSDK.getFriendlyDescriptionForZoomSDKStatus(ZoomSDK.getStatus()));
        });
        SampleAppUtilities.formatUIForDevice();
    };
    // Perform Liveness Check.
    function onLivenessCheckPressed() {
        SampleAppUtilities.fadeOutMainUIAndPrepareForZoOm();
        new LivenessCheckProcessor(onProcessingComplete, onServerSessionTokenError);
    }
    // Perform Enrollment, generating a username each time to guarantee uniqueness.
    function onEnrollUserPressed() {
        SampleAppUtilities.fadeOutMainUIAndPrepareForZoOm();
        new EnrollmentProcessor(onProcessingComplete, onServerSessionTokenError);
    }
    // Perform Authentication, using the username from Enrollment.
    function onAuthenticateUserPressed() {
        if (ZoomGlobalState.isRandomUsernameEnrolled == false) {
            SampleAppUtilities.displayStatus("Please enroll first before trying authentication.");
        }
        else {
            SampleAppUtilities.fadeOutMainUIAndPrepareForZoOm();
            new AuthenticateProcessor(onProcessingComplete, onServerSessionTokenError);
        }
    }
    // Perform Photo ID Match, generating a username each time to guarantee uniqueness.
    function onPhotoIDMatchPressed() {
        SampleAppUtilities.fadeOutMainUIAndPrepareForZoOm();
        new PhotoIDMatchProcessor(onPhotoIDMatchProcessingComplete, onServerSessionTokenError);
    }
    // Display audit trail images captured from user's last ZoOm Session (if available).
    function onViewAuditTrailPressed() {
        SampleAppUtilities.showAuditTrailImages(latestZoomSessionResult, latestZoomIDScanResult);
    }
    // Set a new customization for ZoOm.
    function onDesignShowcasePressed() {
        SampleAppUtilities.showNewTheme();
    }
    // Show the final result and transition back into the main interface.
    function onProcessingComplete(isSuccess, zoomSessionResult) {
        latestZoomSessionResult = zoomSessionResult;
        latestZoomIDScanResult = null;
        SampleAppUtilities.showResultStatusAndMainUI(isSuccess, zoomSessionResult);
    }
    // Show the final result and transition back into the main interface.
    function onPhotoIDMatchProcessingComplete(isSuccess, zoomSessionResult, zoomIDScanResult) {
        latestZoomSessionResult = zoomSessionResult;
        latestZoomIDScanResult = zoomIDScanResult;
        SampleAppUtilities.showResultStatusAndMainUIForPhotoIDMatch(isSuccess, zoomSessionResult, zoomIDScanResult);
    }
    function onServerSessionTokenError() {
        SampleAppUtilities.handleErrorGettingServerSessionToken();
    }
    return {
        onLivenessCheckPressed: onLivenessCheckPressed,
        onEnrollUserPressed: onEnrollUserPressed,
        onAuthenticateUserPressed: onAuthenticateUserPressed,
        onPhotoIDMatchPressed: onPhotoIDMatchPressed,
        onViewAuditTrailPressed: onViewAuditTrailPressed,
        onDesignShowcasePressed: onDesignShowcasePressed,
        latestZoomSessionResult: latestZoomSessionResult,
        latestZoomIDScanResult: latestZoomIDScanResult
    };
})();
