
import { Text } from "@react-three/drei";
import Experience from "@/shared/components/(main)/ThreeScene/Experience";
import { forwardRef, memo, useMemo } from "react";



export const Person = memo(
    forwardRef(function Person(
        {
            assetPath,
            name,
            role,
            description,
            opacity = 0,
            photoW = 0,
            textOffsetX = 3,
            textOffsetY = 2,
            gap = 0.5,
            infoW = 5.5,
        }: {
            assetPath?: string;
            name: string;
            role?: string;
            description?: string;
            photoW?: number;
            textOffsetX?: number;
            textOffsetY?: number;
            gap?: number;
            infoW?: number;
            opacity?: number;
        },
        ref
    ) {

        // Photo positioned on the left
        const mainGroupPosition = useMemo<[number, number, number]>(
            () => [0, 0, 0],
            []
        );

        // Text group positioned using responsive configuration
        const infoGroupPosition = useMemo<[number, number, number]>(
            () => [textOffsetX, textOffsetY, 0],
            [textOffsetX, textOffsetY]
        );

        // Text starting position
        const textStartX = useMemo(() => 0, []);

        return (

            <group ref={ref} position={mainGroupPosition}>
                <Experience 
                    assetPath={assetPath} 
                    opacity={opacity}
                    photoW={photoW}
                />
                <group position={infoGroupPosition}>
                    <Text
                        font="/fonts/Poppins-Bold.ttf"
                        fontSize={0.5}
                        color="#FFF"
                        anchorX="left"
                        anchorY="top"
                        maxWidth={infoW}
                        fillOpacity={opacity}
                        position={[textStartX, 0, 0]}
                    >
                        {name}
                    </Text>
                    {role && (
                        <Text
                            font="/fonts/Poppins-Medium.ttf"
                            fontSize={0.25}
                            color="#66D6FF"
                            anchorX="left"
                            anchorY="top"
                            position={[textStartX, -1, 0]}
                            maxWidth={infoW}
                            fillOpacity={opacity}
                        >
                            {role}
                        </Text>
                    )}
                    {description && (
                        <Text
                            font="/fonts/Poppins-Medium.ttf"
                            fontSize={0.25}
                            color="#FFF"
                            anchorX="left"
                            anchorY="top"
                            position={[textStartX, -1.5, 0]}
                            maxWidth={infoW}
                            fillOpacity={opacity}
                        >
                            {description}
                        </Text>
                    )}
                </group>
            </group>
        );
    })
);

