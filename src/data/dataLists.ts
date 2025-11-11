import { getD } from "@/utils/getStyleParams";

// Types for real data
export interface RealItem {
  id: number;
  title: string;
  content: string;
}

export interface RealPerson {
  id: number;
  name: string;
  position: string;
  bio: string | null;
  rank: number | null;
  photo: {
    url: string;
    formats?: {
      small?: { url: string };
      medium?: { url: string };
      thumbnail?: { url: string };
    };
  };
}

export interface AboutPageData {
  id: number;
  title: string;
  description: string;
  banner_title: string;
  banner_description: string;
  item: RealItem[];
  members: any[];
  award: any[];
}

const rowIndexes = [2, 2, 1, 1, 0, 0, 0];
const colIndexes = [2, 3, 1, 2, 0, 1, 3];
// Function to transform real items into board format
export const transformItemsToBoards = (items: RealItem[]) => {
  return items.map((item, index) => ({
    id: `b${item.id}`,
    type: "board",
    row: rowIndexes[(index + 7) % 7], // 4 items per row
    col: colIndexes[(index + 7) % 7],
    mainText: `#${item.title}`,
    subText: item.content,
    isActive: true,
  }));
};

// Function to ensure photo URL is properly formatted
export const formatPhotoUrl = (photoUrl: string): string => {
  if (!photoUrl) return "/assets/about/Nikamal.png"; // fallback image
  
  // If it's already a full URL, return as is
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  
  // If it starts with /uploads, it's a relative path, return as is
  if (photoUrl.startsWith('/uploads/')) {
    return photoUrl;
  }
  
  // Otherwise, assume it needs the uploads prefix
  return `/uploads/${photoUrl}`;
};

// Function to transform real persons into person format
export const transformPersonsToData = (persons: RealPerson[]) => {
  return persons.map((person) => ({
    id: `p${person.id}`,
    type: "person",
    name: person.name,
    role: person.position,
    image: formatPhotoUrl(person.photo.url), // Format the photo URL
    description: person.bio || "No bio available",
  }));
};

// Function to create mixed data from real items and persons
export const createMixedDataFromReal = (items: RealItem[], persons: RealPerson[]) => {
  const mixedData: Array<{
    id: string;
    type: string;
    name?: string;
    role?: string;
    image?: string;
    description?: string;
    mainText?: string;
    subText?: string;
    isActive?: boolean;
  }> = [];
  
  // Add some persons first
  const selectedPersons = persons.slice(0, 3); // Take first 3 persons
  selectedPersons.forEach((person) => {
    mixedData.push({
      id: `m_p${person.id}`,
      type: "person",
      name: person.name,
      role: person.position,
      image: formatPhotoUrl(person.photo.url),
      description: person.bio || "No bio available",
    });
  });

  // Add some boards
  const selectedItems = items.slice(0, 2); // Take first 2 items
  selectedItems.forEach((item) => {
    mixedData.push({
      id: `m_b${item.id}`,
      type: "board",
      mainText: `#${item.title}`,
      subText: item.content,
      isActive: false,
    });
  });

  return mixedData;
};

// Function to create all boards from real items
export const createAllBoardsFromReal = (items: RealItem[]) => {
  return items.map((item) => ({
    id: `ba${item.id}`,
    type: "board",
    mainText: `#${item.title}`,
    subText: item.content,
    isActive: true,
  }));
};

// Default data (fallback when no real data is provided)
export const dataLists0 = [
  {
    text: "home",
    link: "/",
  },
  {
    text: "about",
    link: "/about",
  },
  {
    text: "projects",
    link: "/projects",
  },
  {
    text: "services",
    link: "/services",
  },
  {
    text: "we are in media",
    link: "/we-are-in-media",
  },
  {
    text: "our progress",
    link: "/our-progress",
  },
];

export const dataLists1 = [
  {
    text: "services",
    link: "/services",
  },
  {
    text: "about",
    link: "/about",
  },
  {
    text: "team",
    link: "/team",
  },
  {
    text: "e-commerce",
    link: "/e-commerce",
  },
  {
    text: "contact",
    link: "/contact",
  },
];

export const dataLists2 = [
  {
    text: "Terms Of Service",
    link: "/terms-of-service",
  },
  {
    text: "Privacy Policy",
    link: "/privacy-policy",
  },
];

