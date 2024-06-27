import { authentication } from "./src/auth/authentication";
import { renderSafeUI } from "./src/webauthn/rendering";
import { webAuthn } from "./src/webauthn/webauthn";

authentication()
  .then((ghUser) => {
    if (!ghUser) return;
    webAuthn(new AbortController(), ghUser).then((result) => {
      renderSafeUI(result.signer, result.account)
    });
  })
  .catch((error) => {
    console.error(error);
  });