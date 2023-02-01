<!-- @Author Lucas Cordurié - 2023 -->
<!-- Page vue d'ensemble d'un compte partagé, permet de voir l'état général et de se rendre sur les autres pages -->
<template>
  <!-- Le compte existe -->
  <div v-if="this.account != null">
    <!-- Navigation vers menu et autres pages -->
    <div
      class="w-75 mx-auto my-3 d-flex justify-content-around align-items-center"
    >
      <router-link :to="`/compte/${this.account.id}/participants`">
        <button class="btn btn-primary mb-2">Gérer les accès</button>
      </router-link>
      <router-link :to="`/`">
        <button class="btn btn-primary mb-2">Retour au menu principal</button>
      </router-link>
      <router-link :to="`/compte/${this.account.id}/historique`">
        <button class="btn btn-primary mb-2">Gérer les transactions</button>
      </router-link>
    </div>

    <!-- Le compte a des participants -->
    <div class="row" v-if="this.account.attendees.length > 0">
      <!-- Tableau des participants -->
      <div class="table-responsive col-md-7 mt-3">
        <table
          class="table table-striped table-hover table-sm table-bordered"
          style="width: 100%; overflow-x: auto"
        >
          <thead class="thead-light">
            <tr>
              <th>Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="attendeeInfo in this.balances"
              :key="attendeeInfo.attendee.id"
            >
              <td>
                {{ attendeeInfo.attendee.name }}
                <small>#{{ attendeeInfo.attendee.id }}</small>
              </td>
              <td
                :class="{
                  'text-success': attendeeInfo.balance > 0,
                  'text-secondary': attendeeInfo.balance === 0,
                  'text-danger': attendeeInfo.balance < 0,
                }"
              >
                {{ attendeeInfo.balance > 0 ? "+" : ""
                }}{{ attendeeInfo.balance.toFixed(2) }}
                {{ this.account.currency }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Écart -->
      <div class="col-md-1"></div>
      <!-- Résumé -->
      <div
        class="col-md-4 d-flex flex-column justify-content-center align-items-center"
      >
        <h3>{{ this.account.label }}</h3>
        <p>
          {{ this.account.description }}
        </p>
        <h3>Total</h3>
        <p>
          {{ this.totalBalance > 0 ? "+" : "-"
          }}{{ this.totalBalance.toFixed(2) }}
          {{ this.account.currency }}
        </p>
      </div>
    </div>
    <!-- Il n'y a aucun participant au compte -->
    <div v-else>
      <div class="container">
        <h3 class="text-center">Aucun participant</h3>
        <p class="text-center">
          Ajoutez des participants à l'aide du bouton "Gérer les accès"
          ci-dessus, puis commencez à ajouter des transactions à l'aide du
          bouton "Gérer les transactions".
        </p>
      </div>
    </div>
  </div>
  <!-- Le compte n'existe pas -->
  <div v-else>
    <div class="container">
      <h3 class="text-center">Compte introuvable</h3>
      <p class="text-center">
        Le compte que vous recherchez n'existe pas ou a été supprimé.
      </p>
      <div class="text-center">
        <router-link to="/">
          <button class="btn btn-primary">Retour à l'accueil</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BalanceSummary",
  data() {
    return {
      // Compte partagé actuel
      account: null,
      // Liste des balances des participants pour ne pas avoir à recalculer à chaque fois
      balances: [],
      // Balance totale du compte
      totalBalance: 0,
    };
  },
  methods: {
    /**
     * Récupère la balance d'un participant en parcourant les transactions du compte
     * @param {Object} attendee Participant
     * @returns {Number} Balance du participant
     */
    getAttendeeBalance(attendee) {
      let balance = this.account.transactions
        .filter(
          (transaction) =>
            transaction.attendee.name === attendee.name &&
            transaction.attendee.id === attendee.id
        )
        .reduce((total, transaction) => total + transaction.value, 0);
      this.balances.push({
        attendee: attendee,
        balance: balance,
      });
      return balance;
    },
  },
  computed: {},
  /**
   * Récupère la liste de tous les comptes, le compte partagé actuel et calcule la balance totale du compte
   * @returns {void}
   */
  created() {
    const sharedAccounts = JSON.parse(localStorage.getItem("sharedAccounts"));
    const accountId = this.$route.params.id;
    const account = sharedAccounts.find((account) => account.id == accountId);
    if (account) {
      this.account = account;
      this.account.attendees.forEach((attendee) => {
        this.totalBalance += this.getAttendeeBalance(attendee);
      });
    }
  },
};
</script>

<style scoped>
@media (max-width: 800px) {
  .d-flex {
    flex-direction: column;
    align-items: center;
  }
}
</style>
