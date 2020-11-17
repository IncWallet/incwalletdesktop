import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Wallet',
    icon: 'credit-card-outline',
    link: '/pages/wallet-detail',
    home: true,
  },
  {
    title: 'Account',
    icon: 'person-outline',
    link: '/pages/account',
  },
  {
    title: 'Transactions',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'History',
        link: '/pages/transaction',
        icon: 'file-text-outline',
      },
      {
        title: 'Send',
        icon: 'shuffle-2-outline',
        link: '/pages/send',
      },
      {
        title: 'Receive',
        icon: 'layout-outline',
        link: '/pages/receive',
      },
      {
        title: 'Address book',
        link: '/pages/address-book',
        icon: 'map-outline',
      },
    ],
  },
  {
    title: 'Miner',
    icon: 'hash-outline',
    link: '/pages/miner',
  },
  {
    title: 'Pdex',
    icon: 'hard-drive-outline',
    children: [
      {
        title: 'History',
        link: '/pages/pde-history',
        icon: 'file-text-outline',
      },
    ],
  },
  {
    title: 'Settings',
    icon: 'keypad-outline',
    link: '/pages/setting',
  },
];
