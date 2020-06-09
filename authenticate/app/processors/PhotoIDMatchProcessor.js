// Demonstrates performing a ZoOm Session, proving Liveness, then scanning the ID and performing a Photo ID Match.
var PhotoIDMatchProcessor = /** @class */ (function () {
    function PhotoIDMatchProcessor(onComplete, onSessionTokenError) {
        this.isSuccess = false;
        this.zoomFaceMapResultCallback = null;
        this.latestZoomSessionResult = null;
        this.zoomIDScanResultCallback = null;
        this.latestZoomIDScanResult = null;
        this.onComplete = onComplete;
        this.onSessionTokenError = onSessionTokenError;
        // For demonstration purposes, generate a new uuid for each Photo ID Match.  Enroll this in the DB and compare against the ID after it is scanned.
        ZoomGlobalState.randomUsername = "browser_sample_app_" + SampleAppUtilities.generateUUId();
        ZoomGlobalState.isRandomUsernameEnrolled = false;
        var _this = this;
        var onZoomSessionComplete = function () {
            _this.onComplete(_this.isSuccess, _this.latestZoomSessionResult, _this.latestZoomIDScanResult);
        };
        NetworkingHelpers.getSessionToken({
            onResponse: function (sessionToken) {
                // Launch the ZoOm Session.
                new ZoomSDK.ZoomSession(onZoomSessionComplete, _this, _this, sessionToken);
            }, onError: function () {
                _this.onSessionTokenError();
            }
        });
    }
    // Required function that handles calling ZoOm Server to get result and decides how to continue.
    PhotoIDMatchProcessor.prototype.processZoomSessionResultWhileZoomWaits = function (zoomSessionResult, zoomFaceMapResultCallback) {
        var _this = this;
        _this.latestZoomSessionResult = zoomSessionResult;
        _this.zoomFaceMapResultCallback = zoomFaceMapResultCallback;
        // cancellation, timeout, etc.
        if (zoomSessionResult.status !== ZoomSDK.ZoomSessionStatus.SessionCompletedSuccessfully || !zoomSessionResult.faceMetrics.faceMap || !zoomSessionResult.faceMetrics.faceMap.size) {
            NetworkingHelpers.cancelInFlightRequests(); // if upload is taking place and user cancels/context switches, abort the in-flight request
            zoomFaceMapResultCallback.cancel();
            return;
        }
        // Create and parse request to ZoOm Server.  Note here that for Photo ID Match, onFaceMapResultSucceed sends you to the next phase (ID Scan) rather than completing.
        NetworkingHelpers.getEnrollmentResponseFromZoomServer(zoomSessionResult, zoomFaceMapResultCallback, function (nextStep) {
            if (nextStep == UXNextStep.Succeed) {
                // Dynamically set the success message.
                ZoomSDK.ZoomCustomization.setOverrideResultScreenSuccessMessage("Liveness\r\nConfirmed");
                zoomFaceMapResultCallback.succeed();
            }
            else if (nextStep == UXNextStep.Retry) {
                zoomFaceMapResultCallback.retry();
            }
            else {
                zoomFaceMapResultCallback.cancel();
            }
        });
    };
    // Required function that handles calling ZoOm Server to get result and decides how to continue.
    PhotoIDMatchProcessor.prototype.processZoomIDScanResultWhileZoomWaits = function (zoomIDScanResult, zoomIDScanResultCallback) {
        var _this = this;
        _this.latestZoomIDScanResult = zoomIDScanResult;
        _this.zoomIDScanResultCallback = zoomIDScanResultCallback;
        // cancellation, timeout, etc.
        if (zoomIDScanResult.status != ZoomSDK.ZoomIDScanStatus.ZoomIDScanStatusSuccess || !zoomIDScanResult.idScanMetrics.idScan) {
            NetworkingHelpers.cancelInFlightRequests(); // if upload is taking place and user cancels/context switches, abort the in-flight request
            zoomIDScanResultCallback.cancel();
            return;
        }
        NetworkingHelpers.getPhotoIDMatchResponseFromServer(zoomIDScanResult, zoomIDScanResultCallback, function (nextStep) {
            if (nextStep == IDScanUXNextStep.Succeed) {
                // Dynamically set the success message.
                ZoomSDK.ZoomCustomization.setOverrideResultScreenSuccessMessage("Your 3D Face\r\nMatched Your ID");
                zoomIDScanResultCallback.succeed();
                _this.isSuccess = true;
            }
            else if (nextStep == IDScanUXNextStep.Retry) {
                zoomIDScanResultCallback.retry(ZoomSDK.ZoomIDScanRetryMode.Front);
            }
            else if (nextStep == IDScanUXNextStep.RetryInvalidId) {
                zoomIDScanResultCallback.retry(ZoomSDK.ZoomIDScanRetryMode.Front, "Photo ID\nNot Fully Visible");
            }
            else {
                zoomIDScanResultCallback.cancel();
            }
        });
    };
    return PhotoIDMatchProcessor;
}());
var PhotoIDMatchProcessor = PhotoIDMatchProcessor;
