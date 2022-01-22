import { promisify } from "util";
import { pipeline } from "stream";

const pipelineAsync = promisify(pipeline);

export {
  pipelineAsync,
};