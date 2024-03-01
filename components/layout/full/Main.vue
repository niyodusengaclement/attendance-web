<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import sidebarItems, { menu } from '@/components/layout/full/vertical-sidebar/sidebarItem';
import { Menu2Icon, ChevronRightIcon } from 'vue-tabler-icons';
const sidebarMenu = shallowRef(sidebarItems);
const sidebarMenuAdmin = shallowRef(sidebarItems);
const sDrawer = ref(true);
let selectedMenu = ref('Dashboard')
let selectedSubMenu = ref('Faculity')
const openSubmenu = ref(false)

if (process.client) {
    let activeTab = localStorage.getItem("sidebar-active");
    let activeSubTab = localStorage.getItem("sidebar-sub-active");
    selectedMenu.value = activeTab;
    selectedSubMenu.value = activeSubTab;
    console.log(selectedMenu)
}

function activeLink(item: menu) {
    selectedMenu.value = item.title
    openSubmenu.value = item.expanded ? !openSubmenu.value : openSubmenu.value

    localStorage.setItem("sidebar-active", item.title);
}

function activeSubLink(title: any) {
    selectedSubMenu.value = title
    localStorage.setItem("sidebar-sub-active", title);
}
</script>

<template>
    <!------Sidebar-------->
    <v-navigation-drawer left elevation="0" app class="leftSidebar bg-primary" v-model="sDrawer">
        <!---Logo part -->
        <div class="pa-5">
            <LayoutFullLogo />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div>
            <perfect-scrollbar class="scrollnavbar  bg-primary">
                <ul v-auto-animate class="pt-2 m-1">
                    <li v-for="(item, i) in sidebarMenu" :key="i" @click="activeLink(item)"
                        v-bind:class="item.title == selectedMenu && !item.expanded ? 'bg-green-400/10 hover:bg-green-400/20  ' : 'hover:bg-gray-400/20'"
                        class="flex-col items-center text-sm cursor-pointer py-3  
                 rounded-md mt-2  px-3 duration-300 ">

                        <nuxt-link :to="!item.header && item.children == null ? `${item.to}` : '#'"
                            :class="sDrawer ? ' ' : 'justify-center'" class="flex items-center  gap-x-4 ">
                            <component :is="item.icon" class="h-6 w-6 duration-200 block float-left cursor-pointer"
                                :class="item.title == selectedMenu ? 'text-green-500' : ''" />
                            <div class="flex-1 truncate duration-300 " :class="!sDrawer ? hidden : ``"
                                v-bind:class="item.title == selectedMenu ? 'text-green-500 font-medium' : 'font-medium'">{{
                                    item.title
                                }}
                            </div>
                            <div class="flex" :class="!sDrawer ? hidden : ``">
                                <ChevronRightIcon @click="openSubmenu = !openSubmenu" v-if="item.expanded"
                                    class="duration-400 h-5 w-5"
                                    v-bind:class="item.title == selectedMenu ? 'text-green-600' : ''"
                                    :class="openSubmenu ? 'rotate-90' : ''" />
                                <div v-if="item.title == selectedMenu && sDrawer && !item.expanded"
                                    class="flex bg-green-500 duration-300  h-5 rounded-xl w-1"></div>
                            </div>

                        </nuxt-link>

                        <ul v-if="item.expanded && openSubmenu && sDrawer" class="dropdown">
                            <li v-for="(sub, i) in item.children" :key="i"
                                class="flex group justify-between duration-300    items-center text-sm gap-x-4 cursor-pointer py-3 hover:bg-gray-400/10 rounded-md mt-3">
                                <nuxt-link :to="sub.to"
                                    :class="sDrawer ? ' ' : 'justify-center'" class="flex items-center  gap-x-4 ">
                                    <span class="pl-4 duration-200">&#x2022; {{ sub.title }}</span>
                                    <div class="group-hover:bg-green-500 p-1 rounded-full duration-300 mx-4 "></div>
                                </nuxt-link>
                            </li>

                        </ul>
                    </li>
                </ul>
                <div class="pa-4">
                    <!-- <LayoutFullVerticalSidebarExtraBox/> -->
                </div>
            </perfect-scrollbar>
        </div>

    </v-navigation-drawer>
    <!------Header-------->
    <v-app-bar elevation="0" height="70">
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <v-btn class="hidden-lg-and-up ms-md-3 ms-sm-5 ms-3 text-muted" @click="sDrawer = !sDrawer" icon
                    variant="flat" size="small">
                    <Menu2Icon size="20" stroke-width="1.5" />
                </v-btn>
                <!-- Notification -->

            </div>
            <div>
                <!-- Upgrade button -->
                <LayoutFullVerticalHeaderNotificationDD class="mx-3" />
                <!-- User Profile -->
                <LayoutFullVerticalHeaderProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>
