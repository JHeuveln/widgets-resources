// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import ReactNative from "react-native";

/**
 * Action to invoke the native sharing mechanism of the device.
 * @param {string} url - The url to share.
 * @param {string} text - The text to share.
 * @param {string} title - Title of the message to share. Only some share targets use this value.
 * @returns {Promise.<boolean>}
 */
export async function Share(url?: string, text?: string, title?: string): Promise<boolean> {
    // BEGIN USER CODE

    if (!text && !url) {
        return Promise.reject(
            new TypeError("It is required to provide at least one of input parameters 'Text' and 'Url'")
        );
    }

    // Native platform
    // Documentation https://facebook.github.io/react-native/docs/share
    if (navigator && navigator.product === "ReactNative") {
        const RNShare: typeof ReactNative.Share = require("react-native").Share;

        const content =
            url && text ? { message: text + "\n" + url, title } : url ? { url, title } : { message: text!, title };

        return RNShare.share(content).then(result => {
            if (result.action === RNShare.dismissedAction) {
                return false;
            }
            return true;
        });
    }

    // Web platform
    // Documentation https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
    if (navigator && navigator.share) {
        return navigator.share({ url, text, title }).then(() => true);
    }

    // Hybrid platform
    // Documentation https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
    if (window && window.plugins && window.plugins.socialsharing) {
        return new Promise((resolve, reject) => {
            window!.plugins!.socialsharing!.shareWithOptions(
                {
                    message: text,
                    subject: title,
                    url
                },
                result => resolve(result.completed),
                error => reject(new Error(error))
            );
        });
    }

    if (document && document.location && document.location.protocol === "http:") {
        return Promise.reject(new Error("This action requires a secure https: connection"));
    }

    return Promise.reject(new Error("This action is not supported by this browser"));

    // END USER CODE
}
