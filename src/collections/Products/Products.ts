import {
  AfterChangeHook,
  BeforeChangeHook,
} from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { Access, CollectionConfig } from "payload/types";
import { Product, User } from "../../payload-types";
import { isAdmin } from "../Users";
// import { stripe } from '../../lib/stripe'

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;

  return { ...data, user: user.id };
};

const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser;

    const allIDs = [
      ...(products?.map((product) =>
        typeof product === "object" ? product.id : product
      ) || []),
    ];

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    );

    const dataToUpdate = [...createdProductIDs, doc.id];

    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};

const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined;

    if (!user) return false;
    if (user.role === "admin") return true;

    const userProductIDs = (user.products || []).reduce<Array<string>>(
      (acc, product) => {
        if (!product) return acc;
        if (typeof product === "string") {
          acc.push(product);
        } else {
          acc.push(product.id);
        }

        return acc;
      },
      []
    );

    return {
      id: {
        in: userProductIDs,
      },
    };
  };

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    // read: isAdminOrHasAccess(),
    read: () => true,
    create: isAdmin,
    update: isAdminOrHasAccess(),
    delete: isAdmin,
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      // async (args) => {
      //   if (args.operation === 'create') {
      //     const data = args.data as Product

      //     const createdProduct =
      //       await stripe.products.create({
      //         name: data.name,
      //         default_price_data: {
      //           currency: 'USD',
      //           unit_amount: Math.round(data.price * 100),
      //         },
      //       })

      //     const updated: Product = {
      //       ...data,
      //       stripeId: createdProduct.id,
      //       priceId: createdProduct.default_price as string,
      //     }

      //     return updated
      //   } else if (args.operation === 'update') {
      //     const data = args.data as Product

      //     const updatedProduct =
      //       await stripe.products.update(data.stripeId!, {
      //         name: data.name,
      //         default_price: data.priceId!,
      //       })

      //     const updated: Product = {
      //       ...data,
      //       stripeId: updatedProduct.id,
      //       priceId: updatedProduct.default_price as string,
      //     }

      //     return updated
      //   }
      // },
    ],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "order_number",
      label: "Номер заказа",
      type: "text",
      required: true,

      access: {
        read: () => true,
        create: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
    },
    {
      name: "name",
      // label: "Name",
      label: "Заказчик",
      type: "text",
      required: true,

      access: {
        read: () => true,
        create: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Детали заказа",
      // label: "Product details",
    },
    {
      name: "price",
      label: "Цена",
      min: 0,
      max: 1000,
      type: "number",
      // required: true,

      access: {
        read: () => true,
        create: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
    },
    {
      name: "category",
      label: "Категория",
      type: "select",
      // options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      options: [
        {
          label: "Зеркало",
          value: "mirror",
        },
        {
          label: "Стекло",
          value: "glass",
        },
      
      ],
      required: true,
    },

    // {
    //   name: 'product_files',
    //   label: 'Product file(s)',
    //   type: 'relationship',
    //   required: true,
    //   relationTo: 'product_files',
    //   hasMany: false,
    // },

    {
      name: "approvedForSale",
      label: "Статус заказа",
      defaultValue: "pending",

      access: {
        // read: ({ req }) => req.user.role === 'admin',
        create: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },

      type: "select",
      options: [
        {
          label: "В работе",
          value: "pending",
        },
        {
          label: "Выполнен",
          value: "approved",
        },
        // {
        //   label: "Pending verification",
        //   value: "pending",
        // },
        // {
        //   label: "Approved",
        //   value: "approved",
        // },
        // {
        //   label: "Denied",
        //   value: "denied",
        // },
      ],
    },

    {
      name: "comment",
      label: "Комментарий",
      type: "text",
      // required: true,
    },

    // {
    //   name: 'priceId',
    //   access: {
    //     create: () => false,
    //     read: () => false,
    //     update: () => false,
    //   },
    //   type: 'text',
    //   admin: {
    //     hidden: true,
    //   },
    // },

    // {
    //   name: 'stripeId',
    //   access: {
    //     create: () => false,
    //     read: () => false,
    //     update: () => false,
    //   },
    //   type: 'text',
    //   admin: {
    //     hidden: true,
    //   },
    // },

    {
      name: "images",
      type: "array",
      label: "Изображения заказа",
      minRows: 1,
      maxRows: 4,
      // required: true,
      labels: {
        singular: "Изображение",
        plural: "Изображения",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          // required: true,
        },
      ],
    },

    {
      name: "downloads",
      type: "array",
      label: "Чертежи заказа",
      minRows: 1,
      maxRows: 4,
      // required: true,
      labels: {
        singular: "Чертеж",
        plural: "Чертежи",
      },
      fields: [
        {
          name: "downloads",
          type: "upload",
          relationTo: "downloads",
          // required: true,
        },
      ],
    },
  ],
};
