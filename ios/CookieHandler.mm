#import <Foundation/Foundation.h>
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface RCT_EXTERN_MODULE(CookieHandler, NSObject)

RCT_EXTERN_METHOD(get:(NSURL *)url useWebkit:(BOOL)useWebkit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearAll:(BOOL)useWebkit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(set:(NSURL *)url cookie:(NSDictionary *)cookie useWebKit:(BOOL)useWebKit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearCookiesForURL:(NSURL *)url useWebkit:(BOOL)useWebkit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(clearSelectedCookiesForURL:(NSURL *)url cookieNames:(NSArray *)cookieNames useWebkit:(BOOL)useWebkit resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
