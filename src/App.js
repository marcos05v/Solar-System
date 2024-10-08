import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import planetsData from './PlanetData'; // Ajusta la ruta según la ubicación de tu archivo

// Componente para dibujar las órbitas como líneas
function Orbit({ radius }) {
  const points = useMemo(() => {
    const temp = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * 2 * Math.PI;
      temp.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return temp;
  }, [radius]);

  const orbitGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line geometry={orbitGeometry}>
      <lineBasicMaterial color="white" transparent={true} opacity={0.3} />
    </line>
  );
}

// Componente Planet con texturas
function Planet({ planetData, setSelectedObject, speedMultiplier, setHoveredObject }) {
  const planetRef = useRef();
  const planetMeshRef = useRef();
  const texture = useLoader(THREE.TextureLoader, planetData.textureUrl);

  const handlePlanetClick = () => {
    if (planetRef.current) {
      setSelectedObject({ ref: planetRef, data: planetData });
    }
  };

  const handlePointerOver = () => {
    setHoveredObject(planetData.nombre); // Cambiado a 'nombre' para que coincida con los datos
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredObject(null);
    document.body.style.cursor = 'auto';
  };

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speedMultiplier;
    const orbitPosition = time * planetData.velocidad_orbital; // Cambiado a 'velocidad_orbital'
    planetRef.current.position.x = planetData.radio_orbita * Math.cos(orbitPosition); // Cambiado a 'radio_orbita'
    planetRef.current.position.z = planetData.radio_orbita * Math.sin(orbitPosition); // Cambiado a 'radio_orbita'

    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += planetData.velocidad_rotacion * speedMultiplier; // Cambiado a 'velocidad_rotacion'
    }
  });

  return (
    <group ref={planetRef}>
      <mesh
        onClick={handlePlanetClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        ref={planetMeshRef}
      >
        <sphereGeometry args={[planetData.tamaño, 32, 32]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

// Componente para cada asteroide con su referencia
function AsteroidWithRef({ asteroidData, speedMultiplier, setSelectedObject, setHoveredObject, setAsteroidRefs }) {
  const asteroidRef = useRef();
  const orbitRadius = parseFloat(asteroidData.close_approach_data[0].miss_distance.kilometers) / 100000; // Asegúrate de que close_approach_data siempre tenga datos
  const orbitSpeed = 0.05 / (orbitRadius / 10);
  const initialAngle = useMemo(() => Math.random() * 2 * Math.PI, []);

  const handleAsteroidClick = () => {
    setSelectedObject({ ref: asteroidRef, data: asteroidData });
  };

  const handlePointerOver = () => {
    setHoveredObject(asteroidData.name);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHoveredObject(null);
    document.body.style.cursor = 'auto';
  };

  useEffect(() => {
    setAsteroidRefs((prevRefs) => ({
      ...prevRefs,
      [asteroidData.name]: asteroidRef,
    }));
  }, [asteroidData.name, setAsteroidRefs]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speedMultiplier;
    const orbitPosition = initialAngle + time * orbitSpeed;
    const x = orbitRadius * Math.cos(orbitPosition);
    const z = orbitRadius * Math.sin(orbitPosition);
    asteroidRef.current.position.set(x, 0, z);
  });

  return (
    <mesh
      ref={asteroidRef}
      onClick={handleAsteroidClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color={'white'} />
    </mesh>
  );
}

function CameraZoomIn({ orbitControlsRef }) {
  const { camera } = useThree();
  const [isZooming, setIsZooming] = useState(true);
  
  const initialPosition = new THREE.Vector3(1250, 1250, 1250);
  const finalPosition = new THREE.Vector3(50, 50, 50); 
  const totalDuration = 2; 
  const [elapsedTime, setElapsedTime] = useState(0); 

  useEffect(() => {
    camera.position.copy(initialPosition);
  }, [camera]);

  useFrame((_, delta) => {
    if (isZooming) {
      const timeFactor = elapsedTime / totalDuration;
      if (timeFactor < 1) {
        camera.position.lerpVectors(initialPosition, finalPosition, timeFactor);
        setElapsedTime((prev) => prev + delta);
      } else {
        camera.position.copy(finalPosition);
        setIsZooming(false);
      }

      camera.lookAt(0, 0, 0); 
    }
    if (orbitControlsRef.current) {
      orbitControlsRef.current.update();
    }
  });

  return null;
}

// Componente para controlar la cámara y seguir al objeto seleccionado
function CameraController({ selectedObject, orbitControlsRef }) {
  const { camera } = useThree();
  const [isMovingToObject, setIsMovingToObject] = useState(false);
  const [targetCameraPosition, setTargetCameraPosition] = useState(new THREE.Vector3());

  useEffect(() => {
    if (selectedObject && selectedObject.ref && selectedObject.ref.current) {
      const objectPosition = selectedObject.ref.current.position.clone();
      const offset = new THREE.Vector3(5, 5, 5);
      const desiredCameraPosition = objectPosition.clone().add(offset);
      setTargetCameraPosition(desiredCameraPosition);
      setIsMovingToObject(true);
    } else {
      const initialPosition = new THREE.Vector3(10, 10, 10);
      setTargetCameraPosition(initialPosition);
      setIsMovingToObject(true);
    }
  }, [selectedObject]);

  useFrame(() => {
    if (isMovingToObject) {
      camera.position.lerp(targetCameraPosition, 0.1);
      if (camera.position.distanceTo(targetCameraPosition) < 0.01) {
        camera.position.copy(targetCameraPosition);
        setIsMovingToObject(false);
      }
    }
    if (selectedObject && selectedObject.ref && selectedObject.ref.current) {
      const objectPosition = selectedObject.ref.current.position;
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.copy(objectPosition);
        orbitControlsRef.current.update();
      }
    }
  });

  return null;
}

// Componente para mostrar la lista de asteroides
function AsteroidList({ asteroids, setSelectedObject, asteroidRefs }) {
  return (
    <div className="asteroid-list">
      <h3>Asteroides</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {asteroids.map((asteroid, index) => (
          <li
            key={index}
            className="asteroid-item"
            onClick={() => {
              const asteroidRef = asteroidRefs[asteroid.name];
              if (asteroidRef) {
                setSelectedObject({ ref: asteroidRef, data: asteroid });
              }
            }}
          >
            {asteroid.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
// Componente PlanetInfo para mostrar la información del planeta seleccionado
function PlanetInfo({ selectedObject, setSelectedObject }) {
  if (!selectedObject || !selectedObject.data) {
    return null;
  }

  const { data } = selectedObject;
  const isPlanet = data.textureUrl !== undefined;

  return (
    <div className="planet-info">
      <h2>{data.nombre}</h2>
      {isPlanet ? (
        <>
          <p><strong>Tamaño:</strong> {data.tamaño}</p>
          <p><strong>Radio de Órbita:</strong> {data.radio_orbita}</p>
          <p><strong>Velocidad de Rotación:</strong> {data.velocidad_rotacion}</p>
          <p><strong>Velocidad Orbital:</strong> {data.velocidad_orbital}</p>
        </>
      ) : (
        <>
          <p><strong>Diámetro Estimado:</strong> {data.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
          <p><strong>Distancia de Aproximación:</strong> {parseFloat(data.close_approach_data[0].miss_distance.kilometers).toFixed(2)} km</p>
          <p><strong>Velocidad:</strong> {parseFloat(data.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)} km/h</p>
        </>
      )}
      <button onClick={() => setSelectedObject(null)}>Cerrar</button>
    </div>
  );
}


function SolarSystem() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);
  const [asteroidRefs, setAsteroidRefs] = useState({});
  const orbitControlsRef = useRef();
  const [asteroidsData, setAsteroidsData] = useState([]);

  const handleSpeedChange = (e) => {
    setSpeedMultiplier(parseFloat(e.target.value));
  };

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    const startDate = getCurrentDate();
    const apiKey = 'DEMO_KEY'; // Reemplaza 'DEMO_KEY' con tu propia API key de NASA

    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${startDate}&api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        setAsteroidsData(data.near_earth_objects[startDate] || []);
      })
      .catch((error) => {
        console.error('Error fetching asteroid data:', error);
      });
  }, []);

  // Función para restablecer la cámara al hacer clic fuera de los objetos
  const resetCamera = () => {
    setSelectedObject(null);
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <input
        type="range"
        min="1"
        max="50"
        step="1"
        value={speedMultiplier}
        onChange={handleSpeedChange}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '300px',
          zIndex: 1,
        }}
      />

{hoveredObject && (
  <div className="hover-info">
    {hoveredObject}
  </div>
)}

      <PlanetInfo selectedObject={selectedObject} setSelectedObject={setSelectedObject} />

      <AsteroidList asteroids={asteroidsData} setSelectedObject={setSelectedObject} asteroidRefs={asteroidRefs} />

      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'black', height: '100vh' }}
        onPointerMissed={resetCamera}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={1.5} />
        <OrbitControls ref={orbitControlsRef} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

        {/* Componente de zoom inicial */}
        <CameraZoomIn orbitControlsRef={orbitControlsRef} />

        <CameraController selectedObject={selectedObject} orbitControlsRef={orbitControlsRef} />

        {planetsData
          .filter((planet) => planet.radio_orbita > 0) // Cambiado a 'radio_orbita'
          .map((planet, index) => (
            <Orbit key={`orbit-${index}`} radius={planet.radio_orbita} /> // Cambiado a 'radio_orbita'
          ))}

        {planetsData.map((planetData, index) => (
          <Planet
            key={index}
            setSelectedObject={setSelectedObject}
            planetData={planetData}
            speedMultiplier={speedMultiplier}
            setHoveredObject={setHoveredObject}
          />
        ))}

        {asteroidsData.map((asteroidData, index) => (
          <AsteroidWithRef
            key={index}
            asteroidData={asteroidData}
            speedMultiplier={speedMultiplier}
            setSelectedObject={setSelectedObject}
            setHoveredObject={setHoveredObject}
            setAsteroidRefs={setAsteroidRefs}
          />
        ))}
      </Canvas>
    </div>
  );
}

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <SolarSystem />
    </div>
  );
}

export default App;
