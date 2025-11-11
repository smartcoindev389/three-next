'use client';
import { forwardRef, memo } from "react";
import { Box, Edges, Text } from "@react-three/drei";
import { BoardProps } from "@/types";
import { getGradientMaterial, getBoxShadowMaterial } from "@/utils/shaders";

const MAIN_FONT = "/fonts/Poppins-Bold.ttf";
const SUB_FONT = "/fonts/Poppins-Medium.ttf";

export const Board = memo(
  forwardRef(function Board(
    {
      position,
      rotation = [0, 0, 0],
      scale = 1,
      isActive = false,
      idx,
      boardHeight = 2.0,
      boardWidth = 2.0,
      boardDepth = 0.01,
      handleToggle,
      gradientMaterial = { opacity: 0.9 },
      edgeActiveColor = "#a6daff",
      edgeColor = "#0d3857",
      glowBoxScaleX = 1.09,
      glowBoxScaleY = 1.09,
      mainText,
      subText,
      subtitle,
      mainFont = MAIN_FONT,
      subFont = SUB_FONT,
      mainFontSize,
      subFontSize,
      showReadMore = false,
      opacity = 1,
      correctionMainTextY,
      correctionSubTextY,
      correctionSubtitleY,
      anchorY = "middle"
    }: BoardProps,
    ref
  ) {
    // Розміри та позиції тексту
    const computedMainFontSize = mainFontSize || boardHeight * 0.1;
    const computedSubtitleFontSize = computedMainFontSize * 0.8;
    const computedSubFontSize = subFontSize || boardHeight * 0.08;
    const textMaxWidth = boardWidth * 0.8;
    const mainTextY = correctionMainTextY ?? 0.1 * boardHeight;
    const subtitleY = correctionSubtitleY ?? 0.25 * boardHeight;
    const subTextY = correctionSubTextY ?? -0.1 * boardHeight;
    const readMoreY = -0.3 * boardHeight; // позиція для read more блоку
    const z = boardDepth / 2 + 0.01;

    // Розміри для read more блоку
    const readMoreWidth = boardWidth * 0.4;
    const readMoreHeight = boardHeight * 0.12;
    const readMoreDepth = 0.005;
    return (
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <Box
          args={[
            boardWidth * glowBoxScaleX * 1.01,
            boardHeight * glowBoxScaleY * 1.01,
            0,
          ]}
        >
          {/* <primitive
            object={getGlowMaterial({
              ...glowMaterial,
              opacity: opacity !== undefined ? opacity : glowMaterial.opacity,
            })}
            attach="material"
          /> */}
          <primitive
            object={getBoxShadowMaterial({
              opacity: isActive
                ? Math.min(0.3, opacity !== undefined ? opacity : 1)
                : 0,
              shadowColor: [0.4, 0.839, 1],
            })}
            attach="material"
          />
        </Box>
        <Box
          args={[boardWidth, boardHeight, boardDepth]}
          position={[0, 0, z]}
          onClick={() => handleToggle?.(idx)}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
          }}
        >
          <primitive
            object={getGradientMaterial({
              ...gradientMaterial,
              opacity: Math.min(
                opacity !== undefined ? opacity : 1,
                gradientMaterial.opacity,
              ),
            })}
            attach="material"
          />

          <Edges
            scale={1.001}
            threshold={1}
            color={isActive ? edgeActiveColor : edgeColor}
            transparent={true}
            opacity={opacity}
          >
            <lineBasicMaterial
              color={isActive ? edgeActiveColor : edgeColor}
              depthWrite={false}
              depthTest={true}
            />
          </Edges>
        </Box>
        {mainText && (
          <Text
            visible={isActive}
            color="white"
            fontSize={computedMainFontSize}
            font={mainFont}
            lineHeight={1.18}
            anchorX="center"
            anchorY={anchorY}
            maxWidth={textMaxWidth}
            textAlign="center"
            position={[0, mainTextY, z]}
            fillOpacity={opacity}
            renderOrder={5}
          >
            {mainText}
          </Text>
        )}
        {subtitle && (
          <Text
            visible={isActive}
            color="white"
            fontSize={computedSubtitleFontSize}
            font={subFont}
            lineHeight={1.18}
            anchorX="center"
            anchorY={anchorY}
            maxWidth={textMaxWidth}
            textAlign="center"
            position={[0, subtitleY, z]}
            fillOpacity={opacity}
            renderOrder={5}
          >
            {subtitle}
          </Text>
        )}
        {subText && (
          <Text
            visible={isActive}
            color="#B1CEE2"
            fontSize={computedSubFontSize}
            font={subFont}
            lineHeight={1.2}
            anchorX="center"
            anchorY={anchorY}
            maxWidth={textMaxWidth}
            textAlign="center"
            position={[0, subTextY, z]}
            fillOpacity={opacity}
            renderOrder={5}
          >
            {subText}
          </Text>
        )}

        {/* Read More блок */}
        {isActive && showReadMore && (
          <group position={[0, readMoreY, z]}>
            <Box args={[readMoreWidth, readMoreHeight, readMoreDepth]}>
              <meshBasicMaterial
                color="#3F65FD"
                opacity={Math.min(0.9, opacity !== undefined ? opacity : 1)}
              />
            </Box>
            <Text
              color="white"
              fontSize={computedSubFontSize * 1.3}
              font={subFont}
              anchorX="center"
              anchorY="middle"
              fillOpacity={opacity}
              position={[0, 0, readMoreDepth / 2 + 0.001]}
            >
              read more
            </Text>
          </group>
        )}
      </group>
    );
  })
);