import React, {useRef, useEffect} from 'react';
import {View, findNodeHandle, StyleSheet} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';

// Initialize the DualCameraModule with the bridge
NativeModules.DualCameraModule.initializeWithBridge(NativeModules.BatchedBridge);

const {DualCameraModule} = NativeModules;

const App = () => {
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        // Start the session
        await DualCameraModule.startSession();
        console.log('Camera session started');

        // Get the view tags (native view references)
        const frontViewTag = findNodeHandle(frontRef.current);
        const backViewTag = findNodeHandle(backRef.current);

        if (frontViewTag && backViewTag) {
          // Add the preview layers
          await DualCameraModule.addPreviewLayers(frontViewTag, backViewTag);
          console.log('Preview layers added');
        } else {
          console.error('Failed to get view tags');
        }
      } catch (error) {
        console.error('Error setting up camera:', error);
      }
    };

    setupCamera();

    return () => {
      // Stop the session when the component is unmounted
      DualCameraModule.stopSession();
      console.log('Camera session stopped');
    };
  }, []);

  return (
    <View style={styles.container}>
      <View ref={frontRef} style={styles.cameraView} />
      <View ref={backRef} style={styles.cameraView} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  cameraView: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default App;
