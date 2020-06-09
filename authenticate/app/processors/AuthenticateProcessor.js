// Demonstrates performing an Authentication against a previously enrolled user.
var AuthenticateProcessor = /** @class */ (function () {
    function AuthenticateProcessor(onComplete, onSessionTokenError) {
        this.isSuccess = false;
        this.zoomFaceMapResultCallback = null;
        this.latestZoomSessionResult = null;
        this.onComplete = onComplete;
        this.onSessionTokenError = onSessionTokenError;
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
    AuthenticateProcessor.prototype.processZoomSessionResultWhileZoomWaits = function (zoomSessionResult, zoomFaceMapResultCallback) {
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
        NetworkingHelpers.getAuthenticateResponseFromZoomServer(zoomSessionResult, zoomFaceMapResultCallback, function (nextStep) {
            if (nextStep == UXNextStep.Succeed) {
                // Dynamically set the success message.
                ZoomSDK.ZoomCustomization.setOverrideResultScreenSuccessMessage("Authenticated");
                zoomFaceMapResultCallback.succeed();
                _this.isSuccess = true;
            }
            else if (nextStep == UXNextStep.Retry) {
                zoomFaceMapResultCallback.retry();
            }
            else {
                zoomFaceMapResultCallback.cancel();
            }
        });
    };
    return AuthenticateProcessor;
}());
var AuthenticateProcessor = AuthenticateProcessor;
