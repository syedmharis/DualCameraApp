import React, {useRef, useEffect, useState} from 'react';
import {View, Button, findNodeHandle, StyleSheet} from 'react-native';
import {NativeModules} from 'react-native';

const {DualCameraModule} = NativeModules;

const App = () => {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [frontViewTag, setFrontViewTag] = useState(null);
  const [backViewTag, setBackViewTag] = useState(null);
  const [isCameraRunning, setIsCameraRunning] = useState(true); // Initially set to true

  useEffect(() => {
    if (isCameraRunning) {
      const setupCamera = async () => {
        try {
          // Start the session
          await DualCameraModule.startSession();
          console.log('Camera session started');

          // Add the preview layers if view tags are available
          if (frontViewTag && backViewTag) {
            await DualCameraModule.addPreviewLayers(frontViewTag, backViewTag);
            console.log('Preview layers added');
          }
        } catch (error) {
          console.error('Error setting up camera:', error);
        }
      };

      setupCamera();
    }

    return () => {
      if (isCameraRunning) {
        // Stop the session when the component is unmounted or camera is stopped
        DualCameraModule.stopSession();
        console.log('Camera session stopped');
      }
    };
  }, [isCameraRunning, frontViewTag, backViewTag]); // Watch for view tag changes and camera running state

  // Use onLayout to ensure views have proper dimensions
  const onFrontLayout = () => {
    if (frontRef.current) {
      setFrontViewTag(findNodeHandle(frontRef.current));
    }
  };

  const onBackLayout = () => {
    if (backRef.current) {
      setBackViewTag(findNodeHandle(backRef.current));
    }
  };

  const handleStartCamera = () => {
    setIsCameraRunning(true);
  };

  const handleStopCamera = () => {
    setIsCameraRunning(false);
    DualCameraModule.stopSession();
    console.log('Camera session manually stopped');
  };

  return (
    <View style={styles.container}>
      {/* Full-screen back camera view */}
      <View ref={backRef} style={styles.fullscreenCameraView} onLayout={onBackLayout} />
      
      {/* Small front camera view on top left */}
      <View ref={frontRef} style={styles.smallCameraView} onLayout={onFrontLayout} />

      {/* Camera control buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Start Camera" onPress={handleStartCamera} disabled={isCameraRunning} />
        <Button title="Stop Camera" onPress={handleStopCamera} disabled={!isCameraRunning} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  fullscreenCameraView: {
    ...StyleSheet.absoluteFillObject, // Covers the entire screen
    backgroundColor: 'black',
  },
  smallCameraView: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 120,
    height: 180,
    backgroundColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default App;
