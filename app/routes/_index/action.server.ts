import { redirect } from "@remix-run/node";
import { zfd } from "zod-form-data";
import { ResourceBuilder } from "~/lib/ResourceBuilder";
import { ModelProject } from "~/models.server";

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
      // @todo error handling or something?
      const project = await ModelProject.create(formData);
      return redirect(`p/${project.id}`);
    },
  })
  .create();
