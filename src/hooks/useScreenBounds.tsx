import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';

export function useScreenBounds(z = 0) {
  const { camera, size } = useThree();

  return useMemo(() => {
    let width: number, height: number;

    if ('isPerspectiveCamera' in camera && camera.isPerspectiveCamera) {
      const fov = (camera.fov * Math.PI) / 180;
      height = 2 * Math.tan(fov / 2) * Math.abs(camera.position.z - z);
      width = height * (size.width / size.height);
    } else if ('isOrthographicCamera' in camera && camera.isOrthographicCamera) {
      width = Math.abs(camera.right - camera.left);
      height = Math.abs(camera.top - camera.bottom);
    } else {
      width = size.width;
      height = size.height;
    }

    return {
      top: height / 2,
      bottom: -height / 2,
      left: -width / 2,
      right: width / 2,
      width,
      height,
    };
  }, [camera, size, z]);
}
