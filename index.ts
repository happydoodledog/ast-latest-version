import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { exit } from "process";

console.log(">>> STARTING");

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

export interface TransformerOptions {}

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

console.info(">>> tsConfig read successfully");
// console.log(tsConfig.raw.config.compilerOptions);

let program = ts.createProgram([FILE], tsConfig.options);
const sourceFile = program.getSourceFile(FILE);

const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
  return (sourceFile) => {
    const visitor = (node: ts.Node): ts.Node => {
      // find the variable declaration
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === "LATEST_VERSIONS" &&
        node.initializer &&
        ts.isArrayLiteralExpression(node.initializer)
        // TODO: check that the type is correct
      ) {
        //console.log(node.initializer.elements);
        node.forEachChild((child) => {
          // find the array statement
          if (child.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            child.forEachChild((child) => {
              if (ts.isObjectLiteralExpression(child)) {
                const nodeDep: any = {};
                child.properties.forEach((property) => {
                  if (
                    (ts.isPropertyAssignment(property),
                    ts.isIdentifier(property.name!))
                  ) {
                    property.forEachChild((propertyChild) => {
                      if (
                        ts.isStringLiteral(propertyChild) &&
                        ts.isIdentifier(property.name!)
                      ) {
                        if (property.name.text === "version") {
                          // only for debugging
                          nodeDep.version = "1.0.0";
                        } else {
                          // TODO: set the correct value
                          // property.name.text = "1.0.0";
                          if (ts.isPropertyAssignment(property)) {
                            const a = ts.factory.updatePropertyAssignment(
                              property,
                              property.name,
                              ts.factory.createStringLiteral("1.0.0")
                            );
                            console.log(a);
                            return a;
                          }
                          nodeDep[property.name.text] = propertyChild.text;
                        }
                      }
                    });
                  }
                });
                if (Object.keys(nodeDep).length > 0) {
                  nodeDependencies.push(nodeDep);
                }
              }
            });
          }
        });
      }
      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor);
  };
};

if (!sourceFile) {
  exit(1);
}

const result = ts.transform(sourceFile, [transformer]);

const printer = ts.createPrinter();
console.log(printer.printFile(result.transformed[0]));

console.log(">>> nodeDeps", nodeDependencies);

console.info(">>> FINISHED");
