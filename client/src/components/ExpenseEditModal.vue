<template>
    <div class="modal fade" id="expenseEditModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Edit Fixed Expense</h5>
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
                            <button type="button" class="btn save" @click="editExpense" data-dismiss="modal">Save</button>
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
         budget: 0,
         nameIsValid: true,
         budgetIsValid: true
      }
  },
  props: {
    expenseName: String,
    expenseBudget: Number,
    expenseId: String
  },
  methods: {
      editExpense() {
          let isValid = this.validateForm()
          if (!isValid) return

          let floatBudget = parseFloat(this.budget).toFixed(2)

          const expense = {
              name: this.name,
              budget: floatBudget,
              id: this.expenseId
          }

          this.$emit('editExpenseReady', expense)
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
  },
  watch: {
      expenseName(newName, oldName) {
          this.name = newName
      },
      expenseBudget(newBudget, oldBudget) {
          this.budget = newBudget
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

