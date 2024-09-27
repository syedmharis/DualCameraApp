#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(DualCameraModule, NSObject)

RCT_EXTERN_METHOD(startSession)
RCT_EXTERN_METHOD(stopSession)
RCT_EXTERN_METHOD(addPreviewLayers:(nonnull NSNumber *)frontViewTag
                  backViewTag:(nonnull NSNumber *)backViewTag)
RCT_EXTERN_METHOD(initializeWithBridge:(RCTBridge *)bridge)

@end