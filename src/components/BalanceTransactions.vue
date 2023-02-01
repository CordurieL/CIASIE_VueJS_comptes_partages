<!-- @Author Lucas Cordurié - 2023 -->
<!-- Page des transactions, pour créer une nouvelle transaction et voir l'historique -->
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
        <h2 class="mb-4">Ajouter une transaction</h2>
        <form @submit.prevent="addTransaction">
          <div class="form-group">
            <label for="label">*Nom du participant</label>
            <select
              v-model="newTransactionAttendee"
              class="form-control"
              id="label"
              required
            >
              <option value="" disabled>Choisir un participant</option>
              <option
                v-for="attendee in this.account.attendees"
                :key="attendee.id"
                :value="attendee"
              >
                {{ attendee.name }} <small>#{{ attendee.id }}</small>
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="label">Motif</label>
            <input
              type="text"
              class="form-control"
              id="label"
              v-model="newTransactionLibelle"
              maxlength="20"
            />
          </div>
          <p>*Type de transaction :</p>
          <div class="form-group">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="spend"
                value="spend"
                v-model="newTransactionType"
                checked
              />
              <label class="form-check-label" for="spend">Dépense</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="supply"
                value="supply"
                v-model="newTransactionType"
              />
              <label class="form-check-label" for="supply"
                >Approvisionnement</label
              >
            </div>
          </div>
          <div class="form-group">
            <label for="label">*Montant</label>
            <input
              type="number"
              class="form-control"
              id="label"
              v-model="newTransactionValue"
              required
              min="0.01"
              max="999999.99"
              step="0.01"
              @input="fixNumberInput"
              @blur="
                this.newTransactionValue = parseFloat(
                  this.newTransactionValue
                ).toFixed(2)
              "
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary float-right"
            :disabled="!newTransactionAttendee || !newTransactionValue"
          >
            Créer
          </button>
        </form>
      </div>
      <!-- Écart -->
      <div class="col-md-1"></div>
      <!-- Table détaillée des transactions -->
      <div class="table-responsive col-md-6 mt-3">
        <h2 class="mb-4">Historique</h2>
        <table
          class="table table-striped table-hover table-sm table-bordered"
          style="width: 100%; overflow-x: auto"
        >
          <thead class="thead-light">
            <tr>
              <th>Nom</th>
              <th>Motif</th>
              <th>Transaction</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in this.account.transactions"
              :key="transaction.attendee"
            >
              <td>
                {{ transaction.attendee.name }}
                <small>#{{ transaction.attendee.id }}</small>
              </td>
              <td>{{ transaction.libelle }}</td>
              <td
                :class="{
                  'text-success': transaction.value > 0,
                  'text-danger': transaction.value < 0,
                }"
              >
                {{ transaction.value > 0 ? "+" : ""
                }}{{ parseFloat(transaction.value).toFixed(2) }}
              </td>
              <td>{{ transaction.date }}</td>
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
  name: "BalanceTransactions",
  data() {
    return {
      // Compte actuel
      account: null,
      // Liste de tous les comptes en localstorage
      sharedAccounts: null,
      // Champs du formulaire
      newTransactionAttendee: null,
      newTransactionLibelle: "",
      newTransactionValue: null,
      newTransactionType: "spend",
    };
  },
  methods: {
    /**
     * Ajoute une transaction au compte actuel et sauvegarde le tout en localstorage
     * @returns {void}
     */
    addTransaction() {
      const transaction = {
        attendee: this.newTransactionAttendee,
        libelle: this.newTransactionLibelle,
        value:
          this.newTransactionType === "spend"
            ? -this.newTransactionValue
            : +this.newTransactionValue,
        date:
          new Date().toLocaleDateString() +
          " " +
          new Date().toLocaleTimeString(),
      };
      this.account.transactions.unshift(transaction);
      localStorage.setItem(
        "sharedAccounts",
        JSON.stringify(this.sharedAccounts)
      );
      this.newTransactionAttendee = null;
      this.newTransactionLibelle = "";
      this.newTransactionValue = null;
      this.newTransactionType = "spend";
    },
    /**
     * Corrige la valeur du champ montant
     * @returns {void}
     */
    fixNumberInput() {
      let value = parseFloat(this.newTransactionValue);
      if (value > 999999.99) {
        value = 999999.99;
      } else if (value < 0.01) {
        this.newTransactionValue = 0.01;
      }
    },
  },
  /**
   * Récupère la liste de tous les comptes et le compte actuel
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
    }
  },
};
</script>
