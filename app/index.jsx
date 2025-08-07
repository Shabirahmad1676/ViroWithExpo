// import React from 'react';
// import {
//   ViroARSceneNavigator, Viro3DObject, ViroAmbientLight, ViroARScene
// } from '@reactvision/react-viro';
// import HelloAR from '../components/HelloAR';
// import Object3d from '../components/Object3d';
// import BodyExplorerScene from '../components/BodyExplorerScene';
// import ARPlaneBox from '../components/ARPlaneBox';
// import MarkerScene from '../components/MarkerScene';

// const index = () => {
//   return (
//     <ViroARSceneNavigator
//       // initialScene={{ scene: HelloAR }}
//       // initialScene={{ scene: Object3d }}
//       // initialScene={{ scene: BodyExplorerScene }}
//       initialScene={{ scene: MarkerScene }}
//       autofocus={true}
//       // initialScene={{ scene: ARPlaneBox }}
//       worldAlignment="Gravity"
//     />
//   );
// };

// export default index;





// import React, { useEffect, useState } from "react";
// import { supabase } from "../utils/supabase";
// import Intrest from './Intrest'
// import AuthScreen from "./AuthScreen";

// export default function App() {
//   const [session, setSession] = useState(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   return session ? (
//     <Intrest />
//   ) : (
//     <AuthScreen onAuthSuccess={() => {}} />
//   );
// }



import React, { useEffect } from 'react';
import MapboxGL from '@rnmapbox/maps';
import { View } from 'react-native';

MapboxGL.setAccessToken(process.env.map_api);

const index = ()=> {
  useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView style={{ flex: 1 }}>
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={[74.3587, 31.5204]} 
        />
      </MapboxGL.MapView>
    </View>
  );
}


export default index