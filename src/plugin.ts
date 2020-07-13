import { NodePath, PluginObj } from "@babel/core";
import * as t from "@babel/types";
// @ts-ignore No typings :(
import annotateAsPure from "@babel/helper-annotate-as-pure";

type BabelPluginOptions = { types: typeof t };
type BabelPlugin = (a: BabelPluginOptions) => PluginObj;
type PluginOptions = {
  imports?: Record<string, string[]>;
};

function isMatchingCall(
  path: NodePath<t.CallExpression>,
  imports: NonNullable<PluginOptions["imports"]>
): boolean {
  const callee = path.get("callee");

  if (callee.isIdentifier()) {
    for (const moduleSource in imports) {
      for (const importName of imports[moduleSource]) {
        if (callee.referencesImport(moduleSource, importName)) {
          return true;
        }
      }
    }

    return false;
  }

  return false;
}

const babelPlugin: BabelPlugin = () => {
  return {
    name: "babel-plugin-annotate-pure-imports",

    visitor: {
      CallExpression(expressionPath, { opts = {} }) {
        const { imports } = opts as PluginOptions;

        if (imports && isMatchingCall(expressionPath, imports)) {
          annotateAsPure(expressionPath);
        }
      },
    },
  };
};

export default babelPlugin;
