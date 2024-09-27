import AVFoundation
import UIKit
import React

@objc(DualCameraModule)
class DualCameraModule: NSObject {
    private var multiCamSession: AVCaptureMultiCamSession?
    private var frontPreviewLayer: AVCaptureVideoPreviewLayer?
    private var backPreviewLayer: AVCaptureVideoPreviewLayer?
    @objc var bridge: RCTBridge!

    @objc static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override init() {
        super.init()
        setupMultiCamSession()
    }

    @objc(initializeWithBridge:)
    func initializeWithBridge(_ bridge: RCTBridge) {
        self.bridge = bridge
    }
    
    private func setupMultiCamSession() {
        if !AVCaptureMultiCamSession.isMultiCamSupported {
            print("MultiCam is not supported on this device")
            return
        }
        
        multiCamSession = AVCaptureMultiCamSession()
        guard let multiCamSession = multiCamSession else {
            print("Unable to initialize multi-cam session")
            return
        }

        // Front camera setup
        do {
            guard let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
                print("Front camera not available")
                return
            }
            let frontInput = try AVCaptureDeviceInput(device: frontCamera)
            if multiCamSession.canAddInput(frontInput) {
                multiCamSession.addInput(frontInput)
                print("Front camera input added successfully")
            } else {
                print("Cannot add front camera input to session")
            }
        } catch {
            print("Error creating front camera input: \(error)")
        }

        // Back camera setup
        do {
            guard let backCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .back) else {
                print("Back camera not available")
                return
            }
            let backInput = try AVCaptureDeviceInput(device: backCamera)
            if multiCamSession.canAddInput(backInput) {
                multiCamSession.addInput(backInput)
                print("Back camera input added successfully")
            } else {
                print("Cannot add back camera input to session")
            }
        } catch {
            print("Error creating back camera input: \(error)")
        }

        // Setup preview layers
        frontPreviewLayer = AVCaptureVideoPreviewLayer(session: multiCamSession)
        frontPreviewLayer?.videoGravity = .resizeAspectFill
        print("Front preview layer created")

        backPreviewLayer = AVCaptureVideoPreviewLayer(session: multiCamSession)
        backPreviewLayer?.videoGravity = .resizeAspectFill
        print("Back preview layer created")
    }

    @objc func startSession() {
        DispatchQueue.main.async {
            self.multiCamSession?.startRunning()
            print("Multi-cam session started")
        }
    }

    @objc func stopSession() {
        DispatchQueue.main.async {
            self.multiCamSession?.stopRunning()
            print("Multi-cam session stopped")
        }
    }

    @objc func addPreviewLayers(_ frontViewTag: NSNumber, backViewTag: NSNumber) {
        DispatchQueue.main.async {
            guard let frontPreviewLayer = self.frontPreviewLayer,
                  let backPreviewLayer = self.backPreviewLayer else {
                print("Error: Preview layers not available")
                return
            }

            let frontView = self.bridge.uiManager.view(forReactTag: frontViewTag)
            let backView = self.bridge.uiManager.view(forReactTag: backViewTag)

            if let frontView = frontView, !frontView.bounds.isEmpty {
                frontPreviewLayer.frame = frontView.bounds
                frontView.layer.addSublayer(frontPreviewLayer)
                print("Front preview layer added to view with tag: \(frontViewTag)")
            } else {
                print("Error: Front view not found or bounds not set for tag: \(frontViewTag)")
            }

            if let backView = backView, !backView.bounds.isEmpty {
                backPreviewLayer.frame = backView.bounds
                backView.layer.addSublayer(backPreviewLayer)
                print("Back preview layer added to view with tag: \(backViewTag)")
            } else {
                print("Error: Back view not found or bounds not set for tag: \(backViewTag)")
            }
        }
    }
}