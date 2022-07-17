import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";

enum NodeDependencyType {
  Default = "dependencies",
  Dev = "devDependencies",
  Peer = "peerDependencies",
  Optional = "optionalDependencies",
}

interface NodeDependency {
  type: NodeDependencyType;
  name: string;
  version: string;
  overwrite?: boolean;
}

const FILE = "./src/latest-version.ts";

let nodeDependencies: Partial<NodeDependency>[] = [];

const configFileName = ts.findConfigFile(
  "./",
  ts.sys.fileExists,
  "tsconfig.json"
);
if (!configFileName) {
  throw new Error("Could not find a valid 'tsconfig.json' file.");
}
const confiFile = ts.readConfigFile(configFileName, ts.sys.readFile);
let tsConfig = ts.parseJsonConfigFileContent(confiFile, ts.sys, __dirname);

console.info("tsConfig read successfully");

let program = ts.createProgram([FILE], {});
const sourceFile = program.getSourceFile(FILE);
const rootNode = sourceFile?.getFirstToken();

switch (rootNode?.kind) {
  case ts.SyntaxKind.VariableDeclaration:
    console.log("its a variable");
    break;
  default:
    console.log("Not a variable");
    break;
}
console.info("ok");
