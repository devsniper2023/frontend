import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';
import styled from 'styled-components';
import { Leva } from 'leva';
import Glow from './components/Glow';
import CanadaFlag from './components/CanadaFlag';
import Sphere from './components/Sphere';
import Dots from './components/Dots';
import Marker from './components/Marker';
import Arc from './components/Arc';
import useInterval from '@/hooks/useInterval';

const CANVAS_HEIGHT = 500 / 2;
const CANVAS_WIDTH = CANVAS_HEIGHT * 2;

const SERVERS = [
  {
    location: 'Ashburn, N. Virginia',
    region: 'us-east',
    latitude: 39.043757,
    longitude: -77.487442,
    color: '#0069ff',
  },
  {
    location: 'Boardman, Oregon',
    region: 'us-west',
    latitude: 45.8371049,
    longitude: -119.69639,
    color: '#0069ff',
  },
  {
    location: 'Frankfurt',
    region: 'de',
    latitude: 50.110924,
    longitude: 8.682127,
    color: '#0069ff',
  },
  {
    location: 'Stockholm',
    region: 'se',
    latitude: 59.334591,
    longitude: 18.06324,
    color: '#0069ff',
  },
  {
    location: 'Singapore',
    region: 'sg',
    latitude: -1.29027,
    longitude: 103.851959,
    color: '#0069ff',
  },
  {
    location: 'Sydney',
    region: 'au',
    latitude: -33.865143,
    longitude: 151.2099,
    color: '#0069ff',
  },
  {
    location: 'Sao Paulo',
    region: 'br',
    latitude: -23.533773,
    longitude: -46.62529,
    color: '#0069ff',
  },
  {
    location: 'Seoul',
    region: 'kr',
    latitude: 37.5326,
    longitude: 127.024612,
    color: '#0069ff',
  },
  {
    location: 'Hong Kong',
    region: 'hk',
    latitude: 22.302711,
    longitude: 114.177216,
    color: '#0069ff',
  },
];

const Scene = () => {
  const [mapIns, setMapIns] = useState<any>();
  const oc = useRef<any>(null);

  const image = useLoader(THREE.ImageLoader, './map.png');

  useEffect(() => {
    if (image) {
      const worldMap = document.createElement('canvas');
      worldMap.width = CANVAS_WIDTH;
      worldMap.height = CANVAS_HEIGHT;
      const context = worldMap.getContext('2d');
      context?.drawImage(image, 0, 0, worldMap.width, worldMap.height);
      setMapIns(context?.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data);
    }
  }, [image]);

  useEffect(() => {
    if (oc.current) {
      // Rotate to North America
      oc.current.setAzimuthalAngle(1.6);
      oc.current.setPolarAngle(0.91);
      oc.current.enableDamping = true;
      oc.current.update();
    }
  }, [oc]);

  const globeGroupRef = useRef<any>(null);

  useFrame(() => {
    if (mapIns && globeGroupRef.current) {
      if (globeGroupRef.current.scale.x < 1) {
        globeGroupRef.current.scale.x += 0.0625;
        globeGroupRef.current.scale.y += 0.0625;
        globeGroupRef.current.scale.z += 0.0625;
      }
    }
  });

  const [arcs, setArcs] = useState<{ from: number; to: number }[]>([
    { from: 0, to: 7 },
    { from: 5, to: 1 },
  ]);

  useInterval(() => {
    if (document && !document.hidden) {
      const from = Math.floor(Math.random() * 9);
      const to = Math.floor(Math.random() * 9);
      setArcs((a) => a.concat([{ from, to }]));
    }
  }, 3000);

  return (
    <>
      <OrbitControls
        ref={oc}
        autoRotate
        enableZoom={false}
        enablePan={false}
        autoRotateSpeed={0.1}
        enableDamping={false}
      />
      <group ref={globeGroupRef} scale={[0.25, 0.25, 0.25]}>
        {mapIns && (
          <>
            <Glow />
            <Sphere />
            <Dots worldmap={mapIns} />
            <CanadaFlag />

            {arcs.map((arc, index) => (
              <Arc
                key={`${arc.from}-${arc.to}-${index}`}
                fromLatitude={SERVERS[arc.from].latitude}
                fromLongitude={SERVERS[arc.from].longitude}
                toLatitude={SERVERS[arc.to].latitude}
                toLongitude={SERVERS[arc.to].longitude}
              />
            ))}

            {SERVERS.map((server, index) => (
              <Marker
                key={index}
                {...server}
                lat={server.latitude}
                long={server.longitude}
                color={server.color}
              />
            ))}
          </>
        )}
      </group>
    </>
  );
};

const StyledGlobe = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  right: -160px;
  user-select: none;
  cursor: grab;

  @media screen and (min-width: 800px) {
    width: 600px;
    height: 600px;
    top: 14px;
    left: calc(60% - 94px);
  }
`;

const Globe = () => {
  return (
    <StyledGlobe>
      <Leva collapsed hidden />
      <Canvas
        dpr={1}
        gl={{
          antialias: true,
        }}
        camera={{
          position: new Vector3(0, 0, 1200),
          far: 20000,
        }}
        id="globe-canvas"
      >
        <Suspense fallback={null}>
          {/* <axesHelper args={[1000]} /> */}
          <ambientLight intensity={1} />
          <Scene />
          {/* <Stats /> */}
        </Suspense>
      </Canvas>
    </StyledGlobe>
  );
};

export default Globe;
