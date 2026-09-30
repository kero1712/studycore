// react-pdf: pdf.js يحاول تحميل canvas في Node، نعطّله (يعمل في المتصفح فقط)
module.exports = { webpack: (config) => { config.resolve.alias.canvas = false; return config; } };
