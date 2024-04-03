import {
  HelpIcon,
  BuildingStoreIcon,
  ShoppingCartIcon,
  TruckDeliveryIcon,
  PackageIcon,
  Map2Icon,
  SteeringWheelIcon,
  LayoutDashboardIcon,
  LogoutIcon,
  MoodHappyIcon,
  UserPlusIcon,
} from "vue-tabler-icons";

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
  expanded?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboardIcon,
    to: "/dashboard",
  },
  {
    title: "Category",
    icon: PackageIcon,
    to: "/category",
  },
  {
    title: "Brands",
    icon: PackageIcon,
    to: "/brands",
  },
  {
    title: "Products",
    icon: PackageIcon,
    to: "/products",
  },
  {
    title: "Stock",
    icon: BuildingStoreIcon,
    to: "/stock",
  },
  {
    title: "Orders",
    icon: ShoppingCartIcon,
    to: "/orders",
  },
  
  
  {
    title: "Reports",
    icon: TruckDeliveryIcon,
    expanded: true,
    children: [
      { title: "Sales Report", to: "/reports/sales" },
      { title: "Customer Report", to: "/reports/customers" },
      {
        title: "Shipments",
        icon: TruckDeliveryIcon,
        to: "/ui/shadow",
      },
    ],
  },
];

// Retrieve data from local storage
const loggerData = localStorage.getItem("logger");

// Parse the logger data into JSON
const logger = loggerData ? JSON.parse(loggerData) : null;

// Additional menu items based on logger.category
if (logger && logger.category === "1") {
  sidebarItem
    .push
    // Additional menu items for the "admin" category...
    (
      {
        title: "Zones",
        icon: Map2Icon,
        to: "/zones",
      },
      {
        title: "Drivers",
        icon: SteeringWheelIcon,
        to: "/drivers",
      },
      {
        title: "Shops",
        icon: MoodHappyIcon,
        to: "/shops",
      },
    );
}
export default sidebarItem;
