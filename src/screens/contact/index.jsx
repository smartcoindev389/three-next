"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "shared/components/(main)/button";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { Blur } from "shared/components/(main)/blur";
import { useState, Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import styleScene from "@/shared/components/(main)/ThreeScene/style.module.scss";
import { useResponsiveFov } from "@/hooks/use-responsive-fov";
import NebulaV2 from "@/shared/components/(main)/ThreeScene/Nebula/v2";
import gsap from "gsap";
import CursorTrail from "@/shared/components/(main)/ThreeScene/CursorTrail";
import { DecryptedText } from "shared/components/(main)/DecryptedText";
import { Robot } from "@/shared/components/(main)/ThreeScene/Robot";
import {
  lights,
  addRobotAnimation,
} from "@/shared/components/(main)/ThreeScene/utils";
import { useGSAP } from "@gsap/react";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s\+\-\(\)]+$/,
      "Phone number can only contain digits, spaces, +, -, ( ).",
    ),
  emailAddress: z
    .string()
    .min(1, "Email is required.")
    .email("Email is invalid."),

  businessName: z.string().min(1, "Business name is required."),
  location: z.string().min(1, "Location is required."),
  existingWebsite: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/gi.test(
          val,
        ),
      "Please enter a valid URL.",
    ),

  services: z.array(z.string()).min(1, "Please select at least one service."),

  projectDescription: z
    .string()
    .min(10, "Project description must be at least 10 characters long."),

  idealTimeline: z.string().optional(),
  approximateBudget: z.string().optional(),

  howDidYouHear: z.string().optional(),
});

const serviceOptions = [
  { value: "industrial-design", label: "Industrial design" },
  { value: "retail-fulfillment", label: "Retail fulfillment" },
  { value: "contract-manufacturing", label: "Contract manufacturing" },
  { value: "shipping-logistics", label: "Shipping and logistics" },
  { value: "branding-marketing", label: "Branding and marketing" },
  { value: "shipping-logistics-2", label: "Shipping and logistics" },
  { value: "3d-animation", label: "3d and 4d animation" },
  { value: "infrastructure-management", label: "Infrastructure management" },
  { value: "ai-store-management", label: "AI store management" },
];

const hourlyPackages = [
  {
    id: 1,
    tier: "starter",
    hoursIncluded: '25 hours',
    hourlyRate: '$175',
    totalCost: '$4,375',
    savings: 0,
    ideal: 'Small tasks, updates, or pilot projects',
    button: 'select package',
  },
  {
    id: 2,
    tier: "pro",
    hoursIncluded: '50 hours',
    hourlyRate: '$160',
    totalCost: '$8,000',
    savings: '8.5%',
    ideal: 'Mid-size feature builds or design + dev bundles',
    button: 'select package',
  },
  {
    id: 3,
    tier: "growth",
    hoursIncluded: '100 hours',
    hourlyRate: '$150',
    totalCost: '$15,000',
    savings: '14%',
    ideal: 'Clients with consistent monthly needs',
    button: 'select package',
  },
  {
    id: 4,
    tier: "scale",
    hoursIncluded: '250 hours',
    hourlyRate: '$140',
    totalCost: '$35,000',
    savings: '20%',
    ideal: 'Ongoing retainer with dedicated dev resources',
    button: 'select package',
  },
  {
    id: 5,
    tier: "enterprise",
    hoursIncluded: '500 hours',
    hourlyRate: '$130',
    totalCost: '$65,000',
    savings: '26%',
    ideal: 'Long-term development partnerships and managed rojects',
    button: 'select package',
  },
];

