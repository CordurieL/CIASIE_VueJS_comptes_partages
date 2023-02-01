<!-- @Author Lucas Cordurié - 2023 -->
<!-- Page Not Found, image illustrative et bouton de retour au menu principal -->
<template>
  <div class="col-12">
    <h1 class="text-center">Page introuvable</h1>
    <p class="text-center">Désolé, la page que vous recherchez n'existe pas.</p>
    <router-link
      to="/"
      class="btn btn-primary d-block mx-auto"
      style="max-width: 25rem"
      >Retour au menu principal</router-link
    >
    <img
      src="@/assets/notfound.png"
      alt="404 Not Found"
      class="img-fluid d-block mx-auto"
      title="Illustration par Freepik"
    />
  </div>
</template>

<script>
export default {};
</script>
