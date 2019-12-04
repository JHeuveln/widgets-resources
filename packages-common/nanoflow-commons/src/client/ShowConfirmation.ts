// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the code between BEGIN USER CODE and END USER CODE
// Other code you write will be lost the next time you deploy the project.

import ReactNative from "react-native";

/**
 * Shows a confirmation dialog during the execution of a nanoflow, to make perform actions based on the user input.
 * @param {string} question - This field is required.
 * @param {string} cancelButtonCaption - Set to empty to use default text 'Cancel'.
 * @param {string} proceedButtonCaption - Set to empty to use default text 'OK'.
 * @returns {Promise.<boolean>}
 */
export async function ShowConfirmation(
    question?: string,
    cancelButtonCaption?: string,
    proceedButtonCaption?: string
): Promise<boolean> {
    // BEGIN USER CODE

    if (!question) {
        return Promise.reject(new TypeError("Input parameter 'Question' is required"));
    }

    const cancel = cancelButtonCaption || "Cancel";
    const proceed = proceedButtonCaption || "OK";

    // Native platform
    if (navigator && navigator.product === "ReactNative") {
        const Alert: typeof ReactNative.Alert = require("react-native").Alert;

        return new Promise(resolve => {
            Alert.alert("Confirmation", question, [
                { text: cancel, onPress: () => resolve(false), style: "cancel" },
                { text: proceed, onPress: () => resolve(true) }
            ]);
        });
    }

    // Other platforms
    return new Promise(resolve => {
        mx.ui.confirmation({
            content: question,
            proceed,
            cancel,
            handler: () => resolve(true),
            onCancel: () => resolve(false)
        } as any);
    });

    // END USER CODE
}
