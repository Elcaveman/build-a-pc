import { CoreMenu } from '@core/types';

export const menu: CoreMenu[] = [
  // Dashboard
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'collapsible',
    icon: 'home',
    role:['Admin'],// To set multiple role: ['Admin', 'Client']
    children: [
      {
        // If role is not assigned will be display to all
        id: 'ecommerce',
        title: 'eCommerce',
        type: 'item',
        icon: 'circle',
        role:['Admin'],
        url: 'dashboard/ecommerce'
      },
      {
        // If role is not assigned will be display to all
        id: 'performance',
        title: 'Performance Tester',
        type: 'item',
        icon: 'circle',
        role:['Client'],
        url: 'dashboard/ecommerce'
      }
    ]
  },
  // Customer Service
  {
        id: 'customer-service',
        title: 'Customer Service',
        type: 'collapsible',
        icon: 'user',
        role:['Admin'],// To set multiple role: ['Admin', 'Client']
        children:[
          {
              id:'analytics',
              title: 'Analytics',
              type: 'item',
              icon: 'circle',
              role:['Admin'],
              url: 'dashboard/analytics'
          },
          {
              id: 'chat',
              title: 'Chat with Customers',
              type: 'item',
              role:['Admin'],
              icon: 'message-square',
              url: 'apps/chat'
          },
          {
              id: 'chatSupp',
              title: 'Chat with Support',
              type: 'item',
              role:['Client'],
              icon: 'message-square',
              url: 'apps/chat'
          },

        ]
        
      },
    {
            id: 'users',
            title: 'User',
            type: 'item',
            icon: 'user',
            role:['Admin'],
            url: 'apps/user/user-list'
          },
          {
            id: 'invoice',
            title: 'Invoice',
            type: 'item',
            role:['Admin'],
            icon: 'file-text',
            url: 'apps/invoice/list'
          },
        {
            id: 'shop',
            title: 'Shop Parts',
            type: 'item',
            role:['Client'],
            icon: 'shopping-bag',
            url: 'apps/e-commerce/shop'
        },
        //     children:[
        //       {
        //         id: 'cpu',
        //         title: 'CPU',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'cpu',
        //         url: 'apps/e-commerce/shop/cpu'
        //       },
        //       {
        //         id: 'cpuCooler',
        //         title: 'CPU Cooler',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'droplet',
        //         url: 'apps/e-commerce/shop/cpucooler'
        //       },
        //       {
        //         id: 'motherboard',
        //         title: 'Motherboard',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'codesandbox',
        //         url: 'apps/e-commerce/shop/motherboard'
        //       },
        //       {
        //         id: 'ram',
        //         title: 'RAM- Memory',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'command',
        //         url: 'apps/e-commerce/shop/ram'
        //       },
        //       {
        //         id: 'storage',
        //         title: 'Disk Storage',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'hard-drive',
        //         url: 'apps/e-commerce/shop/storage'
        //       },
        //       {
        //         id: 'GPU',
        //         title: 'GPU - Video Card',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'crosshair',
        //         url: 'apps/e-commerce/shop/gpu'
        //       },
        //       {
        //         id: 'case',
        //         title: 'Case',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'speaker',
        //         url: 'apps/e-commerce/shop/case'
        //       },
        //       {
        //         id: 'powerSupply',
        //         title: 'Power Supply',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'zap',
        //         url: 'apps/e-commerce/shop/power'
        //       },
        //       {
        //         id: 'sound',
        //         title: 'Sound Card',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'volume-1',
        //         url: 'apps/e-commerce/shop/sound'
        //       },
        //       {
        //         id: 'other',
        //         title: 'Accessories/ Other',
        //         type: 'item',
        //         role:['Client'],
        //         icon: 'headphones',
        //         url: 'apps/e-commerce/shop/other'
        //       },

        //     ]
            
        //   },
        {
            id: 'build',
            title: 'Build your PC',
            type: 'item',
            role:['Client'],
            icon: 'airplay',
            url: 'apps/e-commerce/build'
          },
];
