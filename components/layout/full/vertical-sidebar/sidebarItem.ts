import {
    HelpIcon,BuildingStoreIcon,ShoppingCartIcon,TruckDeliveryIcon,PackageIcon,Map2Icon,SteeringWheelIcon,
    LayoutDashboardIcon, LogoutIcon, MoodHappyIcon, UserPlusIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'Home' },
    {
        title: 'Dashboard',
        icon: LayoutDashboardIcon,
        to: '/dashboard'
    },
    {
        title: 'Category',
        icon: PackageIcon,
        to: '/category'
    },
    {
        title: 'Products',
        icon: PackageIcon,
        to: '/products'
    },
    {
        title: 'Stock',
        icon: BuildingStoreIcon,
        to: '/stock'
    },
    {
        title: 'Zones',
        icon: Map2Icon,
        to: '/zones'
    },
    {
        title: 'Orders',
        icon: ShoppingCartIcon,
        to: '/orders'
    },
    {
        title: 'Drivers',
        icon: SteeringWheelIcon,
        to: '/drivers'
    },
    {
        title: 'Shipments',
        icon: TruckDeliveryIcon,
        to: '/ui/shadow'
    },
   
    { header: 'Support' },
    {
        title: 'Help',
        icon: HelpIcon,
        to: '/icons'
    },
    {
        title: 'Logout',
        icon: LogoutIcon,
        to: '/sample-page'
    },
];

export default sidebarItem;