const includedServices = [
  {
    id: 1,
    description: "Project Management & Strategy (Jira setup, architecture reviews)",
  },
  {
    id: 2,
    description: "Development (React, Next.js, Magento, API, AWS, etc.)",
  },
  {
    id: 3,
    description: "Design (Figma, animation prototypes, UI/UX)",
  },
  {
    id: 4,
    description: "Integrations (HubSpot, ShipBob, SPS, QuickBooks, Stripe, Brandfolder)",
  },
  {
    id: 5,
    description: "QA Testing (Manual + Playwright automation)",
  },
  {
    id: 6,
    description: "DevOps Support (AWS, CI/CD, environment setup)",
  },
];

const terms = [
  {
    id: 1,
    description: "All packages are prepaid and valid for 24 months from purchase date.",
  },
  {
    id: 2,
    description: "Hours can be allocated across multiple projects or portals.",
  },
  {
    id: 3,
    description: "Unused hours roll over if a new package is purchased before expiration.",
  },
  {
    id: 4,
    description: "Custom packages available for dedicated teams (e.g., 400+ hours/month).",
  },
  {
    id: 5,
    description: "For enterprise clients, Platformz can invoice monthly against active retainers.",
  },
];

const optionalAddOns = [
  {
    id: 1,
    name: "Priority SLA",
    description: "24-hour response time and priority queueing",
    rate: "+10%",
  },
  {
    id: 2,
    name: "Dedicated QA Lead",
    description: "Full-time QA tester assigned to your project",
    rate: "$3,000/mo",
  },
  {
    id: 3,
    name: "PM/Tech Architect Oversight",
    description: "Weekly reporting and technical review",
    rate: "$1,500/mo",
  },
];

