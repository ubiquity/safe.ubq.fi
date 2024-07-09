"use client";
import { ButtonController, getButtonController } from "../app/claim/components/button-controller";

export const toaster = {
    create: createToast,
    error: errorToast,
    icons: {
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        warning: "fa-triangle-exclamation",
        info: "fa-circle-info",
    },
};


function createToast(meaning: keyof typeof toaster.icons, text: string, timeout: number = 5000) {
    const notifications = document.querySelector(".notifications") as HTMLUListElement;

    try {
        if (meaning != "info") getButtonController().hideLoader();
    } catch (err) {
        console.log(err);
    }

    const toastDetails = {
        timer: timeout,
    } as {
        timer: number;
        timeoutId?: NodeJS.Timeout;
    };
    // Getting the icon and text for the toast based on the id passed
    const _icon = toaster.icons[meaning];
    const toastContent = document.createElement("li"); // Creating a new 'li' element for the toast
    toastContent.className = `toast .${_icon} ${meaning}`; // Setting the classes for the toast

    // Setting the inner HTML for the toast
    toastContent.innerHTML = `<div class="column"><i class="fa-solid ${_icon}"></i><span>${text}</span></div>`;

    // attaching a click event listener to the toast to remove it when the close icon is clicked
    const i = document.createElement("i");
    i.className = "fa-solid fa-xmark";
    i.onclick = () => removeToast(toastContent, toastDetails.timeoutId);
    toastContent.appendChild(i);

    notifications.appendChild(toastContent); // Append the toast to the notification ul

    if (timeout !== Infinity) {
        // Setting a timeout to remove the toast after the specified duration
        toastDetails.timeoutId = setTimeout(() => removeToast(toastContent, toastDetails.timeoutId), toastDetails.timer);
    }
}

function removeToast(toast: HTMLElement, timeoutId?: NodeJS.Timeout) {
    toast.classList.add("hide");
    if (timeoutId) {
        clearTimeout(timeoutId); // Clearing the timeout for the toast
    }
    setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
}

export function errorToast(error: MetaMaskError, errorMessage?: string) {
    // If a custom error message is provided, use it
    if (errorMessage) {
        toaster.create("error", errorMessage);
        return;
    }

    toaster.create("error", error.reason);
}

export type MetaMaskError = {
    reason: string;
    code: string;
    action: string;
    transaction: {
        data: string;
        to: string;
        from: string;
        gasLimit: {
            type: string;
            hex: string;
        };
    };
};