export const dataLists3 = [
  {
    text: "info@platformz.us",
    link: "mailto:info@platformz.us",
  },
  {
    text: "+XX XXXX XXX XXX",
    link: "#",
  },
];

export const dataProjects = [
  {
    id: 1,
    flySpeed: 0.2,
    flyDelay: 0,
    title: "Project 1",
    category: "Category 2",
    preview: "/assets/projects/preview.png",
    image: "/assets/projects/project.svg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    link: "/projects/project-1",
    content: `<img src="/assets/projects/image-content.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>`,
  },
  {
    id: 2,
    flySpeed: 0.2,
    flyDelay: 0.35,
    title: "Project 2",
    category: "Category 2",
    preview: "/assets/projects/preview.png",
    image: "/assets/projects/unsplash_Zw2nRt2z5f0 (1).png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/projects/project-2",
    content: `<img src="/assets/projects/image-content.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>`,
  },
  {
    id: 3,
    flySpeed: 0.2,
    flyDelay: 0.6,
    title: "Project 3",
    category: "Category 2",
    preview: "/assets/projects/preview.png",
    image: "/assets/projects/project.svg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/projects/project-3",
    content: `<img src="/assets/projects/image-content.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>`,
  },
  {
    id: 4,
    flySpeed: 0.2,
    flyDelay: 0.95,
    title: "Project 4",
    category: "Category 2",
    preview: "/assets/projects/preview.png",
    image: "/assets/projects/project.svg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/projects/project-4",
    content: `<img src="/assets/projects/image-content.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>`,
  },
  {
    id: 5,
    flySpeed: 0.2,
    flyDelay: 1.11,
    title: "Project 5",
    category: "Category 2",
    preview: "/assets/projects/preview.png",
    image: "/assets/projects/project.svg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/projects/project-5",
    content: `<img src="/assets/projects/image-content.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>`,
  },
  {
    id: 6,
    flySpeed: 0.2,
    flyDelay: 1.3,
    title: "Project 6",
    category: "Category 2",
    preview: "/assets/projects/preview.png",
    image: "/assets/projects/project.svg",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/projects/project-6",
    content: `<img src="/assets/projects/image-content.png" alt="" />
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Debitis, id impedit. Odit ex dolor laboriosam. 
                  Tempora illum debitis quibusdam, facere deleniti laudantium voluptatem necessitatibus 
                  velit sed voluptate dolore, laborum accusantium?
                </p>`,
  },
];

export const dataOurProgress = [
  {
    id: 0,
    title: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    style: {
      "--left": `${getD(852)}`,
      "--margin-bottom": `${getD(371)}`,
      "--width": `${getD(806)}`,
    },
  },
  {
    id: 1,
    title: "1",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
    style: {
      "--left": `${getD(146)}`,
      "--margin-bottom": `${getD(101)}`,
    },
  },
  {
    id: 2,
    title: "2",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
    style: {
      "--left": `${getD(1359)}`,
      "--margin-bottom": `${getD(267)}`,
    },
  },
  {
    id: 3,
    title: "3",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
    style: {
      "--left": `${getD(467)}`,
      "--margin-bottom": `${getD(569)}`,
    },
  },
  {
    id: 4,
    title: "4",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
    style: {
      "--left": `${getD(1210)}`,
      "--margin-bottom": `${getD(10)}`,
    },
  },
  {
    id: 5,
    title: "5",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
    style: {
      "--left": `${getD(146)}`,
      "--margin-bottom": `${getD(151)}`,
    },
  },
  {
    id: 6,
    title: "6",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
    style: {
      "--left": `${getD(1210)}`,
      "--margin-bottom": `${getD(151)}`,
    },
  },
  {
    id: 7,
    title: "7",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only",
    style: {
      "--left": `${getD(467)}`,
      "--margin-bottom": `${getD(569)}`,
    },
  },
];

