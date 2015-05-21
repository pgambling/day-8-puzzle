try {
    require("source-map-support").install();
} catch(err) {
}
require("./out/goog/bootstrap/nodejs.js");
require("./out/puzzle.js");
goog.require("puzzle.core");
goog.require("cljs.nodejscli");
