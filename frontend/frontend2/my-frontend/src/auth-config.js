import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "54fb8f39-bf89-4af6-b034-3bddf528eff6",
    authority: "https://login.microsoftonline.com/21e03b40-5208-4766-8b2a-07f54f2c8367",
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

