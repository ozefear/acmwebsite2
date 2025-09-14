// Fix: Create types.ts to define shared interfaces for the application.
export interface SocialLinks {
    linkedin: string;
    instagram: string;
    twitter?: string;
}

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    social: SocialLinks;
}

export interface Announcement {
    id: number;
    title: string;
    description: string;
    image: string;
}

export interface EventShowcase {
    id: string;
    title: string;
    description: string;
    images: string[];
}

export interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
}

export interface NavLink {
    name: string;
    href: string;
}

export interface Coordinatorship {
    label: string;
    acronym: string;
}

export interface Department {
    label:string;
    value: string;
}

export interface KnowledgeRecord {
  id: number;
  category: string;
  content: string;
  keywords: string[];
}
