import { redirect } from "@remix-run/node";
import { RemixAction } from "remix-endpoint";
import { zfd } from "zod-form-data";
import { shitgen } from "~/.server/database/client";

// @todo error handling or something?

export const action = new RemixAction()
  .register({
    method: "POST",
    validate: {
      formData: zfd.formData({
        prompt: zfd.text(),
        palette_id: zfd.numeric(),
      }),
    },
    handler: async ({ formData }) => {
      // create project & v0
      const project = await shitgen.project.create({
        select: ["id"],
        data: formData,
      });
      await shitgen.preview.create({
        data: {
          project_id: project.id,
          version: 0,
          prompt: formData.prompt,
          code: "",
          thumbnail_src: null,
        },
      });
      return redirect(`p/${project.id}`);
    },
  })
  .create();
