module.exports = function(config) {
  config.set({
    // Add your desired browsers here
    browsers: ['ChromeHeadless', 'FirefoxHeadless', 'Safari'],

    // Other Karma configurations
    singleRun: true, // Ensures that Karma runs once and exits after tests are done
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html' },
        { type: 'lcov' },
        { type: 'text-summary' }
      ]
    },
    // Other configurations...
  });
};
