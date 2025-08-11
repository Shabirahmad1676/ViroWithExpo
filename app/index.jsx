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



import React from 'react';

import { View } from 'react-native';
import Map from '../components/Map';
import CustomMark from '../components/CustomMark';



const index = ()=> {
 
  return (
    <View style={{ flex: 1 }}>
     {/* <Map/> */}
     <CustomMark/>
    </View>
  );
}


export default index