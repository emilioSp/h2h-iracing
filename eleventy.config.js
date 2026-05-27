export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ docs: 'images' });
  eleventyConfig.addPassthroughCopy('site/assets');
  eleventyConfig.addWatchTarget('./site/assets/css/style.css');

  return {
    dir: {
      input: 'site',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    pathPrefix: '/h2h-iracing/',
    templateFormats: ['njk', 'html'],
    htmlTemplateEngine: 'njk',
  };
}
