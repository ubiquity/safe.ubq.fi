import { Wallet } from "ethers";

export async function renderSafeUI(signer: Wallet) {
    const container = document.createElement("div")
    const { address, privateKey: signerPk, signingKey } = signer
    const signerInfo = `
        <div style="display: flex; flex-direction: column; margin-left: 6px">
            <div>
                <h2>Signer Info</h2>
                <p>Public Key: ${address}</p>
                <p>Private Key: ${signerPk.slice(0, 4)}...${signerPk.slice(-4)}</p>
            </div>
            `;
    container.innerHTML = signerInfo;
    const infoContainer = document.getElementById("info-container")
    if (!infoContainer) {
        throw new Error("no info container")
    }
    infoContainer.style.display = "flex"
    infoContainer.appendChild(container)

}

export async function isWebAuthnSupported() {
    if (!window.navigator.credentials || !window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported");
    }
}