import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "",
    authority: "https://login.microsoftonline.com/",
    redirectUri: "/",
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },        
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;  
          default:
            return;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["user.read"],
};

