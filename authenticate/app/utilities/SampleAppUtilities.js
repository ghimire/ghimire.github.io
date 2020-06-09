var SampleAppUtilities = (function () {
    var currentTheme = "ZoOm Theme";
    function displayStatus(message) {
        document.getElementById("status").innerHTML = message;
    }
    function fadeInMainUI() {
        $("#theme-transition-overlay").fadeOut(800);
        $(".wrapping-box-container").fadeIn(800);
    }
    // Disable buttons to prevent hammering, fade out main interface elements, and shuffle the guidance images.
    function fadeOutMainUIAndPrepareForZoOm() {
        disableAllButtons();
        $(".wrapping-box-container").fadeOut(800);
        $("#theme-transition-overlay").fadeIn(800);
    }
    function disableAllButtons() {
        $("#enroll-button").prop("disabled", true);
        $("#zoom-id-scan-button").prop("disabled", true);
        $("#liveness-button").prop("disabled", true);
        $("#authenticate-button").prop("disabled", true);
        $("#audit-trail-button").prop("disabled", true);
        $("#design-showcase-button").prop("disabled", true);
    }
    function enableAllButtons() {
        $("#enroll-button").prop("disabled", false);
        $("#zoom-id-scan-button").prop("disabled", false);
        $("#liveness-button").prop("disabled", false);
        $("#authenticate-button").prop("disabled", false);
        $("#audit-trail-button").prop("disabled", false);
        $("#design-showcase-button").prop("disabled", false);
    }
    function fadeInBlurOverlay() {
        document.getElementById("controls").classList.add("blur-content");
    }
    function fadeOutBlurOverlay() {
        if (document.getElementById("controls").classList.contains("blur-content")) {
            document.getElementById("controls").classList.remove("blur-content");
        }
    }
    function showAuditTrailImages(zoomSessionResult, zoomIDScanResult) {
        var auditTrailImages = [];
        if (zoomSessionResult != null && zoomSessionResult.faceMetrics != null && zoomSessionResult.faceMetrics.getAuditTrailCompressedBase64()[0] != null) {
            disableAllButtons();
            fadeInBlurOverlay();
            // Add the regular audit trail images
            zoomSessionResult.faceMetrics.getAuditTrailCompressedBase64().forEach(function (image) {
                auditTrailImages.push("data:image/jpeg;base64," + image);
            });
            if (zoomIDScanResult != null && zoomIDScanResult.idScanMetrics != null && zoomIDScanResult.idScanMetrics.getFrontImagesCompressedBase64()[0] != null) {
                // Add ID Scan front images
                auditTrailImages.unshift("data:image/jpeg;base64," + zoomIDScanResult.idScanMetrics.getFrontImagesCompressedBase64()[0]);
            }
            auditTrailImages.forEach(function (img) {
                addDismissibleImagePopUp(img);
            });
        }
        else {
            displayStatus("No Audit Trail Images");
        }
    }
    function addDismissibleImagePopUp(img) {
        var auditTrailOverlay = document.createElement('div');
        var auditTrailImage = new Image();
        auditTrailImage.src = img;
        auditTrailImage.classList.add("audit-trail-image");
        auditTrailOverlay.classList.add("audit-trail-overlay");
        auditTrailOverlay.onclick = function () {
            if (document.querySelectorAll(".audit-trail-overlay").length === 1) {
                fadeOutBlurOverlay();
                $(this).fadeOut(300);
                var _this = this;
                setTimeout(function () {
                    enableAllButtons();
                    $(_this).remove();
                }, 500);
            }
            else {
                $(this).remove();
            }
        };
        auditTrailOverlay.append(auditTrailImage);
        $("#controls").append(auditTrailOverlay);
    }
    function showNewTheme() {
        var themes = ["ZoOm Theme", "Pseudo-Fullscreen", "Well-Rounded", "Bitcoin Exchange", "eKYC", "Sample Bank"];
        var currentThemeIndex = themes.indexOf(currentTheme);
        currentThemeIndex = currentThemeIndex >= themes.length - 1 ? 0 : currentThemeIndex + 1;
        currentTheme = themes[currentThemeIndex];
        updateThemeTransitionView();
        ThemeHelpers.setAppTheme(currentTheme);
        displayStatus("Theme set to: " + currentTheme);
    }
    function updateThemeTransitionView() {
        var transitionViewImage = "";
        var transitionViewClass = "theme-transition-overlay__";
        var deviceType = ZoomSDK.getBrowserSupport().isMobileDevice ? "mobile" : "desktop";
        switch (currentTheme) {
            case "ZoOm Theme":
                transitionViewClass = "default";
                break;
            case "Pseudo-Fullscreen":
                transitionViewClass += "default";
                break;
            case "Well-Rounded":
                transitionViewImage = ThemeHelpers.themeResourceDirectory + "well-rounded/well_rounded_" + deviceType + "_bg.svg";
                transitionViewClass += "well-rounded";
                break;
            case "Bitcoin Exchange":
                transitionViewImage = ThemeHelpers.themeResourceDirectory + "bitcoin-exchange/bitcoin_exchange_" + deviceType + "_bg.svg";
                transitionViewClass += "bitcoin-exchange";
                break;
            case "eKYC":
                transitionViewImage = ThemeHelpers.themeResourceDirectory + "ekyc/ekyc_" + deviceType + "_bg.svg";
                transitionViewClass += "ekyc";
                break;
            case "Sample Bank":
                transitionViewImage = ThemeHelpers.themeResourceDirectory + "sample-bank/sample_bank_" + deviceType + "_bg.svg";
                transitionViewClass += "sample-bank";
                break;
            default:
                break;
        }
        transitionViewClass += "__" + deviceType;
        $("#theme-transition-overlay-img").attr("src", transitionViewImage);
        document.getElementById("theme-transition-overlay").className = transitionViewClass;
    }
    function showResultStatusAndMainUI(isSuccess, zoomSessionResult) {
        fadeInMainUI();
        enableAllButtons();
        if (isSuccess) {
            displayStatus("Success");
        }
        else {
            var statusString = "Unsuccessful. ";
            if (zoomSessionResult.status == ZoomSDK.ZoomSessionStatus.SessionCompletedSuccessfully) {
                statusString += "Session was completed but an unexpected issue occurred during the network request.";
            }
            else {
                statusString += ZoomSDK.getFriendlyDescriptionForZoomSessionStatus(zoomSessionResult.status);
            }
            displayStatus(statusString);
        }
    }
    function showResultStatusAndMainUIForPhotoIDMatch(isSuccess, zoomSessionResult, zoomIDScanResult) {
        fadeInMainUI();
        enableAllButtons();
        if (isSuccess) {
            displayStatus("Success");
        }
        else {
            var statusString = "Unsuccessful. ";
            if (zoomIDScanResult != null && zoomIDScanResult.status != null) {
                statusString += ZoomSDK.getFriendlyDescriptionForZoomIDScanStatus(zoomIDScanResult.status);
            }
            else {
                if (zoomSessionResult.status == ZoomSDK.ZoomSessionStatus.SessionCompletedSuccessfully) {
                    statusString += "Session was completed but an unexpected issue occurred during the network request.";
                }
                else {
                    statusString += ZoomSDK.getFriendlyDescriptionForZoomSessionStatus(zoomSessionResult.status);
                }
            }
            displayStatus(statusString);
        }
    }
    function handleErrorGettingServerSessionToken() {
        fadeInMainUI();
        enableAllButtons();
        displayStatus("Session could not be started due to an unexpected issue during the network request.");
    }
    function generateUUId() {
        //@ts-ignore
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
            return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
        });
    }
    function formatUIForDevice() {
        if (ZoomSDK.getBrowserSupport().isMobileDevice) {
            // Adjust button sizing
            document.querySelectorAll("#controls > button").forEach(function (element) {
                if (element.className === "big-button") {
                    element.style.height = "40px";
                    element.style.fontSize = "18px";
                }
                else if (element.className === "medium-button") {
                    element.style.height = "30px";
                    element.style.fontSize = "14px";
                }
                element.style.width = "220px";
            });
            // Hide border around control panel
            document.getElementById("controls").style.borderColor = "transparent";
            // Hide status label text background and decrease label font size
            document.getElementById("status").style.backgroundColor = "transparent";
            document.getElementById("status").style.fontSize = "12px";
            // Move logo above buttons
            document.getElementById("custom-logo-container").parentNode.insertBefore(document.getElementById("custom-logo-container"), document.getElementById("custom-logo-container").parentNode.firstChild);
            document.getElementById("custom-logo-container").style.margin = "0 auto";
            document.querySelector("#custom-logo-container img").style.height = "55px";
            // Center control interface on screen
            document.getElementsByClassName("wrapping-box-container")[0].style.top = "50%";
            document.getElementsByClassName("wrapping-box-container")[0].style.left = "50%";
            document.getElementsByClassName("wrapping-box-container")[0].style.transform = "translate(-50%, -50%)";
        }
    }
    function configureGuidanceScreenTextForDevice() {
        if (ZoomSDK.getBrowserSupport().isMobileDevice) {
            // using strings with breaks for Ready Screen text on mobile devices
            ZoomGlobalState.currentCustomization.guidanceCustomization.readyScreenHeaderAttributedString = "Get Ready For<br/>Your Video Selfie";
            ZoomGlobalState.currentCustomization.guidanceCustomization.readyScreenSubtextAttributedString = "Please Frame Your Face In<br/>The Small Oval, Then The Big Oval";
        }
        ZoomSDK.setCustomization(ZoomGlobalState.currentCustomization);
    }
    return {
        displayStatus: displayStatus,
        fadeInMainUI: fadeInMainUI,
        fadeOutMainUIAndPrepareForZoOm: fadeOutMainUIAndPrepareForZoOm,
        disableAllButtons: disableAllButtons,
        enableAllButtons: enableAllButtons,
        showResultStatusAndMainUI: showResultStatusAndMainUI,
        generateUUId: generateUUId,
        formatUIForDevice: formatUIForDevice,
        showResultStatusAndMainUIForPhotoIDMatch: showResultStatusAndMainUIForPhotoIDMatch,
        addDismissibleImagePopUp: addDismissibleImagePopUp,
        showNewTheme: showNewTheme,
        showAuditTrailImages: showAuditTrailImages,
        handleErrorGettingServerSessionToken: handleErrorGettingServerSessionToken,
        configureGuidanceScreenTextForDevice: configureGuidanceScreenTextForDevice
    };
})();
