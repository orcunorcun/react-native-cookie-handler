import { NativeModules, Platform } from 'react-native';

interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  version?: string;
  expires?: string;
}

const LINKING_ERROR =
  `The package 'react-native-cookie-handler' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const CookieHandler = NativeModules.CookieHandler
  ? NativeModules.CookieHandler
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function get(url: string, useWebkit?: boolean): Promise<{ [key: string]: string }> {
  return CookieHandler.get(url, useWebkit);
}

export function set(url: string, cookie: Cookie, useWebKit?: boolean): Promise<boolean> {
  return CookieHandler.set(url, cookie, useWebKit);
}

export function clearAll(useWebKit?: boolean): Promise<void> {
  return CookieHandler.clearAll(useWebKit);
}

export function clearCookiesForURL(url: string, useWebkit?: boolean): Promise<void> {
  return CookieHandler.clearCookiesForURL(url, useWebkit);
}

export function clearSelectedCookiesForURL(url: string, cookieNames: string[], useWebkit?: boolean): Promise<void> {
  return CookieHandler.clearSelectedCookiesForURL(url, cookieNames, useWebkit);
}

export default {
  get,
  set,
  clearAll,
  clearCookiesForURL,
  clearSelectedCookiesForURL,
};
