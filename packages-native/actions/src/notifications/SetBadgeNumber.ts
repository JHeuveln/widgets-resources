// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import { NativeModules } from "react-native";
import ReactNativeFirebase from "react-native-firebase";

/**
 * @param {Big} badgeNumber - This field is required. Should be greater than or equal to 0.
 * @returns {Promise.<void>}
 */
export async function SetBadgeNumber(badgeNumber?: BigJs.Big): Promise<void> {
    // BEGIN USER CODE
    // Documentation https://rnfirebase.io/docs/v5.x.x/notifications/reference/Notifications#setBadge

    if (NativeModules && !NativeModules.RNFirebase) {
        return Promise.reject(new Error("Firebase library is not currently imported in your app"));
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const firebase: typeof ReactNativeFirebase = require("react-native-firebase");

    if (!badgeNumber) {
        return Promise.reject(new TypeError("Input parameter 'Badge number' is required"));
    }

    if (badgeNumber.lt(0)) {
        return Promise.reject(new TypeError("Input parameter 'Badge number' should be zero or greater"));
    }

    return firebase.notifications().setBadge(Number(badgeNumber));

    // END USER CODE
}