export const dataBoards = [
  {
    id: "b1",
    type: "board", // Додаємо тип компонента
    row: 2,
    col: 2,
    mainText: "#innovation",
    subText: "more than the latest tech",
    isActive: true,
  },
  {
    id: "b2",
    type: "board",
    row: 2,
    col: 3,
    mainText: "#ai",
    subText: "artificial intelligence",
    isActive: true,
  },
  {
    id: "b3",
    type: "board",
    row: 1,
    col: 1,
    mainText: "#cloud",
    subText: "cloud solutions",
    isActive: true,
  },
  {
    id: "b4",
    type: "board",
    row: 1,
    col: 2,
    mainText: "#team",
    subText: "collaboration",
    isActive: true,
  },
  {
    id: "b5",
    type: "board",
    row: 0,
    col: 0,
    mainText: "#design",
    subText: "user experience",
    isActive: true,
  },
  {
    id: "b6",
    type: "board",
    row: 0,
    col: 1,
    mainText: "#dev",
    subText: "development",
    isActive: true,
  },
  {
    id: "b7",
    type: "board",
    row: 0,
    col: 3,
    mainText: "#future",
    subText: "next big thing",
    isActive: true,
  },
];

export const dataBoardsAllFirstList = [
  {
    id: "ba1",
    type: "board", // Додаємо тип компонента
    mainText: "#innovation",
    subText: "more than the latest tech",
    isActive: true,
  },
  {
    id: "ba2",
    type: "board",
    mainText: "#ai",
    subText: "artificial intelligence",
    isActive: true,
  },
  {
    id: "ba3",
    type: "board",
    mainText: "#cloud",
    subText: "cloud solutions",
    isActive: true,
  },
  {
    id: "ba4",
    type: "board",
    mainText: "#team",
    subText: "collaboration",
    isActive: true,
  },
  {
    id: "ba5",
    type: "board",
    mainText: "#design",
    subText: "user experience",
    isActive: true,
  },
  {
    id: "ba6",
    type: "board",
    mainText: "#dev",
    subText: "development",
    isActive: true,
  },
  {
    id: "ba7",
    type: "board",
    mainText: "#future",
    subText: "next big thing",
    isActive: true,
  },
];

// Генеруємо додаткові дощечки та об'єднуємо з існуючими
export const generateAdditionalBoards = () => {
  const additionalBoards = [];
  const dataBoardsAllFirstListCount = dataBoardsAllFirstList.length;

  // Створюємо 7 додаткових дощечок
  for (let i = 0; i < dataBoardsAllFirstListCount * 3; i++) {
    additionalBoards.push({
      id: `gen_${i + 1}`,
      type: "board", // Додаємо тип компонента
      mainText: `#generated${i + 1}`,
      subText: `auto generated board ${i + 1}`,
      isActive: false,
    });
  }

  return additionalBoards;
};

// Об'єднуємо існуючі з згенерованими та перемішуємо
export const dataBoardsAll = (() => {
  const additionalBoards = generateAdditionalBoards();
  const allBoards = [...dataBoardsAllFirstList, ...additionalBoards];

  // Перемішуємо масив рандомно (алгоритм Fisher-Yates)
  for (let i = allBoards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allBoards[i], allBoards[j]] = [allBoards[j], allBoards[i]];
  }

  return allBoards;
})();

export const dataServices = [
  {
    id: "s1",
    mainText: "Contract Manufacturing",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service1",
  },
  {
    id: "s2",
    mainText: "Product Design",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service2",
  },
  {
    id: "s3",
    mainText: "Supply Chain Management",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service3",
  },
  {
    id: "s4",
    mainText: "Quality Assurance",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service4",
  },
  {
    id: "s5",
    mainText: "Logistics and Distribution",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service5",
  },
  {
    id: "s6",
    mainText: "After-Sales Support",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service6",
  },
  {
    id: "s7",
    mainText: "Consulting Services",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service7",
  },
  {
    id: "s8",
    mainText: "Custom Solutions",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service8",
  },
  {
    id: "s9",
    mainText: "Sustainability Initiatives",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "/services/service9",
  },
];

