import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";

export const Downloads: CollectionConfig = {
  slug: "downloads",

  // hooks: {
  //   beforeChange: [
  //     ({ req, data }) => {
  //       return { ...data, user: req.user.id }
  //     },
  //   ],
  // },

  // access: {
  //   read: async ({ req }) => {
  //     const referer = req.headers.referer

  //     if (!req.user || !referer?.includes('sell')) {
  //       return true
  //     }

  //     return await isAdminOrHasAccessToImages()({ req })
  //   },
  //   delete: isAdminOrHasAccessToImages(),
  //   update: isAdminOrHasAccessToImages(),
  // },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  upload: {
    staticURL: "/downloads",
    staticDir: "downloads",

    mimeTypes: [
      "image/*",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "font/woff",
      "font/woff2",
      "font/ttf",
    ],
  },

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      // required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
