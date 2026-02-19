import { Github, Linkedin, Twitter, Globe } from "lucide-react";

export const personalInfo = {
  full_name: "Nabaraj Bhandari",
  title: "Full Stack Web Developer",
  description:
    "2nd-year Computer Engineering student at IOE Pulchowk Campus. I build clean, fast, full-stack web applications.",
  resume_url: "/resume.pdf",
  profile_picture: "/profile_pic.jpeg",
  email: "nabarajbhandari2005@gmail.com",
  phone: "+977-9822339211",
  location: "Lalitpur, Nepal",
  github: "https://github.com/nabaraj-bhandari",
  linkedin: "https://linkedin.com/in/nabaraj-bhandari",
  twitter: "https://twitter.com/nabaraj-bhandari",
  website: "https://nabaraj-bhandari.com.np",
};

export const skills = [
  { name: "React / Next.js", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "Tailwind CSS", level: 90 },
  { name: "Node.js", level: 80 },
  { name: "MongoDB", level: 75 },
  { name: "PostgreSQL", level: 70 },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export const socials = [
  { icon: Github, href: personalInfo.github, label: "GitHub" },
  { icon: Linkedin, href: personalInfo.linkedin, label: "LinkedIn" },
  { icon: Twitter, href: personalInfo.twitter, label: "Twitter" },
  { icon: Globe, href: personalInfo.website, label: "Website" },
];