export const dataMedias = [
  {
    id: "m1",
    mainText: "name of media 1",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
  {
    id: "m2",
    mainText: "name of media 2",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
  {
    id: "m3",
    mainText: "name of media 3",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
  {
    id: "m4",
    mainText: "name of media 4",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
  {
    id: "m5",
    mainText: "name of media 5",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
  {
    id: "m6",
    mainText: "name of media 6",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
  {
    id: "m7",
    mainText: "name of media 7",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
  {
    id: "m8",
    mainText: "name of media 8",
    subText:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
    link: "#",
  },
];

export const dataPersons = [
  {
    id: "p1",
    type: "person", // Додаємо тип компонента
    name: "John Doe",
    role: "UI/UX Designer",
    image: "/assets/about/Viktor.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "p2",
    type: "person",
    name: "Jane Smith",
    role: "Front-End Developer",
    image: "/assets/about/Viktor.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "p3",
    type: "person",
    name: "Alice Johnson",
    role: "Back-End Developer",
    image: "/assets/about/Nikamal.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "p4",
    type: "person",
    name: "Bob Brown",
    role: "Project Manager",
    image: "/assets/about/Viktor.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
  {
    id: "p5",
    type: "person",
    name: "Charlie Davis",
    role: "Marketing Specialist",
    image: "/assets/about/Nikamal.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  },
];

// Нова змішана група з різними типами компонентів
export const dataMixed = [
  {
    id: "m1",
    type: "person",
    name: "Alex Tech",
    role: "Full-Stack Developer",
    image: "/assets/about/Viktor.png",
    description:
      "Expert in React and Node.js development with 5+ years experience.",
  },
  {
    id: "m2",
    type: "board",
    mainText: "#fullstack",
    subText: "complete solutions",
    isActive: false,
  },
  {
    id: "m3",
    type: "person",
    name: "Maria Design",
    role: "UX/UI Designer",
    image: "/assets/about/Nikamal.png",
    description:
      "Creative designer focused on user-centered design principles.",
  },
  {
    id: "m4",
    type: "board",
    mainText: "#design",
    subText: "user experience",
    isActive: false,
  },
  {
    id: "m5",
    type: "board",
    mainText: "#innovation",
    subText: "cutting edge",
    isActive: false,
  },
];

export const dataPersonsAndBoards = [
  {
    id: "pb1",
    name: "John Doe",
    role: "UI/UX Designer",
    image: "/assets/about/Viktor.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has",
  },
  {
    id: "pb2",
    name: "Jane Smith",
    role: "Front-End Developer",
    image: "/assets/about/Viktor.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has",
  },
  {
    id: "pbe1",
    mainText: "emprty",
    subText: "emprty",
    isActive: false,
  },
  {
    id: "pbe2",
    mainText: "emprty",
    subText: "emprty",
    isActive: false,
  },
  {
    id: "pb3",
    name: "Alice Johnson",
    role: "Back-End Developer",
    image: "/assets/about/Nikamal.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has",
  },
  {
    id: "pb4",
    name: "Bob Brown",
    role: "Project Manager",
    image: "/assets/about/Viktor.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has",
  },
  {
    id: "pbe3",
    mainText: "emprty",
    subText: "emprty",
    isActive: false,
  },
  {
    id: "pbe4",
    mainText: "emprty",
    subText: "emprty",
    isActive: false,
  },
  {
    id: "pb5",
    name: "Charlie Davis",
    role: "Marketing Specialist",
    image: "/assets/about/Nikamal.png",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has",
  },
  {
    id: "pbe5",
    mainText: "emprty",
    subText: "emprty",
    isActive: false,
  },
  {
    id: "pbe6",
    mainText: "emprty",
    subText: "emprty",
    isActive: false,
  },
  {
    id: "pbe7",
    mainText: "emprty",
    subText: "emprty",
    isActive: false,
  },
];

export const dataAwards = [
  {
    id: "b0",
    type: "board", // Додаємо тип компонента
    row: 1,
    col: 0,
    mainText: "#name 0",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b1",
    type: "board", // Додаємо тип компонента
    row: 1,
    col: 1,
    mainText: "#name 1",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b2",
    type: "board",
    row: 1,
    col: 2,
    mainText: "#name 2",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b3",
    type: "board",
    row: 1,
    col: 3,
    mainText: "#name 3",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b4",
    type: "board",
    row: 1,
    col: 4,
    mainText: "#name 4",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b5",
    type: "board",
    row: 1,
    col: 5,
    mainText: "#name 5",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b6",
    type: "board",
    row: 2,
    col: 0,
    mainText: "#name 6",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b7",
    type: "board",
    row: 2,
    col: 1,
    mainText: "#name 7",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b8",
    type: "board",
    row: 2,
    col: 2,
    mainText: "#name 8",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b9",
    type: "board",
    row: 2,
    col: 3,
    mainText: "#name 9",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b10",
    type: "board",
    row: 2,
    col: 4,
    mainText: "#name 10",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
  {
    id: "b11",
    type: "board",
    row: 2,
    col: 5,
    mainText: "#name 11",
    subText: "lorem khwfniw wr ,wrug wurg nwewrueg.",
    isActive: true,
  },
];
