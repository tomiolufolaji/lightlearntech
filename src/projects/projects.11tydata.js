// Shared settings for every project file in this folder.
export default {
  layout: "layouts/project.njk",
  tags: [],
  permalink: (data) => `/projects/${data.page.fileSlug}/`,
  eleventyComputed: {
    metaTitle: (data) => `${data.title} | Projects | LightLearnTech`,
    metaDescription: (data) => data.description || data.purpose,
  },
};
