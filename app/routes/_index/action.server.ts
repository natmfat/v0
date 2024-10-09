import { redirect } from "@remix-run/node";
import { zfd } from "zod-form-data";
import { ModelPreview, ModelProject } from "~/.server/models";
import { ResourceBuilder } from "~/lib/ResourceBuilder";

// @todo error handling or something?

export const action = new ResourceBuilder()
  .register({
    method: "POST",
    validate: {
      formData: zfd.formData({
        prompt: zfd.text(),
        palette_id: zfd.numeric(),
      }),
    },
    handler: async ({ formData }) => {
      const project = await ModelProject.create(formData);
      await ModelPreview.create({
        project_id: project.id,
        version: 0,
        prompt: formData.prompt,
        code: "",
      });
      return redirect(`p/${project.id}`);
    },
  })
  .create();
