"use client";
import React, { Suspense, useRef, useState, useEffect, useMemo, useCallback } from "react";
import clsx from "clsx";
import { Canvas } from "@react-three/fiber";
import styles from "./index.module.scss";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import { Projects as ProjectsNebula } from "@/shared/components/(main)/ThreeScene/Nebula/Projects";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import MovingLightV2 from "@/shared/components/(main)/ThreeScene/MovingLight/v2";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import ProjectCard from "./project-card";
import { ProjectRow } from "./ProjectRow";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { Blur } from "shared/components/(main)/blur";
import { Robot } from "@/shared/components/(main)/ThreeScene/Robot";
import {
  lights,
  addRobotAnimation,
} from "@/shared/components/(main)/ThreeScene/utils";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export function Projects({ projects: rawProjects, pageData }) {
  // Transform Strapi data to match component expectations
  const projects = useMemo(() => {
    if (!rawProjects) return [];
    return rawProjects.map((project, index) => ({
      ...project,
      image: project.visual,
      category: project.category || "Web Development",
      flySpeed: 1 + Math.random() * 0.5,
      flyDelay: index * 0.1,
    }));
  }, [rawProjects]);

  const rowHeight = 17;
  const colWidth = 29;
  const startZ = 14;

  const mobileRowHeight = 20;
  const mobileStartY = -10;
  const mobileZOffset = 25;

  const fov = useResponsiveFov();
  const [animated, setAnimated] = useState(false);
  const [startY, setStartY] = useState(-6);
  const ambient = useMemo(() => ({
    color: "#5500aa",
    intensity: 50,
  }), []);
  const h1Ref = useRef(null);
  const [triggerExplosion, setTriggerExplosion] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const minHeight = `${50 + projects.length * (isPhone ? 80 : 65)}vh`;
  const [viewMode, setViewMode] = useState("grid");
  const [openedIndex, setOpenedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const robotScale = 50;
  const robotRef = useRef();
  const ambientLightRef = useRef();
  const robotIsStart = useRef(false);
  const MovingLightV2Ref = useRef();
  const [robotReady, setRobotReady] = useState(false);

  useEffect(() => {
    robotIsStart.current = false;
    setRobotReady(false);
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === "body") {
          trigger.kill();
        }
      });
    };
  }, []);

  useEffect(() => {
    if (robotReady && robotRef.current?.robot) {
      setTimeout(() => {
        robotRef.current.robot.traverse((child) => {
          if (child.isMesh && child.material) {
            if (child.material.transparent !== undefined) {
              child.material.transparent = false;
            }
            if (child.material.opacity !== undefined) {
              child.material.opacity = 1;
            }
            child.material.needsUpdate = true;
            child.visible = true;
          }
        });
      }, 100);
    }
  }, [robotReady]);

  // Memoize cursor position handler to avoid recreating on every render
  const handleMouseMove = useCallback((e) => {
    if (!isPhone) {
      setCursorPos({ x: e.clientX, y: e.clientY });
    }
  }, [isPhone]);

  useEffect(() => {
    const handleResize = () => {
      setIsPhone(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [viewMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTriggerExplosion(true);
      setTimeout(() => setTriggerExplosion(false), 100);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollFactor = isPhone ? 30 : 50;
      const baseY = isPhone ? mobileStartY : -6;
      setStartY(baseY + window.scrollY / scrollFactor);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPhone]);

  useEffect(() => {
    if (!animated) {
      setTimeout(() => {
        document.body.style.overflow = "hidden";
      }, 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [animated]);

  useGSAP(() => {
    if (!robotReady) return;

    const robot = robotRef.current.robot;
    const startPos = { x: 0, y: 0, z: 0 };

    const flightData1 = { progress: 0 };
    const flightData2 = { progress: 0 };
    const flightData3 = { progress: 0 };

    const tl = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
        duration: 1,
      },
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(
      {},
      {
        duration: 1,
        onStart: () => {
          if (robotIsStart.current || !robotRef.current) return;
          
          gsap.to(ambientLightRef?.current, {
            intensity: 0,
            duration: 1,
          });
          
          MovingLightV2Ref?.current?.lights?.forEach((light) => {
            light.visible = false;
          });
          
          robotIsStart.current = true;
        },
      },
      0,
    );

    addRobotAnimation({
      flightData: flightData1,
      controlPoints: [
        { x: 0, y: -8, z: 0 },
        { x: -15, y: 5, z: 0 },
        { x: 0, y: -10, z: 0 },
        { x: 15, y: 0, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: 0, z: 0 },
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
        { x: Math.PI / 2, y: -Math.PI / 2, z: Math.PI / 2 },
        { x: 0, y: Math.PI / 4, z: 0 },
      ],
      scalePoints: [1, 0.6, 0.8, 1],
      tlConfig: {
        progress: 1,
        duration: 3,
        ease: "power2.inOut",
      },
      whenSecond: 1,
      tl,
      robot,
      startPos,
      robotScale,
    });

    addRobotAnimation({
      flightData: flightData2,
      controlPoints: [
        { x: 15, y: 0, z: 0 },
        { x: 10, y: -10, z: 0 },
        { x: -10, y: -10, z: 0 },
        { x: -15, y: 0, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: Math.PI / 4, z: 0 },
        { x: 0, y: 0, z: Math.PI / 8 },
        { x: 0, y: 0, z: Math.PI / 8 },
        { x: 0, y: -Math.PI / 8, z: 0 },
      ],
      scalePoints: [1, 1, 1, 1],
      tlConfig: {
        progress: 1,
        duration: 5,
        ease: "power2.inOut",
      },
      whenSecond: 8,
      tl,
      robot,
      startPos,
      robotScale,
    });

    addRobotAnimation({
      flightData: flightData3,
      controlPoints: [
        { x: -15, y: 0, z: 0 },
        { x: -20, y: -8, z: 0 },
        { x: 0, y: -8, z: 0 },
        { x: 100, y: -8, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: -Math.PI / 8, z: 0 },
        { x: 0, y: 0, z: -Math.PI / 8 },
        { x: 0, y: 0, z: 0 },
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
      ],
      scalePoints: [1, 1, 1, 1],
      tlConfig: {
        progress: 1,
        duration: 4,
        ease: "power2.inOut",
      },
      whenSecond: 13,
      tl,
      robot,
      startPos,
      robotScale,
    });

    tl.to(
      {},
      {
        duration: 1,
      },
      19,
    );

    return () => {
      tl.kill();
    };
  }, [robotReady]);

  const getRandomStart = (index, total) => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const theta = goldenAngle * index;
    const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
    const r = isPhone ? 80 + Math.random() * 80 : 100 + Math.random() * 100;
    return [
      Math.sin(phi) * Math.cos(theta) * r,
      Math.sin(phi) * Math.sin(theta) * r,
      -1000,
    ];
  };

  const frontBlocks = useMemo(() => {
    let blocks = [];
    let i = 0;
    let row = 0;
    if (isPhone) {
      for (let i = 0; i < projects.length; i++) {
        const y = mobileStartY - i * mobileRowHeight;
        const x = 0;
        const z = mobileZOffset + (i % 2 === 0 ? 0 : -2);

        blocks.push({
          position: [x, y, z],
          flySpeed: projects[i].flySpeed,
          flyDelay: projects[i].flyDelay + i * 0.1,
          levitatePhase: Math.random() * Math.PI * 2,
          startPosition: getRandomStart(i, projects.length),
          html: <ProjectCard project={projects[i]} />,
        });
      }
    } else {
      while (i < projects.length) {
        const y = 1 - row * rowHeight;
        if (row % 2 === 0) {
          for (let col = 0; col < 2 && i < projects.length; col++, i++) {
            const position1 = [(col - 0.5) * colWidth, y, startZ];
            blocks.push({
              position: position1,
              flySpeed: projects[i].flySpeed,
              flyDelay: projects[i].flyDelay,
              levitatePhase: Math.random() * Math.PI * 2,
              startPosition: getRandomStart(i, projects.length),
              html: <ProjectCard project={projects[i]} />,
            });
          }
        } else {
          blocks.push({
            position: [0, y, startZ],
            flySpeed: projects[i].flySpeed,
            flyDelay: projects[i].flyDelay,
            levitatePhase: Math.random() * Math.PI * 2,
            startPosition: getRandomStart(i, projects.length),
            html: <ProjectCard project={projects[i]} />,
          });
          i++;
        }
        row++;
      }
    }
    return blocks;
  }, [projects.length, isPhone]);

  return (
    <section className={clsx(styles.Projects)}>
      <Canvas
        camera={{
          position: isPhone ? [0, 0, 35] : [0, 0, 40],
          fov: isPhone ? fov + 5 : fov,
        }}
        className={clsx(styleScene.scene)}
      >
        <ambientLight
          ref={ambientLightRef}
          color={ambient.color}
          intensity={ambient.intensity}
        />
        <MovingLightV2 ref={MovingLightV2Ref} />
        <Suspense fallback={null}>
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <directionalLight position={[0, -10, 10]} intensity={2} color="#ffffff" />
          <NebulaV2
            triggerExplosion={triggerExplosion}
            enableMouse={!isPhone}
            enableSway={!isPhone}
            onExplosionStart={() => setAnimated(true)}
          >
            <ProjectsNebula
              isPhone={isPhone}
              visible={viewMode === "grid"}
              frontBlocks={frontBlocks}
              explosionStarted={animated}
              scrollOffsetY={startY}
            />
          </NebulaV2>
          {lights.map((pos, i) => (
            <directionalLight
              key={i}
              position={pos}
              intensity={1}
              color={"#fff"}
            />
          ))}
          <Robot
            key="projects-robot"
            ref={robotRef}
            scale={robotScale}
            position={[0, -8, 0]}
            rotation={[0, 0, 0]}
            showNormal={true}
            showHolographic={false}
            onlyOne={true}
            onReady={() => {
              setRobotReady(true);
            }}
          />
        </Suspense>
        <CursorTrail />
      </Canvas>
      <div
        className={styles.projects}
        style={
          viewMode === "grid"
            ? { minHeight }
            : { minHeight: "auto", height: "auto" }
        }
      >
        <h1 ref={h1Ref} className={clsx({ [styles.animated]: animated })}>
          {pageData?.title || "Projects"}
        </h1>
        <div
          className={clsx(styles.description, { [styles.animated]: animated })}
        >
          <span>
            {pageData?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy"}
          </span>
          <div className={styles.views}>
            {["grid", "list"].map((view) => (
              <React.Fragment key={view}>
                <button
                  className={clsx({ [styles.active]: viewMode === view })}
                  onClick={() => setViewMode(view)}
                >
                  {view}
                </button>
                {view !== "list" && " | "}
              </React.Fragment>
            ))}
          </div>
        </div>
        <ul
          className={clsx(styles.list, {
            [styles.visible]: viewMode === "list",
            [styles.hidden]: viewMode !== "list",
          })}
          role="list"
          aria-label="Projects list"
        >
          {projects.map((block, index) => (
            <ProjectRow
              key={block.slug || block.id || `project-${index}`}
              block={block}
              index={index}
              isPhone={isPhone}
              hoveredIndex={hoveredIndex}
              openedIndex={openedIndex}
              onHover={setHoveredIndex}
              onToggle={setOpenedIndex}
              onMouseMove={handleMouseMove}
            />
          ))}
        </ul>
        {viewMode === "list" && hoveredIndex !== null && !isPhone && (
          <div
            className={styles.previewImage}
            style={{
              left: cursorPos.x + 32,
              top: cursorPos.y - 40,
            }}
            aria-hidden="true"
          >
            <Blur className={styles.blur} />
          </div>
        )}
      </div>
    </section>
  );
}
