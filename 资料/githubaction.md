
> stocktokenhub@0.0.0 build
> docusaurus build

[INFO] [en] Creating an optimized production build...
[info] [webpackbar] Compiling Client
[info] [webpackbar] Compiling Server
[success] [webpackbar] Server: Compiled successfully in 31.48s
[success] [webpackbar] Client: Compiled successfully in 43.41s

Error:  Error: Unable to build website for locale en.
    at tryToBuildLocale (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/build.js:78:15)
    at async /home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/build.js:34:9
    ... 4 lines matching cause stack trace ...
    at async file:///home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/bin/docusaurus.mjs:44:3 {
  [cause]: Error: Docusaurus found broken links!
  
  Please check the pages of your site in the list below, and make sure you don't reference any path that does not exist.
  Note: it's possible to ignore broken links with the 'onBrokenLinks' Docusaurus configuration, and let the build pass.
  
  Exhaustive list of all broken links found:
  - Broken link on source page path = /blog/where-to-buy-tokenized-stocks:
     -> linking to /faq
  
      at throwError (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/logger/lib/logger.js:80:11)
      at reportBrokenLinks (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/server/brokenLinks.js:250:47)
      at handleBrokenLinks (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/server/brokenLinks.js:282:5)
      at executeBrokenLinksCheck (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/buildLocale.js:118:47)
      at /home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/buildLocale.js:93:67
      at Object.async (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/logger/lib/perfLogger.js:42:47)
      at buildLocale (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/buildLocale.js:93:31)
      at async runBuildLocaleTask (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/build.js:93:5)
      at async /home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/build.js:74:13
      at async tryToBuildLocale (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/build.js:70:9)
      at async /home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/build.js:34:9
      at async mapAsyncSequential (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/utils/lib/jsUtils.js:21:24)
      at async Command.build (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/build/build.js:33:5)
      at async Promise.all (index 0)
      at async runCLI (/home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/lib/commands/cli.js:56:5)
      at async file:///home/runner/work/stocktokenhub/stocktokenhub/node_modules/@docusaurus/core/bin/docusaurus.mjs:44:3
}
[INFO] Docusaurus version: 3.8.1
Node version: v18.20.8
Error: Process completed with exit code 1.
