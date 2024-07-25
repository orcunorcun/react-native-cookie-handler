import Foundation
import WebKit

let NOT_AVAILABLE_ERROR_MESSAGE = "WKWebViewのCookie制御はiOS11+でしか動作しません。"
let INVALID_URLSTRING_ERROR_MESSAGE = "URLの値が不正です。"
let INVALID_COOKIE_PROPERTIES_ERROR_MESSAGE = "Cookieのプロパティが不正です。"

@objc(CookieHandler)
class CookieHandler: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }

  private func createCookieDictionary (_ cookies: [HTTPCookie]) -> [String: String] {
    return cookies.reduce(into: [String: String]()) { (dict, cookie) in
      dict[cookie.name] = cookie.value
    }
  }

  @objc func get(_ url: URL, useWebkit: Bool, resolver resolve: @escaping RCTPromiseResolveBlock,
                 rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {

    guard let host = url.host else {
      reject("", INVALID_URLSTRING_ERROR_MESSAGE, nil)
      return
    }

    if useWebkit {
      if #available(iOS 11.0, *) {
        DispatchQueue.main.async {
          WKWebsiteDataStore.default().httpCookieStore.getAllCookies { cookies in
            let currentCookies = cookies.filter { $0.domain.contains(host) }
            resolve(self.createCookieDictionary(currentCookies))
          }
        }
      } else {
        reject("", NOT_AVAILABLE_ERROR_MESSAGE, nil)
      }
    } else {
      if let cookies = HTTPCookieStorage.shared.cookies {
        resolve(self.createCookieDictionary(cookies))
      } else {
        resolve([String: String]())
      }
    }
  }

  @objc func clearAll(_ useWebkit: Bool, resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    if useWebkit {
      DispatchQueue.main.async {
        URLSession.shared.reset {}
        UserDefaults.standard.synchronize()
        let dataStore = WKWebsiteDataStore.default()
        dataStore.fetchDataRecords(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes()) { records in
          dataStore.removeData(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(), for: records) {
            resolve(true)
          }
        }
      }
    } else {
      if let cookies = HTTPCookieStorage.shared.cookies {
        for cookie in cookies {
          HTTPCookieStorage.shared.deleteCookie(cookie)
        }
      }
      resolve(nil)
    }
  }

  @objc func clearCookiesForURL(_ url: URL, useWebkit: Bool, resolver resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    guard let host = url.host else {
      reject("", INVALID_URLSTRING_ERROR_MESSAGE, nil)
      return
    }

    if useWebkit {
      if #available(iOS 11.0, *) {
        DispatchQueue.main.async {
          WKWebsiteDataStore.default().httpCookieStore.getAllCookies { cookies in
            let cookiesToDelete = cookies.filter { $0.domain.contains(host) }
            let dataStore = WKWebsiteDataStore.default().httpCookieStore
            for cookie in cookiesToDelete {
              dataStore.delete(cookie)
            }
            resolve(true)
          }
        }
      } else {
        reject("", NOT_AVAILABLE_ERROR_MESSAGE, nil)
      }
    } else {
      if let cookies = HTTPCookieStorage.shared.cookies {
        for cookie in cookies {
          if cookie.domain.contains(host) {
            HTTPCookieStorage.shared.deleteCookie(cookie)
          }
        }
      }
      resolve(nil)
    }
  }

  @objc func clearSelectedCookiesForURL(_ url: URL, cookieNames: [String], useWebkit: Bool, resolver resolve: @escaping RCTPromiseResolveBlock,
                                        rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    guard let host = url.host else {
      reject("", INVALID_URLSTRING_ERROR_MESSAGE, nil)
      return
    }

    if useWebkit {
      if #available(iOS 11.0, *) {
        DispatchQueue.main.async {
          WKWebsiteDataStore.default().httpCookieStore.getAllCookies { cookies in
            let cookiesToDelete = cookies.filter { $0.domain.contains(host) && cookieNames.contains($0.name) }
            let dataStore = WKWebsiteDataStore.default().httpCookieStore
            for cookie in cookiesToDelete {
              dataStore.delete(cookie)
            }
            resolve(true)
          }
        }
      } else {
        reject("", NOT_AVAILABLE_ERROR_MESSAGE, nil)
      }
    } else {
      if let cookies = HTTPCookieStorage.shared.cookies {
        for cookie in cookies {
          if cookie.domain.contains(host) && cookieNames.contains(cookie.name) {
            HTTPCookieStorage.shared.deleteCookie(cookie)
          }
        }
      }
      resolve(nil)
    }
  }

  @objc func set(_ url: URL, cookie: [String: Any], useWebKit: Bool, resolver resolve: @escaping RCTPromiseResolveBlock,
                 rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {

    guard let cookieName = cookie["name"] as? String,
          let cookieValue = cookie["value"] as? String,
          let cookieDomain = cookie["domain"] as? String,
          let cookiePath = cookie["path"] as? String else {
      reject("", INVALID_COOKIE_PROPERTIES_ERROR_MESSAGE, nil)
      return
    }

    var cookieProperties: [HTTPCookiePropertyKey: Any] = [
      .name: cookieName,
      .value: cookieValue,
      .domain: cookieDomain,
      .path: cookiePath
    ]

    if let expiresDate = cookie["expires"] as? Date {
      cookieProperties[.expires] = expiresDate
    }

    if useWebKit {
      if #available(iOS 11.0, *) {
        DispatchQueue.main.async {
          guard let cookie = HTTPCookie(properties: cookieProperties) else {
            reject("", INVALID_COOKIE_PROPERTIES_ERROR_MESSAGE, nil)
            return
          }

          WKWebsiteDataStore.default().httpCookieStore.setCookie(cookie) {
            resolve(true)
          }
        }
      } else {
        reject("", NOT_AVAILABLE_ERROR_MESSAGE, nil)
      }
    } else {
      if let cookie = HTTPCookie(properties: cookieProperties) {
        HTTPCookieStorage.shared.setCookie(cookie)
        resolve(true)
      } else {
        reject("", INVALID_COOKIE_PROPERTIES_ERROR_MESSAGE, nil)
      }
    }
  }
}
