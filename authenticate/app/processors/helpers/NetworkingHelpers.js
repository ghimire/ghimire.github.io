// Demonstrates calling the FaceTec Managed Testing API and/or ZoOm Server.
// Possible directives after parsing the result from ZoOm Server.
var UXNextStep;
(function (UXNextStep) {
    UXNextStep[UXNextStep["Succeed"] = 0] = "Succeed";
    UXNextStep[UXNextStep["Retry"] = 1] = "Retry";
    UXNextStep[UXNextStep["Cancel"] = 2] = "Cancel";
})(UXNextStep = {});
;
// Possible directives after parsing the IDScan Result from ZoOm Server.
var IDScanUXNextStep;
(function (IDScanUXNextStep) {
    IDScanUXNextStep[IDScanUXNextStep["Succeed"] = 0] = "Succeed";
    IDScanUXNextStep[IDScanUXNextStep["Retry"] = 1] = "Retry";
    IDScanUXNextStep[IDScanUXNextStep["RetryInvalidId"] = 2] = "RetryInvalidId";
    IDScanUXNextStep[IDScanUXNextStep["Cancel"] = 3] = "Cancel";
})(IDScanUXNextStep = {});
;
;
var NetworkingHelpers = (function () {
    var latestXHR = new XMLHttpRequest();
    // Get the Session Token from the server
    function getSessionToken(sessionTokenCallback) {
        latestXHR = new XMLHttpRequest();
        latestXHR.open("GET", ZoomGlobalState.ZoomServerBaseURL + "/session-token");
        latestXHR.setRequestHeader("X-Device-License-Key", ZoomGlobalState.DeviceLicenseKeyIdentifier);
        latestXHR.setRequestHeader("X-User-Agent", ZoomSDK.createZoomAPIUserAgentString(""));
        latestXHR.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                var sessionToken = "";
                try {
                    // Attempt to get the sessionToken from the response object.
                    sessionToken = JSON.parse(this.responseText).data.sessionToken;
                }
                catch (_a) {
                    // Something went wrong in parsing the response. Return an error.
                    sessionTokenCallback.onError();
                    return;
                }
                sessionTokenCallback.onResponse(sessionToken);
            }
        };
        latestXHR.onerror = function () {
            sessionTokenCallback.onError();
        };
        latestXHR.send();
    }
    // Create and send the request.  Parse the results and send the caller what the next step should be (Succeed, Retry, or Cancel).
    function getLivenessCheckResponseFromZoomServer(zoomSessionResult, zoomFaceMapResultCallback, resultCallback) {
        zoomSessionResult.faceMetrics.getFaceMapBase64(function (faceMapBase64) {
            var parameters = {
                sessionId: zoomSessionResult.sessionId,
                faceMap: faceMapBase64,
                lowQualityAuditTrailImage: zoomSessionResult.faceMetrics.getLowQualityAuditTrailCompressedBase64()[0],
                auditTrailImage: zoomSessionResult.faceMetrics.getAuditTrailCompressedBase64()[0]
            };
            callToZoomServerForResult("/liveness", parameters, zoomSessionResult.sessionId, zoomFaceMapResultCallback, function (responseJSON) {
                var nextStep = ServerResultHelpers.getLivenessNextStep(responseJSON);
                resultCallback(nextStep);
            });
        });
    }
    // Create and send the request.  Parse the results and send the caller what the next step should be (Succeed, Retry, or Cancel).
    function getEnrollmentResponseFromZoomServer(zoomSessionResult, zoomFaceMapResultCallback, resultCallback) {
        zoomSessionResult.faceMetrics.getFaceMapBase64(function (faceMapBase64) {
            var parameters = {
                sessionId: zoomSessionResult.sessionId,
                faceMap: faceMapBase64,
                enrollmentIdentifier: ZoomGlobalState.randomUsername,
                lowQualityAuditTrailImage: zoomSessionResult.faceMetrics.getLowQualityAuditTrailCompressedBase64()[0],
                auditTrailImage: zoomSessionResult.faceMetrics.getAuditTrailCompressedBase64()[0]
            };
            callToZoomServerForResult("/enrollment", parameters, zoomSessionResult.sessionId, zoomFaceMapResultCallback, function (responseJSON) {
                var nextStep = ServerResultHelpers.getEnrollmentNextStep(responseJSON);
                resultCallback(nextStep);
            });
        });
    }
    // Create and send the request.  Parse the results and send the caller what the next step should be (Succeed, Retry, or Cancel).
    function getAuthenticateResponseFromZoomServer(zoomSessionResult, zoomFaceMapResultCallback, resultCallback) {
        zoomSessionResult.faceMetrics.getFaceMapBase64(function (faceMapBase64) {
            var parameters = {
                sessionId: zoomSessionResult.sessionId,
                source: { enrollmentIdentifier: ZoomGlobalState.randomUsername },
                target: { faceMap: faceMapBase64 },
                lowQualityAuditTrailImage: zoomSessionResult.faceMetrics.getLowQualityAuditTrailCompressedBase64()[0],
                auditTrailImage: zoomSessionResult.faceMetrics.getAuditTrailCompressedBase64()[0]
            };
            callToZoomServerForResult("/match-3d-3d", parameters, zoomSessionResult.sessionId, zoomFaceMapResultCallback, function (responseJSON) {
                var nextStep = ServerResultHelpers.getAuthenticateNextStep(responseJSON);
                resultCallback(nextStep);
            });
        });
    }
    // Create and send the request.  Parse the results and send the caller what the next step should be (Succeed, Retry, or Cancel).
    function getPhotoIDMatchResponseFromServer(zoomIDScanResult, zoomIDScanResultCallback, resultCallback) {
        zoomIDScanResult.idScanMetrics.getIDScanBase64(function (idScanBase64) {
            var parameters = {
                sessionId: zoomIDScanResult.sessionId,
                enrollmentIdentifier: ZoomGlobalState.randomUsername,
                idScan: idScanBase64,
                idScanFrontImage: zoomIDScanResult.idScanMetrics.getFrontImagesCompressedBase64()[0]
            };
            if (zoomIDScanResult.idScanMetrics.getBackImagesCompressedBase64()[0]) {
                parameters.idScanBackImage = zoomIDScanResult.idScanMetrics.getBackImagesCompressedBase64()[0];
            }
            callToZoomServerForResult("/id-check", parameters, zoomIDScanResult.sessionId, zoomIDScanResultCallback, function (responseJSON) {
                var nextStep = ServerResultHelpers.getPhotoIDMatchNextStep(responseJSON);
                resultCallback(nextStep);
            });
        });
    }
    // Makes the actual call to the API.
    // Note that for initial integration this sends to the FaceTec Managed Testing API.
    // After deployment of your own instance of ZoOm Server, this will be your own configurable endpoint.
    function callToZoomServerForResult(endpoint, parameters, sessionId, zoomResultCallback, resultCallback) {
        latestXHR = new XMLHttpRequest();
        latestXHR.open("POST", ZoomGlobalState.ZoomServerBaseURL + endpoint);
        latestXHR.setRequestHeader("X-Device-License-Key", ZoomGlobalState.DeviceLicenseKeyIdentifier);
        latestXHR.setRequestHeader("X-User-Agent", ZoomSDK.createZoomAPIUserAgentString(sessionId));
        latestXHR.setRequestHeader("Content-Type", "application/json");
        latestXHR.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                var responseJSON = "";
                try {
                    // Attempt to parse the response object.
                    responseJSON = JSON.parse(this.responseText);
                }
                catch (_a) {
                    // Something went wrong while parsing the response. Cancel the session.
                    zoomResultCallback.cancel();
                    return;
                }
                resultCallback(responseJSON);
            }
        };
        latestXHR.onerror = function () {
            zoomResultCallback.cancel();
        };
        // Sessions will timeout if onprogress is not called within 60 seconds
        latestXHR.upload.onprogress = function name(event) {
            var progress = event.loaded / event.total;
            zoomResultCallback.uploadProgress(progress);
        };
        var jsonUpload = JSON.stringify(parameters);
        latestXHR.send(jsonUpload);
        // After a short delay, if upload is not complete, update the upload message text to notify the user of the in-progress request.
        setTimeout(function () {
            if (latestXHR.readyState === XMLHttpRequest.DONE) {
                return;
            }
            zoomResultCallback.uploadMessageOverride("Still Uploading...");
        }, 6000);
    }
    function cancelInFlightRequests() {
        latestXHR.abort();
        latestXHR = new XMLHttpRequest();
    }
    return {
        cancelInFlightRequests: cancelInFlightRequests,
        latestXHR: latestXHR,
        UXNextStep: UXNextStep,
        IDScanUXNextStep: IDScanUXNextStep,
        getLivenessCheckResponseFromZoomServer: getLivenessCheckResponseFromZoomServer,
        getEnrollmentResponseFromZoomServer: getEnrollmentResponseFromZoomServer,
        getAuthenticateResponseFromZoomServer: getAuthenticateResponseFromZoomServer,
        getPhotoIDMatchResponseFromServer: getPhotoIDMatchResponseFromServer,
        getSessionToken: getSessionToken
    };
})();
// Helpers for parsing API response to determine if result was a success vs. user needs retry vs. unexpected (cancel out).
// Developers are encouraged to change API call parameters and results to fit their own.
var ServerResultHelpers = /** @class */ (function () {
    function ServerResultHelpers() {
    }
    // If livenessStatus is Liveness Proven, succeed.  Otherwise fail.  Unexpected responses cancel.
    ServerResultHelpers.getLivenessNextStep = function (responseJSON) {
        if (responseJSON["data"] && responseJSON["data"]["livenessStatus"] == 0) {
            return UXNextStep.Succeed;
        }
        else if (responseJSON["data"] && responseJSON["data"]["livenessStatus"] == 1) {
            return UXNextStep.Retry;
        }
        else {
            return UXNextStep.Cancel;
        }
    };
    // If isEnrolled and livenessStatus is Liveness Proven, succeed.  Otherwise retry.  Unexpected responses cancel.
    ServerResultHelpers.getEnrollmentNextStep = function (responseJSON) {
        if (responseJSON && responseJSON.meta && responseJSON.meta.code === 200 && responseJSON.data && responseJSON.data.isEnrolled && responseJSON.data.livenessStatus === 0) {
            return UXNextStep.Succeed;
        }
        else if (responseJSON && responseJSON.meta && responseJSON.meta.code === 200 && responseJSON.data && responseJSON.data.isEnrolled === false) {
            return UXNextStep.Retry;
        }
        else {
            return UXNextStep.Cancel;
        }
    };
    // If isEnrolled and livenessStatus is Liveness Proven, succeed.  Otherwise retry.  Unexpected responses cancel.
    ServerResultHelpers.getAuthenticateNextStep = function (responseJSON) {
        // If both FaceMaps have Liveness Proven, and Match Level is 10 (1 in 4.2 million), then succeed.  Otherwise retry.  Unexpected responses cancel.
        if (responseJSON && responseJSON.data && responseJSON.data.matchLevel != null && responseJSON.data.matchLevel === 10
            && responseJSON.data.sourceFaceMap && responseJSON.data.sourceFaceMap.livenessStatus === 0
            && responseJSON.data.targetFaceMap && responseJSON.data.targetFaceMap.livenessStatus === 0) {
            return UXNextStep.Succeed;
        }
        else if (responseJSON && responseJSON.data
            && responseJSON.data.sourceFaceMap
            && responseJSON.data.targetFaceMap
            && responseJSON.data.matchLevel != null
            && (responseJSON.data.sourceFaceMap.livenessStatus !== 0 || responseJSON.data.targetFaceMap.livenessStatus !== 0 || responseJSON.data.matchLevel !== 10)) {
            return UXNextStep.Retry;
        }
        else {
            return UXNextStep.Cancel;
        }
    };
    // If Liveness Proven on FaceMap, and Match Level between FaceMap and ID Photo is non-zero, then succeed.  Otherwise retry.  Unexpected responses cancel.
    ServerResultHelpers.getPhotoIDMatchNextStep = function (responseJSON) {
        // If Liveness Proven on FaceMap, and Match Level between FaceMap and ID Photo is non-zero, then succeed.  Otherwise retry.  Unexpected responses cancel.
        if (responseJSON && responseJSON.meta && responseJSON.meta.ok && responseJSON.meta.ok === true && responseJSON.data
            && responseJSON.data.livenessStatus === 0 && responseJSON.data.matchLevel != null && responseJSON.data.matchLevel !== 0) {
            return IDScanUXNextStep.Succeed;
        }
        else if (responseJSON && responseJSON.data
            && responseJSON.data.matchLevel != null
            && (responseJSON.data.livenessStatus !== 0 || responseJSON.data.matchLevel === 0)) {
            if (responseJSON.data.fullIDStatus === 1) {
                return IDScanUXNextStep.RetryInvalidId;
            }
            else {
                return IDScanUXNextStep.Retry;
            }
        }
        else {
            return IDScanUXNextStep.Cancel;
        }
    };
    return ServerResultHelpers;
}());
