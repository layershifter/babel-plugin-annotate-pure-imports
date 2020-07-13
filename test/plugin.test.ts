import pluginTester from "babel-plugin-tester";
import * as path from "path";

import babelPlugin from "../src/plugin";

pluginTester({
  fixtures: path.join(__dirname, "__fixtures__"),
  plugin: babelPlugin,
});
