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
}

export const LATEST_VERSIONS: NodeDependency[] = [
  {
    type: NodeDependencyType.Default,
    version: "^5.2.0",
    name: "@foo/bar",
  },
  {
    type: NodeDependencyType.Peer,
    version: "^13.3.6",
    name: "@angular/animations",
  },
  {
    type: NodeDependencyType.Peer,
    version: "^13.3.6",
    name: "@angular/common",
  },
  {
    type: NodeDependencyType.Peer,
    version: "^13.2.7",
    name: "@angular/core",
  },
  {
    type: NodeDependencyType.Peer,
    version: "^13.3.6",
    name: "@angular/forms",
  },
  {
    type: NodeDependencyType.Peer,
    version: "^13.3.6",
    name: "@angular/router",
  },
  {
    type: NodeDependencyType.Peer,
    version: "^13.3.6",
    name: "@angular/platform-browser",
  },
  {
    type: NodeDependencyType.Default,
    version: "^13.3.7",
    name: "@angular/cdk",
  },
  {
    type: NodeDependencyType.Default,
    version: "^14.2.1",
    name: "ngx-toastr",
  },
  {
    type: NodeDependencyType.Default,
    version: "^2.26.0",
    name: "date-fns",
  },
  {
    type: NodeDependencyType.Dev,
    version: "^16.1.1",
    name: "jsdom",
  },
  {
    type: NodeDependencyType.Default,
    version: "^1.0.5",
    name: "file-saver",
  },
  {
    type: NodeDependencyType.Default,
    version: "^13.0.0",
    name: "ngx-filesaver",
  },
];

export default LATEST_VERSIONS;
