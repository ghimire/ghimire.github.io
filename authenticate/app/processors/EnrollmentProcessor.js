// Demonstrates performing an Enrollment.
var EnrollmentProcessor = /** @class */ (function () {
    function EnrollmentProcessor(onComplete, onSessionTokenError) {
        this.isSuccess = false;
        this.zoomFaceMapResultCallback = null;
        this.latestZoomSessionResult = null;
        this.onComplete = onComplete;
        this.onSessionTokenError = onSessionTokenError;
        // For demonstration purposes, generate a new uuid for each user and flag as successfully enrolled on succeed.  Reset enrollment status each enrollment attempt.
        ZoomGlobalState.randomUsername = "browser_sample_app_" + SampleAppUtilities.generateUUId();
        ZoomGlobalState.isRandomUsernameEnrolled = false;
        var _this = this;
        var onZoomSessionComplete = function () {
            _this.onComplete(_this.isSuccess, _this.latestZoomSessionResult);
        };
        NetworkingHelpers.getSessionToken({
            onResponse: function (sessionToken) {
                // Launch the ZoOm Session.
                new ZoomSDK.ZoomSession(onZoomSessionComplete, _this, sessionToken);
            }, onError: function () {
                _this.onSessionTokenError();
            }
        });
    }
    // Required function that handles calling ZoOm Server to get result and decides how to continue.
    EnrollmentProcessor.prototype.processZoomSessionResultWhileZoomWaits = function (zoomSessionResult, zoomFaceMapResultCallback) {
        var _this = this;
        _this.latestZoomSessionResult = zoomSessionResult;
        _this.zoomFaceMapResultCallback = zoomFaceMapResultCallback;
        // cancellation, timeout, etc.
        if (zoomSessionResult.status !== ZoomSDK.ZoomSessionStatus.SessionCompletedSuccessfully || !zoomSessionResult.faceMetrics.faceMap || !zoomSessionResult.faceMetrics.faceMap.size) {
            NetworkingHelpers.cancelInFlightRequests(); // if upload is taking place and user cancels/context switches, abort the in-flight request
            zoomFaceMapResultCallback.cancel();
            return;
        }
        // Create and parse request to ZoOm Server.
        NetworkingHelpers.getEnrollmentResponseFromZoomServer(zoomSessionResult, zoomFaceMapResultCallback, function (nextStep) {
            if (nextStep == UXNextStep.Succeed) {
                // Dynamically set the success message.
                ZoomSDK.ZoomCustomization.setOverrideResultScreenSuccessMessage("Enrollment\r\nSucceeded");
                zoomFaceMapResultCallback.succeed();
                _this.isSuccess = true;
                ZoomGlobalState.isRandomUsernameEnrolled = true;
            }
            else if (nextStep == UXNextStep.Retry) {
                zoomFaceMapResultCallback.retry();
            }
            else {
                zoomFaceMapResultCallback.cancel();
            }
        });
    };
    return EnrollmentProcessor;
}());
var EnrollmentProcessor = EnrollmentProcessor;
