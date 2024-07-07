import { authentication } from "./src/auth/authentication";
import { renderSafeUI } from "./src/webauthn/rendering";
import { webAuthn } from "./src/webauthn/webauthn";

authentication()
  .then((ghUser) => {
    if (!ghUser) return;
    webAuthn(ghUser, false).then((result) => {
      renderSafeUI(result)
    });
  })
  .catch((error) => {
    console.error(error);
  });