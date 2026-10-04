import type { MetadataRoute } from "next";

import { projects } from "@/data/projects";
import { SITE_URL } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.7 },
  ];

  const caseStudies: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/work/${project.slug}`,
    lastModified,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...caseStudies];
}