export function Contact() {
  const fov = useResponsiveFov();
  const group = useRef();

  const robotRef = useRef();
  const [robotReady, setRobotReady] = useState(false);
  const robotScale = 40;

  const tl = useRef();

  const titleRef = useRef();
  const formRef = useRef();
  const part1Ref = useRef();
  const part2Ref = useRef();
  const part3Ref = useRef();
  const part4Ref = useRef();
  const part5Ref = useRef();
  const submitBtnRef = useRef();

  useGSAP(() => {
    if (!robotReady) return;

    const robot = robotRef.current.robot;
    const startPos = { x: 0, y: 0, z: 0 };

    const flightData1 = { progress: 0 };
    const flightData2 = { progress: 0 };

    tl.current = gsap.timeline({
      defaults: {
        ease: "sine.inOut",
        duration: 1,
      },
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 3,
      },
    });

    addRobotAnimation({
      flightData: flightData1,
      controlPoints: [
        { x: 23, y: 0, z: 0 },
        { x: 23, y: 0, z: 0 },
        { x: 23, y: 0, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: -Math.PI / 6, z: Math.PI / 20 },
        { x: 0, y: 0, z: Math.PI / 10 },
        { x: 0, y: -Math.PI / 6, z: Math.PI / 20 },
      ],
      scalePoints: [1, 1, 1],
      tlConfig: {
        progress: 1,
        duration: 6,
        ease: "power2.inOut",
      },
      whenSecond: 1,
      tl: tl.current,
      robot,
      startPos,
      robotScale,
    });

    addRobotAnimation({
      flightData: flightData2,
      controlPoints: [
        { x: 23, y: 0, z: 0 },
        { x: 23, y: 0, z: 0 },
        { x: 100, y: 0, z: 0 },
      ],
      rotationPoints: [
        { x: 0, y: -Math.PI / 6, z: Math.PI / 20 },
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
        { x: Math.PI / 2, y: 0, z: -Math.PI / 2 },
      ],
      scalePoints: [1, 1, 1],
      tlConfig: {
        progress: 1,
        duration: 6,
        ease: "power2.inOut",
      },
      whenSecond: 7,
      tl: tl.current,
      robot,
      startPos,
      robotScale,
    });

    tl.current.to(
      {},
      {
        duration: 1,
      },
      19,
    );
  }, [robotReady]);

  const [final, setFinal] = useState(false);

  useGSAP(() => {
    if (!titleRef.current || final) return;

    gsap.from(titleRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2,
    });

    const inputs = document.querySelectorAll('input:not([type="checkbox"]), textarea');
    inputs.forEach((input) => {
      input.addEventListener('focus', (e) => {
        gsap.to(e.target, {
          scale: 1.01,
          duration: 0.2,
          ease: "power1.out",
        });
      });
      input.addEventListener('blur', (e) => {
        gsap.to(e.target, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    });

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const label = e.target.nextElementSibling || e.target.parentElement;
        if (e.target.checked) {
          gsap.to(label, {
            scale: 1.03,
            duration: 0.15,
            ease: "back.out(2)",
            yoyo: true,
            repeat: 1,
          });
        }
      });
    });

    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach((row) => {
      row.addEventListener('mouseenter', (e) => {
        gsap.to(e.currentTarget, {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          duration: 0.3,
          ease: "power1.out",
        });
      });
      row.addEventListener('mouseleave', (e) => {
        gsap.to(e.currentTarget, {
          backgroundColor: 'transparent',
          duration: 0.3,
          ease: "power1.out",
        });
      });
    });

    const sections = [part1Ref, part2Ref, part3Ref, part4Ref, part5Ref].filter(
      (ref) => ref.current
    );

    sections.forEach((ref, index) => {
      const fields = ref.current.querySelectorAll(
        `.${styles.field}, .${styles.radio_checkboxes_item}, .${styles.hourly_packages_title}, .${styles.hourly_packages_description}, .${styles.hourly_packages_table}, .${styles.included_services}, .${styles.optional_add_ons}`
      );

      gsap.from(ref.current.querySelector(`.${styles.subtitle}`), {
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });

      if (fields.length > 0) {
        gsap.from(fields, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    });

    if (submitBtnRef.current) {
      gsap.from(submitBtnRef.current, {
        scrollTrigger: {
          trigger: submitBtnRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: "back.out(1.2)",
      });
    }
  }, [final]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      services: [],
      howDidYouHear: "",
    },
  });

  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedHourlyPackage, setSelectedHourlyPackage] = useState(null);

  const handleAddOnClick = (id) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter((i) => i !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };
  
  const handleHourlyPackageClick = (id) => {
    if (selectedHourlyPackage === id) {
      setSelectedHourlyPackage(null);
    } else {
      setSelectedHourlyPackage(id);
    }
  };

  const [submitError, setSubmitError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      
      const submissionData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.emailAddress,
        businessName: data.businessName,
        location: data.location,
        existingWebsite: data.existingWebsite || "",
        services: data.services,
        projectDescription: data.projectDescription,
        idealTimeline: data.idealTimeline || "",
        approximateBudget: data.approximateBudget || "",
        howDidYouHear: data.howDidYouHear || "",
        selectedAddOns: optionalAddOns.filter(a => selectedAddOns.includes(a.id)),
        selectedHourlyPackage: hourlyPackages.find(p => p.id === selectedHourlyPackage),
      };
      
      console.log("✅ Final submission data:", submissionData);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message");
      }

      setFinal(true);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to send message. Please try again."
      );
    }
  };

  const handleServiceChange = async (serviceValue, checked) => {
    const currentServices = getValues("services") || [];
    const newServices = checked 
      ? [...currentServices, serviceValue]
      : currentServices.filter((s) => s !== serviceValue);
    
    setValue("services", newServices, { shouldValidate: true });
    console.log("Services updated:", newServices);
    await trigger("services");
  };

  useEffect(() => {
    if (final && robotReady) {
      tl.current?.kill();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      const tlInside = gsap.timeline({
        defaults: {
          ease: "power1.out",
          duration: 1,
        },
      });
      if (group.current) {
        tlInside.to(
          group.current.scale,
          {
            x: 1,
            y: 1,
            z: 1,
          },
          0,
        );
      }
      if (robotRef.current) {
        tlInside.to(
          robotRef.current.robot.position,
          {
            x: 0,
            y: 4,
            z: 0,
            duration: 0.25,
          },
          0,
        );
        tlInside.to(
          robotRef.current.robot.rotation,
          {
            x: 0.1,
            y: 0,
            z: 0,
            duration: 0.25,
          },
          0,
        );
      }

      if (document.querySelector(`.${styles.final}`)) {
        tlInside.to(
          `.${styles.final}`,
          {
            opacity: 1,
            pointerEvents: "all",
          },
          0,
        );
      }
    }
  }, [final, robotReady]);

  return (
    <section className={clsx(styles.section, final && styles.finalSection)}>
      <Canvas
        camera={{ position: [0, 0, 30], fov }}
        className={clsx(styleScene.scene, styles.canvas)}
      >
        {lights.map((pos, i) => (
          <directionalLight
            key={i}
            position={pos}
            intensity={1}
            color={"#fff"}
          />
        ))}
        <Suspense fallback={null}>
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <Robot
            ref={robotRef}
            scale={robotScale}
            position={[23, 0, 0]}
            rotation={[0, -Math.PI / 6, Math.PI / 20]}
            showNormal={true}
            onlyOne={true}
            showHolographic={false}
            onReady={() => {
              setRobotReady(true);
            }}
          />
          <group ref={group} scale={0}>
            <NebulaV2
              enableMouse={true}
              enableSway={false}
              autoExplosion={true}
              disableScrollExplosion={true}
              triggerExplosion={final}
            />
          </group>
        </Suspense>
        <CursorTrail />
      </Canvas>
      <div className={clsx(styles.final, final && styles.visibleFinal)}>
        <h1 className={clsx(styles.title)}>Reply received!</h1>
        <h2 className={clsx(styles.subtitle_big)}>We will contact you</h2>
        <Button
          className={clsx(styles.button)}
          href="/"
          isBlueBtn
          isSecondaryBtn
        >
          Go to home
        </Button>
      </div>
      {!final && (
        <>
          <h1 ref={titleRef} className={clsx(styles.title)}>Get a quote</h1>

          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <div ref={part1Ref} className={clsx(styles.part)}>
              <h2 className={clsx(styles.subtitle)}>
                first let&apos;s get acquainted
              </h2>
              <div className={clsx(styles.grid)}>
                <div className={clsx(styles.field)}>
                  <label htmlFor="firstName">first name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="first name"
                    autoComplete="given-name"
                    {...register("firstName")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.firstName,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.firstName}
                      text={
                        errors.firstName?.message || "First name is required."
                      }
                    />
                  </span>
                </div>

                <div className={clsx(styles.field)}>
                  <label htmlFor="lastName">last name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="last name"
                    autoComplete="family-name"
                    {...register("lastName")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.lastName,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.lastName}
                      text={
                        errors.lastName?.message || "Last name is required."
                      }
                    />
                  </span>
                </div>

                <div className={clsx(styles.field)}>
                  <label htmlFor="phoneNumber">phone number</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+4хххх хххх ххх"
                    autoComplete="tel"
                    {...register("phoneNumber")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.phoneNumber,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.phoneNumber}
                      text={
                        errors.phoneNumber?.message ||
                        "Phone number is required"
                      }
                    />
                  </span>
                </div>

                <div className={clsx(styles.field)}>
                  <label htmlFor="emailAddress">email address</label>
                  <input
                    id="emailAddress"
                    type="email"
                    placeholder="email address"
                    autoComplete="email"
                    {...register("emailAddress")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.emailAddress,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.emailAddress}
                      text={
                        errors.emailAddress?.message || "Email is required."
                      }
                    />
                  </span>
                </div>
              </div>
            </div>

            <div ref={part2Ref} className={clsx(styles.part)}>
              <h2 className={clsx(styles.subtitle)}>
                tell us about your business
              </h2>

              <div className={clsx(styles.grid)}>
                <div className={clsx(styles.field, styles.full)}>
                  <label htmlFor="businessName">
                    what is your business name?
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    placeholder="business name"
                    autoComplete="organization"
                    {...register("businessName")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.businessName,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.businessName}
                      text={
                        errors.businessName?.message ||
                        "Business name is required."
                      }
                    />
                  </span>
                </div>
                <div className={clsx(styles.field)}>
                  <label htmlFor="location">where are you based?</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="location"
                    autoComplete="address-level2"
                    {...register("location")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.location,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.location}
                      text={errors.location?.message || "Location is required."}
                    />
                  </span>
                </div>
                <div className={clsx(styles.field)}>
                  <label htmlFor="existingWebsite">
                    do you have an existing website?
                  </label>
                  <input
                    id="existingWebsite"
                    type="text"
                    placeholder="website"
                    autoComplete="url"
                    {...register("existingWebsite")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.existingWebsite,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.existingWebsite}
                      text={
                        errors.existingWebsite?.message ||
                        "Please enter a valid URL."
                      }
                    />
                  </span>
                </div>
              </div>
            </div>

            <div ref={part3Ref} className={clsx(styles.part)}>
              <h2 className={clsx(styles.subtitle)}>now let&apos;s get to the nitty-gritty!</h2>

              <div className={clsx(styles.radio_checkboxes)}>
                {serviceOptions.length &&
                  serviceOptions?.map(({ value, label }) => (
                    <div
                      key={value}
                      className={clsx(styles.radio_checkboxes_item)}
                    >
                      <input
                        type="checkbox"
                        id={value}
                        value={value}
                        checked={getValues("services")?.includes(value) || false}
                        onChange={(e) =>
                          handleServiceChange(value, e.target.checked)
                        }
                      />
                      <label htmlFor={value}>{label}</label>
                    </div>
                  ))}
              </div>

              <span
                className={clsx(styles.errors, {
                  [styles.visible]: errors.services,
                })}
              >
                <DecryptedText
                  trigger={errors.services}
                  text={
                    errors.services?.message ||
                    "Please select at least one service."
                  }
                />
              </span>
            </div>

            <div ref={part4Ref} className={clsx(styles.part)}>
              <div className={clsx(styles.grid)}>
                <div className={clsx(styles.field, styles.full)}>
                  <label htmlFor="projectDescription">
                    please describe the main purpose and primary goals of your
                    project.
                  </label>
                  <textarea
                    id="projectDescription"
                    placeholder="Project description..."
                    {...register("projectDescription")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.projectDescription,
                    })}
                  >
                    <DecryptedText
                      trigger={errors.projectDescription}
                      text={
                        errors.projectDescription?.message ||
                        "Project description must be at least 10 characters long."
                      }
                    />
                  </span>
                </div>
                <div className={clsx(styles.field)}>
                  <label htmlFor="idealTimeline">
                    do you have an ideal timeline?
                  </label>
                  <input
                    id="idealTimeline"
                    type="text"
                    placeholder="Timeline"
                    {...register("idealTimeline")}
                  />
                </div>
                <div className={clsx(styles.field)}>
                  <label htmlFor="approximateBudget">
                    what is your approximate budget?
                  </label>
                  <input
                    id="approximateBudget"
                    type="text"
                    placeholder="Budget"
                    {...register("approximateBudget")}
                  />
                </div>
              </div>
            </div>

            <div ref={part5Ref} className={clsx(styles.part)}>
              <div className={clsx(styles.hourly_packages_title)}>
                <h3>Platformz Hourly Packages</h3>
                <p>(2025 Standard Rates)</p>
              </div>
              <div className={clsx(styles.hourly_packages_description)}>
                <p>
                  Platformz offers flexible retainer options for clients who
                  want ongoing access to our development, design, and
                  integration teams.
                </p>
                <p>
                  Each tier includes access to all disciplines — front-end,
                  back-end, UI/UX, QA, DevOps, and project management — under a
                  unified billing rate.
                </p>
              </div>
              <Blur className={clsx(styles.hourly_packages_table)} isAnimation>
                <table>
                  <thead>
                    <tr>
                      <th>tier</th>
                      <th>hours included</th>
                      <th>hourly rate</th>
                      <th>total cost</th>
                      <th>savings</th>
                      <th>ideal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourlyPackages.map(
                      ({
                        id,
                        tier,
                        hoursIncluded,
                        hourlyRate,
                        totalCost,
                        savings,
                        ideal,
                        button,
                      }) => (
                        <tr key={`hourly-package-${id}`}>
                          <td className={clsx(styles.tier_cell)}>{tier}</td>
                          <td>{hoursIncluded}</td>
                          <td>{hourlyRate}</td>
                          <td>{totalCost}</td>
                          <td>{savings ? `${savings}%` : "—"}</td>
                          <td>{ideal}</td>
                          <td>
                            <Button isBlueBtn width={127} type="button" onClick={() => handleHourlyPackageClick(id)} className={clsx(selectedHourlyPackage === id && styles.selected, styles.hourly_package_button)}>{selectedHourlyPackage === id ? "cancel" : "select package"}</Button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Blur>
              <div className={clsx(styles.included_services)}>
                <div className={clsx(styles.included_services_title)}>
                  <h3>Included Services</h3>
                  <ul className={clsx(styles.included_services_list)}>
                    {includedServices.map(({ id, description }) => (
                      <li key={`included-service-${id}`}>
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="17" viewBox="0 0 25 17" fill="none">
                            <path d="M24.2231 0.780702C23.854 0.406433 23.2798 0.406433 22.9106 0.780702L8.965 14.5039L2.07423 7.6423C1.70509 7.26803 1.13085 7.30962 0.761706 7.6423C0.392558 8.01657 0.433574 8.59876 0.761706 8.97303L8.02163 16.1257C8.26772 16.3752 8.59586 16.5 8.965 16.5C9.33415 16.5 9.62127 16.3752 9.90838 16.1257L24.2231 2.02826C24.5923 1.73717 24.5923 1.15497 24.2231 0.780702Z" fill="#34C38F" stroke="#34C38F"/>
                          </svg>
                        </span>
                        <span>{description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={clsx(styles.terms)}>
                  <h3>terms</h3>
                  <ul className={clsx(styles.terms_list)}>
                    {terms.map(({ id, description }) => (<li key={`term-${id}`}>{description}</li>))}
                  </ul>
                </div>
              </div>
              <div className={clsx(styles.optional_add_ons)}>
                <h3>Optional Add-Ons</h3>
                <Blur className={clsx(styles.optional_add_ons_table)} isAnimation>
                  <table>
                    <thead>
                      <tr>
                        <th>add-on</th>
                        <th>description</th>
                        <th>rate</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className={clsx(styles.optional_add_ons_table_body)}>
                      {optionalAddOns.map(({ id, name, description, rate }) => (
                        <tr key={`optional-add-on-${id}`}>
                          <td>{name}</td>
                          <td>{description}</td>
                          <td>{rate}</td>
                          <td>
                            <Button isBlueBtn width={100} type="button" onClick={() => handleAddOnClick(id)} className={clsx(selectedAddOns.includes(id) && styles.selected)}>
                              {selectedAddOns.includes(id) ? "cancel" : "include"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Blur>
              </div>
            </div>

            {submitError && (
              <div className={clsx(styles.errorMessage)}>
                <DecryptedText
                  trigger={submitError}
                  text={submitError}
                />
              </div>
            )}

            <Button
              ref={submitBtnRef}
              disabled={isSubmitting}
              type="submit"
              isBlueBtn
              isSecondaryBtn
              className={clsx(styles.isSubmittingBtn)}
            >
              {isSubmitting ? "Sending..." : "Proceed to purchase"}
            </Button>
          </form>
        </>
      )}
    </section>
  );
}
