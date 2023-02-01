<!-- @Author Lucas Cordurié - 2023 -->
<!-- Page des participants, pour en ajouter de nouveaux, en supprimer et voir le détails de leurs apports et dépenses -->
<template>
  <!-- Le compte existe -->
  <div v-if="this.account != null">
    <!-- Navigation retour à la vue d'ensemble -->
    <div class="row">
      <div class="col-md-1">
        <router-link :to="`/compte/${this.account.id}`">
          <button class="btn btn-secondary btn-circle ml-0 mr-3 mt-3">
            <i class="fas fa-chevron-left"></i>
          </button>
        </router-link>
      </div>

      <!-- Formulaire d'ajout -->
      <div class="col-12 col-md-4 mt-3">
        <h2 class="mb-4">Ajouter un utilisateur</h2>
        <form @submit.prevent="addAttendee">
          <div class="form-group">
            <label for="label">*Nom du participant</label>
            <input
              type="text"
              class="form-control"
              id="label"
              v-model="newAttendeeName"
              required
              maxlength="20"
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary float-right"
            :disabled="!newAttendeeName"
          >
            Créer
          </button>
        </form>
      </div>
      <!-- Écart -->
      <div class="col-md-1"></div>
      <!-- Table détaillée des participants -->
      <div class="table-responsive col-md-6 mt-5">
        <table
          class="table table-striped table-hover table-sm table-bordered"
          style="width: 100%; overflow-x: auto"
        >
          <thead class="thead-light">
            <tr>
              <th>Nom</th>
              <th>Approv.</th>
              <th>Dépensé</th>
              <th>Balance</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="attendeeInfo in this.attendeesInfo"
              :key="attendeeInfo.attendee.id"
            >
              <td>
                {{ attendeeInfo.attendee.name }}
                <small>#{{ attendeeInfo.attendee.id }}</small>
              </td>
              <td>{{ attendeeInfo.totalDeposit.toFixed(2) }}</td>
              <td>{{ attendeeInfo.totalSpend.toFixed(2) }}</td>
              <td
                :class="{
                  'text-success': attendeeInfo.balance > 0,
                  'text-secondary': attendeeInfo.balance === 0,
                  'text-danger': attendeeInfo.balance < 0,
                }"
              >
                {{ attendeeInfo.balance > 0 ? "+" : ""
                }}{{ attendeeInfo.balance.toFixed(2) }}
              </td>
              <td class="text-center">
                <button
                  class="btn btn-danger btn-sm"
                  @click="removeAttendee(attendeeInfo.attendee)"
                  v-if="
                    attendeeInfo.totalSpend == 0 &&
                    attendeeInfo.totalDeposit == 0
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
  name: "BalanceHistory",
  data() {
    return {
      // Compte actuel
      account: null,
      // Liste de tous les comptes en localstorage
      sharedAccounts: null,
      // Liste des participants avec leurs dépenses et leurs apports pour ne les calculer qu'une fois
      attendeesInfo: [],
      // Champ du formulaire
      newAttendeeName: "",
    };
  },
  methods: {
    /**
     * Ajoute un participant au compte actuel et sauvegarde le tout dans le localStorage
     * @returns {void}
     */
    addAttendee() {
      // Ajoute le nouveau participant au localStorage
      let newAttendeeId = Math.floor(1000 + Math.random() * 9000);
      this.sharedAccounts.forEach((account) => {
        if (account.id === this.account.id) {
          account.attendees.push({
            id: newAttendeeId,
            name: this.newAttendeeName,
          });
        }
      });
      localStorage.setItem(
        "sharedAccounts",
        JSON.stringify(this.sharedAccounts)
      );
      // Ajoute le nouveau participant à la page courante
      this.getAttendeeBalance({
        id: newAttendeeId,
        name: this.newAttendeeName,
      });
      this.newAttendeeName = "";
    },
    /**
     * Supprime un participant du compte actuel et sauvegarde le tout dans le localStorage
     * @param {Object} attendeeToRemove - Participant à supprimer
     * @returns {void}
     */
    removeAttendee(attendeeToRemove) {
      // Supprime le participant du localStorage
      this.sharedAccounts.forEach((account) => {
        if (account.id === this.account.id) {
          account.attendees = account.attendees.filter(
            (attendee) =>
              attendee.id !== attendeeToRemove.id ||
              attendee.name !== attendeeToRemove.name
          );
        }
      });
      localStorage.setItem(
        "sharedAccounts",
        JSON.stringify(this.sharedAccounts)
      );
      // Supprime le participant de la page courante
      this.attendeesInfo = this.attendeesInfo.filter(
        (attendeeInfo) =>
          attendeeInfo.attendee.id !== attendeeToRemove.id ||
          attendeeInfo.attendee.name !== attendeeToRemove.name
      );
    },
    /**
     * Retourne le total dépensé par un participant
     * @param {Object} attendee - Participant
     * @returns {Number} Total dépensé par le participant
     */
    getAttendeeTotalSpend(attendee) {
      return this.account.transactions
        .filter(
          (expense) =>
            expense.attendee.name === attendee.name &&
            expense.attendee.id === attendee.id &&
            expense.value < 0
        )
        .reduce((sum, expense) => sum + expense.value, 0);
    },
    /**
     * Retourne le total apporté par un participant
     * @param {Object} attendee - Participant
     * @returns {Number} Total apporté par le participant
     */
    getAttendeeTotalDeposit(attendee) {
      return this.account.transactions
        .filter(
          (deposit) =>
            deposit.attendee.name === attendee.name &&
            deposit.attendee.id === attendee.id &&
            deposit.value > 0
        )
        .reduce((sum, deposit) => sum + deposit.value, 0);
    },
    /**
     * Retourne le solde d'un participant
     * @param {Object} attendee - Participant
     * @returns {void}
     */
    getAttendeeBalance(attendee) {
      let totalDeposit = this.getAttendeeTotalDeposit(attendee);
      let totalSpend = this.getAttendeeTotalSpend(attendee);
      this.attendeesInfo.push({
        attendee: attendee,
        totalDeposit: totalDeposit,
        totalSpend: totalSpend,
        balance: totalDeposit + totalSpend,
      });
    },
  },
  /**
   * Récupère la liste de tous les comptes, le compte actuel et les participants avec leurs dépenses et leurs apports
   * @returns {void}
   */
  created() {
    this.sharedAccounts = JSON.parse(localStorage.getItem("sharedAccounts"));
    const accountId = this.$route.params.id;
    const account = this.sharedAccounts.find(
      (account) => account.id == accountId
    );
    if (account) {
      this.account = account;
      this.account.attendees.forEach((attendee) => {
        this.getAttendeeBalance(attendee);
      });
    }
  },
};
</script>
