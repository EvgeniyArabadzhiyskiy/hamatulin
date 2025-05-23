// import { PrimaryActionEmailHtml } from '../components/emails/PrimaryActionEmail'
import { User } from '@/payload-types';
import { Access, CollectionConfig } from 'payload/types'

export const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === 'admin') return true

  return {
    id: {
      equals: user.id,
    },
  }
}

export const isAdmin: Access<any, User> = ({ req: { user } }) => {
  const isAdmin = user?.role === "admin";
  return isAdmin;
};

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // verify: {
    //   generateEmailHTML: ({ token }) => {
    //     return PrimaryActionEmailHtml({
    //       actionLabel: "verify your account",
    //       buttonText: "Verify Account",
    //       href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`
    //     })
    //   },
    // },
  },

  // access: {
  //   read: adminsAndUser,
  //   create: () => true,
  //   update: isAdmin,
  //   delete: isAdmin,
  // },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === 'admin',
    delete: ({ req }) => req.user.role === 'admin',
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => user.role !== 'admin',
    defaultColumns: ['id'],
  },
  fields: [
    {
      name: 'products',
      label: 'Products',
      admin: {
        condition: () => false,
      },
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },

    // {
    //   name: 'product_files',
    //   label: 'Product files',
    //   admin: {
    //     condition: () => false,
    //   },
    //   type: 'relationship',
    //   relationTo: 'product_files',
    //   hasMany: true,
    // },

    {
      name: 'role',
      defaultValue: 'user',
      required: true,

      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
}
