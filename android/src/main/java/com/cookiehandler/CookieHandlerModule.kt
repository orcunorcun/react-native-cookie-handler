package com.cookiehandler

import android.webkit.CookieManager
import com.facebook.react.bridge.*
import java.net.HttpCookie

class CookieHandlerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "CookieHandler"
  }

  @ReactMethod
  fun get(url: String, useWebkit: Boolean, promise: Promise) {
    val cookieHandler = CookieManager.getInstance()
    val cookies = cookieHandler.getCookie(url)
    val cookieMap = mutableMapOf<String, String>()

    cookies?.split(";")?.forEach {
      try {
        val cookie = HttpCookie.parse(it.trim())[0]
        cookieMap[cookie.name] = cookie.value
      } catch (e: IllegalArgumentException) {
        e.printStackTrace()
      }
    }

    promise.resolve(Arguments.makeNativeMap(cookieMap as Map<String, Any>))
  }

  @ReactMethod
  fun clearAll(useWebkit: Boolean, promise: Promise) {
    val cookieHandler = CookieManager.getInstance()
    cookieHandler.removeAllCookies { promise.resolve(it) }
    cookieHandler.flush()
  }

  @ReactMethod
  fun clearCookiesForURL(url: String, useWebkit: Boolean, promise: Promise) {
    val cookieHandler = CookieManager.getInstance()
    val cookies = cookieHandler.getCookie(url)
    val domain = java.net.URI(url).host

    cookies?.split(";")?.forEach {
      try {
        val cookie = HttpCookie.parse(it.trim())[0]
        val cookieString =
            "${cookie.name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=$domain; Path=${cookie.path}"
        cookieHandler.setCookie(url, cookieString)
      } catch (e: IllegalArgumentException) {
        e.printStackTrace()
      }
    }

    cookieHandler.flush()
    promise.resolve(null)
  }

  @ReactMethod
  fun clearSelectedCookiesForURL(
      url: String,
      cookieNames: ReadableArray,
      useWebkit: Boolean,
      promise: Promise
  ) {
    val cookieHandler = CookieManager.getInstance()
    val cookies = cookieHandler.getCookie(url)
    val cookieNamesList = cookieNames.toArrayList()
    val domain = java.net.URI(url).host

    cookies?.split(";")?.forEach {
      try {
        val cookie = HttpCookie.parse(it.trim())[0]
        if (cookieNamesList.contains(cookie.name)) {
          val cookieString =
              "${cookie.name}=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Domain=$domain; Path=${cookie.path}"
          cookieHandler.setCookie(url, cookieString)
        }
      } catch (e: IllegalArgumentException) {
        e.printStackTrace()
      }
    }

    cookieHandler.flush()
    promise.resolve(null)
  }

  @ReactMethod
  fun set(url: String, cookie: ReadableMap, useWebkit: Boolean, promise: Promise) {
    val cookieHandler = CookieManager.getInstance()
    val cookieString = buildCookieString(cookie)
    cookieHandler.setCookie(url, cookieString)
    cookieHandler.flush()

    val cookies = cookieHandler.getCookie(url)
    val cookieMap = mutableMapOf<String, String>()
    cookies?.split(";")?.forEach {
      try {
        val setCookie = HttpCookie.parse(it.trim())[0]
        cookieMap[setCookie.name] = setCookie.value
      } catch (e: IllegalArgumentException) {
        e.printStackTrace()
      }
    }

    if (cookieMap.containsKey(cookie.getString("name"))) {
      promise.resolve(true)
    } else {
      promise.reject("CookieSetError", "Failed to set cookie")
    }
  }

  private fun buildCookieString(cookie: ReadableMap): String {
    val name = cookie.getString("name")
    val value = cookie.getString("value")
    val domain = cookie.getString("domain")
    val path = cookie.getString("path")
    val expires = cookie.getString("expires")

    val cookieString = StringBuilder("$name=$value;")

    if (domain != null) cookieString.append(" Domain=$domain;")
    if (path != null) cookieString.append(" Path=$path;")
    if (expires != null) cookieString.append(" Expires=$expires;")

    return cookieString.toString()
  }
}
