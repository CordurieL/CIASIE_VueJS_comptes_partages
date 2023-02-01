<!-- @Author Lucas Cordurié - 2023 -->
<!-- Barre de navigation commune aux pages du site, composant parent -->
<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-sm mb-3 p-0">
    <div class="d-flex flex-row justify-content-between align-items-center">
      <a class="navbar-brand p-3" href="/"
        ><h2 class="h2 m-0">Gestion des dépenses</h2></a
      >
      <h1 class="text-muted h3 m-0 d-none d-sm-block">{{ pageTitle }}</h1>
    </div>
  </nav>
  <div class="container my-1 mx-auto">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  computed: {
    /**
     * Retourne le titre de la page courante
     * @returns {string} Titre de la page courante
     */
    pageTitle() {
      return this.$route.meta.title || "Gestion des dépenses";
    },
  },
};
</script>

<style>
a,
a:active {
  color: #000000; /* sets the text color */
  text-decoration: none; /* removes the underline */
  font-weight: normal; /* makes the text normal */
  transition: color 0.1s ease-in-out; /* adds a smooth transition when hovering */
}

a:hover {
  color: #155e96; /* changes the text color on hover */
}

.btn-circle {
  width: 50px;
  height: 50px;
  padding: 8px 8px;
  border-radius: 25px;
  text-align: center;
  font-size: 18px;
  line-height: 1.38;
}
</style>
