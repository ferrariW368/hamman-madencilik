import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "hamman-madencilik-studio",
  title: "Hamman Madencilik",
  projectId,
  dataset,
  basePath: "/studio",
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
