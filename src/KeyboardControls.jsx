
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import * as THREE from 'three';

function KeyboardControls() {
    const { camera, scene } = useThree();
    const moveSpeed = 0.05;
    const rotationSpeed = 0.03;
    const keysPressed = useRef({});
    const forward = new THREE.Vector3();
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    const raycaster = new THREE.Raycaster();
    const moveDirections = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const checkDistance = 0.6;

    useEffect(() => {
        const handleKeyDown = (e) => {
            keysPressed.current[e.code] = true;
        };

        const handleKeyUp = (e) => {
            keysPressed.current[e.code] = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    const isColliding = (directionVector) => {
        raycaster.camera = camera;
        raycaster.far = 0.2;
        raycaster.set(camera.position, directionVector.normalize());
        const intersects = raycaster.intersectObjects(scene.children).filter(intersect => intersect.object.userData.collide);
        return intersects.length > 0 && intersects[0].distance <= checkDistance;
    };

    useFrame(() => {
        camera.position.y = 0.5; // Keeping the camera at a constant height

        if (keysPressed.current.KeyW || keysPressed.current.ArrowUp) {
            forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
            if (!isColliding(forward)) {
                camera.position.add(forward.multiplyScalar(moveSpeed));
            }
        }

        if (keysPressed.current.KeyS || keysPressed.current.ArrowDown) {
            forward.set(0, 0, 1).applyQuaternion(camera.quaternion);
            if (!isColliding(forward)) {
                camera.position.add(forward.multiplyScalar(moveSpeed));
            }
        }

        if (keysPressed.current.KeyA || keysPressed.current.ArrowLeft) {
            const rotateQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationSpeed);
            camera.quaternion.multiplyQuaternions(rotateQuaternion, camera.quaternion);
        }

        if (keysPressed.current.KeyD || keysPressed.current.ArrowRight) {
            const rotateQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -rotationSpeed);
            camera.quaternion.multiplyQuaternions(rotateQuaternion, camera.quaternion);
        }
    });

    return null;
}

export default KeyboardControls;
