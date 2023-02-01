<!-- @Author Lucas Cordurié - 2023 -->
<!-- Page d'accueil permettant de créer un compte et de se rendre sur les comptes déjà créés -->
<template>
  <div class="row">
    <!-- Partie formulaire -->
    <div class="col-12 col-md-6 mb-5">
      <h2 class="mb-4">Créer un compte partagé</h2>
      <form @submit.prevent="createSharedAccount">
        <div class="form-group">
          <label for="label">*Libellé</label>
          <input
            type="text"
            class="form-control"
            id="label"
            v-model="newSharedAccount.label"
            required
            maxlength="20"
          />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            class="form-control"
            id="description"
            v-model="newSharedAccount.description"
            maxlength="50"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="currency">*Monnaie</label>
          <select
            v-model="newSharedAccount.currency"
            class="form-control"
            id="currency"
            required
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <button
          type="submit"
          class="btn btn-primary float-right"
          :disabled="!newSharedAccount.label || !newSharedAccount.currency"
        >
          Créer
        </button>
      </form>
    </div>
    <!-- Partie liste des comptes existants -->
    <div class="col-12 col-md-6" v-if="sharedAccounts.length > 0">
      <h2 class="mb-4">Comptes partagés existants</h2>
      <div>
        <div
          class="card-row"
          v-for="(account, index) in sharedAccounts"
          :key="index"
        >
          <div class="card-body bg-lightgray mb-3 rounded overflow-hidden">
            <a :href="'/compte/' + account.id">
              <h5 class="card-title">{{ account.label }}</h5>
            </a>
            <p class="card-text">{{ account.description }}</p>
            <div class="d-flex justify-content-between">
              <p class="card-text">
                <small class="text-muted"
                  >Créé le {{ account.createdAt }}</small
                >
              </p>
              <p class="card-text">
                <small class="text-muted"
                  >Monnaie: {{ account.currency }}</small
                >
              </p>
              <a
                href="#"
                class="btn btn-danger"
                @click="deleteSharedAccount(index)"
              >
                <i class="fas fa-trash"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeCreate",
  data() {
    return {
      // Liste des comptes partagés, à stocker dans le localStorage comme élément racine
      sharedAccounts: [],
      // Nouveau compte partagé
      newSharedAccount: {
        id: 0,
        label: "",
        description: "",
        currency: "",
        createdAt: "",
        attendees: [],
        transactions: [],
      },
    };
  },

  methods: {
    /**
     * Création d'un nouveau compte partagé
     * @returns {void}
     */
    createSharedAccount() {
      this.newSharedAccount.id = Math.floor(Math.random() * 1000000);
      this.newSharedAccount.createdAt = new Date().toLocaleDateString();
      this.sharedAccounts.push(this.newSharedAccount);
      this.newSharedAccount = {
        id: 0,
        label: "",
        description: "",
        currency: "",
        createdAt: "",
        attendees: [],
        transactions: [],
      };
      this.saveSharedAccounts();
      this.$router.push(
        "/compte/" + this.sharedAccounts[this.sharedAccounts.length - 1].id
      );
    },
    /**
     * Suppression d'un compte partagé
     * @param {number} index - Index du compte partagé à supprimer
     * @returns {void}
     */
    deleteSharedAccount(index) {
      this.sharedAccounts.splice(index, 1);
      this.saveSharedAccounts();
    },
    /**
     * Sauvegarde des comptes partagés dans le localStorage
     * @returns {void}
     */
    saveSharedAccounts() {
      localStorage.setItem(
        "sharedAccounts",
        JSON.stringify(this.sharedAccounts)
      );
    },
  },
  /**
   * Chargement des comptes partagés depuis le localStorage
   */
  mounted() {
    if (localStorage.getItem("sharedAccounts")) {
      try {
        this.sharedAccounts = JSON.parse(
          localStorage.getItem("sharedAccounts")
        );
      } catch (e) {
        localStorage.removeItem("sharedAccounts");
      }
    }
  },
};
</script>

<style scoped>
textarea {
  resize: none;
}

.bg-lightgray {
  background-color: #e8e8e8;
}
</style>
