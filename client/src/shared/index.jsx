// shared/index.js
// Top-level barrel — lets consumers write:
//   import { getTime, BASE_URL, IcoSend } from "../shared"
// For finer-grained imports (better tree-shaking) go direct:
//   import { getTime } from "../shared/utils/formatters"

export * from "./constants";
export * from "./utils";
export * from "./services";
export * from "./components";
export * from "./styles";