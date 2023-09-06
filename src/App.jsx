import "./App.css";

import React, { useState } from 'react';
import { Canvas } from 'react-three-fiber';
import { Box, Plane, useTexture } from '@react-three/drei';
import { TextureLoader, DoubleSide, DirectionalLight, PCFSoftShadowMap, RepeatWrapping } from 'three';
import KeyboardControls from './KeyboardControls';

const Block = ({ position, removeBlock }) => {
    const texture = new TextureLoader().load('wall.png');
    const handleBlockClick = () => {
        removeBlock(position);
    };

    return (
        <Box args={[1, 1, 1]} position={position} castShadow receiveShadow onClick={handleBlockClick} userData={{ collide: true }}>
            <meshStandardMaterial attach="material" map={texture} />
        </Box>
    );
};

const Floor = ({ onClick }) => {
    const texture = useTexture('floor.png');
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 20);

    return (
        <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[10, 0, 10]} onClick={onClick} receiveShadow>
            <meshStandardMaterial attach="material" map={texture} />
        </Plane>
    );
};

const Billboard = ({ imgSrc, position, transparent = false, opacity = 1.0 }) => {
    const texture = useTexture(imgSrc);

    return (
        <sprite position={position}>
            <spriteMaterial attach="material" map={texture} transparent={transparent} opacity={opacity} />
        </sprite>
    );
};

const Ceiling = () => {
    const texture = useTexture('ceiling.png');
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 20);

    return (
        <Plane args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} position={[10, 1.0, 10]} receiveShadow>
            <meshStandardMaterial attach="material" map={texture} side={DoubleSide} />
        </Plane>
    );
}

const Wall = ({ rotation, position }) => {
    const texture = useTexture('wall.png');
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(20, 1);

    return (
        <Plane args={[20, 1]} rotation={rotation} position={position} receiveShadow userData={{ collide: true }}>
            <meshStandardMaterial attach="material" map={texture} side={DoubleSide} />
        </Plane>
    );
};;

function App() {
    const [blocks, setBlocks] = useState([]);

    const placeBlock = (event) => {
        const [x, _, z] = event.point;
        const position = [Math.round(x) + 0.5, 0.5, Math.round(z) + 0.5];
        const filled = blocks.findIndex(
            block => block.toString() === position.toString()
        );

        if (filled === -1) {
            setBlocks([...blocks, position ]);
        }
    };

    const removeBlock = (positionToRemove) => {
        setBlocks(prevBlocks => {
            return prevBlocks.filter(position => position.toString() !== positionToRemove.toString());
        });
    };

    return (
        <Canvas camera={{ position: [19.5, 0.5, 1], fov: 45 }}>
            <ambientLight color="#ffffff" intensity={2} />

            <Floor onClick={placeBlock} />

            {blocks.map(position => (
                <Block key={position.toString()} position={position} removeBlock={removeBlock} />
            ))}

            {/* Walls */}
            <Wall rotation={[0, Math.PI / 2, 0]} position={[0, 0.5, 10]} />   {/* Left wall */}
            <Wall rotation={[0, -Math.PI / 2, 0]} position={[20, 0.5, 10]} />  {/* Right wall */}
            <Wall rotation={[0, Math.PI, 0]} position={[10, 0.5, 0]} />        {/* Front wall */}
            <Wall rotation={[0, 0, 0]} position={[10, 0.5, 20]} />             {/* Back wall */}

            {/* Billboards */}
            <Billboard imgSrc="smiley.png" position={[1, 0.5, 19]} transparent={true} />
            <Billboard imgSrc="start.png" position={[18.0, 0.5, 1]} transparent={true} opacity={0.5} />

            <Ceiling />

            <KeyboardControls />
        </Canvas>
    );
}

export default App;
