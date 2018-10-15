<template>
    <div class="modal fade" id="newFixedExpenseModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Create a Fixed Expense</h5>
                        </div>
                        <div class="modal-body">
                            <div>
                                <p id="body-title"></p>
                                <form>
                                    <div class="form-group">
                                        <span class="error-msg" v-if="!this.nameIsValid">Name must be at least 2 characters long</span>
                                        <input v-model="name"
                                               @blur="validateName" 
                                               type="text" 
                                               class="form-control" 
                                               placeholder="Expense Name"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <span class="error-msg" v-if="!this.budgetIsValid">Budget must be a valid monetary value</span>
                                        <input v-model="budget"
                                               @blur="validateBudget" 
                                               type="number" 
                                               class="form-control" 
                                               placeholder="Monthly Total Cost"
                                        >
                                    </div>      
                                </form>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn save" @click="createExpense" data-dismiss="modal">Save</button>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script>
export default {
  data() {
      return {
          name: '',
          nameIsValid: true,
          budget: null,
          budgetIsValid: true
      }
  },
  props: {
    groupId: String
  },
  methods: {
      createExpense() {
          let isValid = this.validateForm()
          if (!isValid) return

          let floatBudget = parseFloat(this.budget).toFixed(2)

          const expense = {
              name: this.name,
              budget: floatBudget
          }
          console.log(expense)

          this.$emit('newExpenseReady', expense)
      },
      validateName() {
          if (this.name.length < 2) this.nameIsValid = false
          else this.nameIsValid = true
      },
      validateBudget() {
          if (this.budget.length == 0 || Number.isNaN(parseFloat(this.budget)) == true)
            this.budgetIsValid = false
          else
            this.budgetIsValid = true
      },
      validateForm() {
          this.validateName()
          this.validateBudget()

          if (!this.nameIsValid || !this.budgetIsValid)
            return false
          else
            return true
      },
      resetForm() {
          this.budget = ''
          this.name = ''
      }
  }
}
</script>

<style scoped>
    #exampleModalLabel{
        color: #fff;
        margin: 0 auto;
    }

    .modal-header {
        background-color: #242B51;
    }

    .modal-footer .btn.save {
        background-color: #DC1B59;
        color: #fff;
    }

    .error-msg {
        color: rgb(236, 60, 60);
        position: relative;
        top: -5px;
    }
</style>

