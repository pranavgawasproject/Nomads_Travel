import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Text, Plane } from "@react-three/drei";

import WorldMap from "../assets/greenLandscapeWhiteBackground.png";
// import WorldMap from "../assets/greenLandscapeWhiteBackground.webp";

const RotatingGlobe = () => {
  const globeRef = useRef();
  const texture = useTexture(WorldMap);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  // Function to convert latitude and longitude to spherical coordinates
  const latLonToPosition = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    return [
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta),
    ];
  };

  const indiaPosition = latLonToPosition(1.5937, 110.9629, 5);

  // Rotation to keep the text upright
  const getLabelRotation = (lat, lon) => {
    return [0, -500, 0];
  };

  const getLabelRotationGermany = (lat, lon) => {
    return [0, -61, 0];
  };

  const getLabelRotationmalaysia = (lat, lon) => {
    return [0, 60, 0];
  };

  const getLabelRotationsrilanka = (lat, lon) => {
    return [0, -500, 0];
  };

  const getLabelRotationGoa = (lat, lon) => {
    return [0, -500, 0];
  };

  const getLabelRotationnepal = (lat, lon) => {
    return [0, -500, 0];
  };

  const getLabelRotationcostaRica = (lat, lon) => {
    return [0, -503, 0];
  };

  const getLabelRotationvietnam = (lat, lon) => {
    return [0, -500, 0];
  };

  const getLabelRotationdubai = (lat, lon) => {
    return [0, -500, -0];
  };

  const getLabelRotationPortugal = (lat, lon) => {
    return [0, -501, 0];
  };

  const getLabelRotationhungary = (lat, lon) => {
    return [0, -501, 0];
  };
  const getLabelRotationparis = (lat, lon) => {
    return [0, -501, 0];
  };
  const getLabelRotationgreece = (lat, lon) => {
    return [0, -501, 0];
  };
  const getLabelRotationafrica = (lat, lon) => {
    return [0, -501, 0];
  };
  const getLabelRotationnorway = (lat, lon) => {
    return [50, -501, -50];
  };
  const getLabelRotationestonia = (lat, lon) => {
    return [0, -501, 0];
  };
  const getLabelRotationbali = (lat, lon) => {
    return [0, -500, 0];
  };

  const getLabelRotationbankok = (lat, lon) => {
    return [0, -500, 0];
  };

  const getLabelRotationphilipines = (lat,lon) =>{
    return [0, -506, 0];
  }

  const getLabelRotationsingapore = (lat,lon) =>{
    return [0, -500, 0];
  }

  const indiaLabelRotation = getLabelRotation(1.5937, 110.9629);

  //position for Sri Lanka
  const srilankaPosition = latLonToPosition(-15.9271, 110.8612, 5);
  const srilankaLabelPosition = getLabelRotationsrilanka(-15.9271, 110.8612);

  //position for Goa
  const goaPosition = latLonToPosition(-4.2993, 115.124, 5);
  const goaLabelPosition = getLabelRotationGoa(-4.2993, 115.124);

  //position for Nepal
  const nepalPosition = latLonToPosition(6.7172, 110.324, 5);
  const nepalLabelPosition = getLabelRotationnepal(20.7172, 110.324);

  //position for costa Rica
  const costaRicaPosition = latLonToPosition(-8.7489, 272.7534, 5);
  const costaRicaLabelPosition = getLabelRotationcostaRica(-8.7489, 272.7534);

  //position for Vietnam
  const vietnamPosition = latLonToPosition(-6.0285, 85.8542, 5);
  const vietnamLabelPosition = getLabelRotationvietnam(-6.0285, 85.8542);

  //position for Dubai
  const dubaiPosition = latLonToPosition(5.276987, 140.296249, 5);
  const dubaiLabelPosition = getLabelRotationdubai(5.276987, 160.296249);

  //position of Portugal
  const portugalPosition = latLonToPosition(20.7223, 200.1393, 5);
  const portugalLabelPosition = getLabelRotationPortugal(20.7223, 200.1393);

  //position of hungary
  const hungaryPosition = latLonToPosition(30.4979, 170.0402, 5);
  const hungaryLabelPosition = getLabelRotationhungary(30.4979, 170.0402);

  //position of paris
  const parisPosition = latLonToPosition(30.8566, 190.3522, 5);
  const parisLabelPosition = getLabelRotationparis(30.8566, 190.3522);

  //position of Greece
  const greecePosition = latLonToPosition(20.4979, 170.0402, 5);
  const greeceLabelPosition = getLabelRotationgreece(20.4979, 170.0402);

  //position of South Africa
  const africaPosition = latLonToPosition(-60.9249, 170.4241, 5);
  const africaLabelPosition = getLabelRotationafrica(-60.9249, 170.4241);

  //position of Norway
  const norwayPosition = latLonToPosition(59.9139, 170.7522, 5);
  const norwayLabelPosition = getLabelRotationnorway(59.9139, 170.7522);

  //position of Estonia
  const estoniaPosition = latLonToPosition(45.437, 160.7536, 5);
  const estoniaLabelPosition = getLabelRotationestonia(45.437, 160.7536);

  //position of Bali
  const baliPosition = latLonToPosition(-15.9271, 90.8612, 5);
  const baliLabelPosition = getLabelRotationbali(-15.9271, 90.8612);

  //position of bankok
  const bankokPosition = latLonToPosition(-3.7563, 95.5018, 5);
  const bankokLabelPosition = getLabelRotationbankok(-3.7563, 95.5018);

  //position of Philipines
  const philipinesPosition = latLonToPosition(-10.9271, 70.8612, 5);
  const philipinesLabelPosition = getLabelRotationphilipines(-10.9271, 70.8612);

  //position of Singapore
  const singaporePosition = latLonToPosition(-21.9271, 88.8612, 5);
  const singaporeLabelPosition = getLabelRotationsingapore(-21.9271, 88.8612);


  return (
    <>
      <mesh ref={globeRef} rotation={[100.6, 91, 0]}>
        <sphereGeometry args={[5, 50, 50]} />
        <meshBasicMaterial map={texture} />

        {/*Marker position for Sri Lanka */}

        <mesh position={srilankaPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={srilankaPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.2 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={srilankaLabelPosition}
          fontWeight="bold">
          SRI LANKA
        </Text>
        {/* Vietnam */}
        <mesh position={costaRicaPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={costaRicaPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.4 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={costaRicaLabelPosition}
          fontWeight="bold">
          COSTA RICA
        </Text>

        <mesh position={dubaiPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={dubaiPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.2 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={dubaiLabelPosition}
          fontWeight="bold">
          DUBAI
        </Text>

        <mesh position={goaPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={goaPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.3 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={goaLabelPosition}
          fontWeight="bold">
          GOA
        </Text>

        {/* Nepal */}
        <mesh position={nepalPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
        {/* <Plane
    position={[...nepalPosition.map((coord) => coord * 1.1), -0.01]} // Slightly behind the text
    rotation={nepalLabelPosition}
    args={[1.5, 0.8]}
     // Adjust dimensions to match the text size
>
    <meshBasicMaterial color="white"/>
</Plane> */}
        <Text
          position={nepalPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.3 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="10px"
          rotation={nepalLabelPosition}
          fontWeight="bold">
          NEPAL
        </Text>
        <mesh position={portugalPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={portugalPosition.map((coord, index) =>
            index === 1 ? coord * 1.1 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={portugalLabelPosition}
          fontWeight="bold">
          PORTUGAL
        </Text>
        <mesh position={hungaryPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={hungaryPosition.map((coord, index) =>
            index === 1 ? coord * 1.1 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={hungaryLabelPosition}
          fontWeight="bold">
          HUNGARY
        </Text>
        <mesh position={parisPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={parisPosition.map((coord, index) =>
            index === 1 ? coord * 1.1 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={parisLabelPosition}
          fontWeight="bold">
          PARIS
        </Text>
        <mesh position={greecePosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={greecePosition.map((coord, index) =>
            index === 1 ? coord * 1.1 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={greeceLabelPosition}
          fontWeight="bold">
          GREECE
        </Text>
        <mesh position={africaPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={africaPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.2 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={africaLabelPosition}
          fontWeight="bold">
          SOUTH AFRICA
        </Text>
        <mesh position={norwayPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={norwayPosition.map((coord, index) =>
            index === 1 ? coord * 1.1 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={norwayLabelPosition}
          fontWeight="bold">
          NORWAY
        </Text>
        <mesh position={estoniaPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={estoniaPosition.map((coord, index) =>
            index === 1 ? coord * 1.1 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={estoniaLabelPosition}
          fontWeight="bold">
          ESTONIA
        </Text>
        <mesh position={baliPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={baliPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.3 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={baliLabelPosition}
          fontWeight="bold">
          BALI
        </Text>
        <mesh position={vietnamPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={vietnamPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.3 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={vietnamLabelPosition}
          fontWeight="bold">
          VIETNAM
        </Text>
        <mesh position={bankokPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        <Text
          position={bankokPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.3 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={bankokLabelPosition}
          fontWeight="bold">
          BANGKOK
        </Text>
        <mesh position={philipinesPosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <Text
          position={philipinesPosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.3 : coord * 1.2
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={philipinesLabelPosition}
          fontWeight="bold">
          PHILLIPINES
        </Text>
        <mesh position={singaporePosition}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <Text
          position={singaporePosition.map((coord, index) =>
            index === 1 ? coord * 1.2 + 0.3 : coord * 1.3
          )}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={singaporeLabelPosition}
          fontWeight="bold">
          SINGAPORE
        </Text>


      </mesh>
    </>
  );
};

export default RotatingGlobe;
