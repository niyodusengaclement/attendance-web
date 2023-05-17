import {
    ApertureIcon,BuildingStoreIcon,ShoppingCartIcon,TruckDeliveryIcon,ChecklistIcon,Map2Icon,SteeringWheelIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, UserPlusIcon
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
        title: 'Product category',
        icon: ChecklistIcon,
        to: '/category'
    },
    {
        title: 'Products',
        icon: ChecklistIcon,
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
   
    { header: 'Settings' },
    {
        title: 'Profile',
        icon: MoodHappyIcon,
        to: '/icons'
    },
    {
        title: 'Permissions',
        icon: ApertureIcon,
        to: '/sample-page'
    },
];

export default sidebarItem;
