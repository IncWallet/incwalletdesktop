import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Account',
    icon: 'shopping-cart-outline',
    link: '/pages/account',
    home: true,
  },
  {
    title: 'Send',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: 'Process',
        link: '/pages/send',
        icon: 'shuffle-2-outline',
      },
      {
        title: 'Address book',
        link: '/pages/address-book',
        icon: 'map-outline',
      },
    ],
  },
  {
    title: 'Receive',
    icon: 'layout-outline',
    link: '/pages/receive',
  },
  {
    title: 'Transactions',
    icon: 'edit-2-outline',
    link: '/pages/transaction',
  },
  {
    title: 'Settings',
    icon: 'keypad-outline',
    link: '/pages/setting',
  },
];
