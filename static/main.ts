import { authentication } from "./src/auth/authentication";


authentication()
  .then(() => {
    console.log("mainModule loaded");
  })
  .catch((error) => {
    console.error(error);
  });
