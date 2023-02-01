// @Author Lucas Cordurié - 2023
// Router permettant de gérer les différentes pages de l'application et les redirections
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/accueil",
  },
  {
    path: "/accueil",
    name: "HomeCreate",
    component: () => import("@/components/HomeCreate.vue"),
    meta: { title: "Accueil" },
  },
  {
    path: "/compte/:id",
    name: "BalanceSummary",
    component: () => import("@/components/BalanceSummary.vue"),
    meta: { title: "Compte - Vue d'ensemble" },
  },
  {
    path: "/compte/:id/historique",
    name: "BalanceTransactions",
    component: () => import("@/components/BalanceTransactions.vue"),
    meta: { title: "Compte - Transactions" },
  },
  {
    path: "/compte/:id/participants",
    name: "BalanceAttendees",
    component: () => import("@/components/BalanceAttendees.vue"),
    meta: { title: "Compte - Participants" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/components/NotFound.vue"),
    meta: { title: "Page Introuvable" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
