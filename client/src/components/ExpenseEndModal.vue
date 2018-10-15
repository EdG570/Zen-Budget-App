<template>
    <div class="modal fade" id="expenseEndModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to end {{ expenseName }}?</h5>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn save" @click="endExpense" data-dismiss="modal">Save</button>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script>
export default {
  data() {
      return {
          
      }
  },
  props: {
    expenseName: String,
    expenseId: String
  },
  methods: {
      endExpense() {
          this.$emit('endExpense', { name: this.expenseName, id: this.expenseId })
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

