<template>
    <div class="modal fade" id="newVarTranModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Create a Transaction for <span class="category-name">{{ categoryName }}</span>:</h5>
                        </div>
                        <div class="modal-body">
                            <div>
                                <p id="body-title"></p>
                                <form>
                                    <div class="form-group">
                                        <span class="error-msg" v-if="!this.typeIsValid">Type must be at least 2 characters long</span>
                                        <input v-model="type"
                                               @blur="validateType" 
                                               type="text" 
                                               class="form-control" 
                                               placeholder="Transaction type: i.e. Debit"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <span class="error-msg" v-if="!this.totalIsValid">Total must be a valid monetary value</span>
                                        <input v-model="total"
                                               @blur="validateTotal" 
                                               type="text" 
                                               class="form-control" 
                                               placeholder="Total spent"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <span class="error-msg" v-if="!this.dateIsValid">A date must be selected</span>
                                        <date-picker
                                            :bootstrap-styling="true"
                                            v-model="date"
                                            @blur="validateDate"
                                            :placeholder="'Date of transaction'"
                                        >
                                        </date-picker>
                                    </div>  
                                    <div class="form-group">
                                        <textarea v-model="note"
                                               type="text" 
                                               class="form-control" 
                                               placeholder="Note"
                                        >
                                        </textarea>
                                    </div>    
                                </form>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn save" @click="createVarTran" data-dismiss="modal">Save</button>
                        </div>
                    </div>
                </div>
            </div>
</template>

<script>
import DatePicker from 'vuejs-datepicker';

export default {
  data() {
      return {
          type: '',
          total: '',
          date: '',
          note: '',
          typeIsValid: true,
          dateIsValid: true,
          totalIsValid: true
      }
  },
  components: {
      DatePicker
  },
  props: {
    categoryName: String
  },
  methods: {
      createVarTran() {
          let isValid = this.validateForm()
          if (!isValid) return

          let floatTotal = parseFloat(this.total).toFixed(2)
          let formattedDate = new Date(this.date).toISOString()

          const expense = {
              type: this.type,
              total: floatTotal,
              note: this.note,
              date: formattedDate
          }
          console.log(expense)

          this.resetForm()

          this.$emit('newVarTranReady', expense)
      },
      validateType() {
         (this.type.length < 2) ? this.typeIsValid = false : this.typeIsValid = true
      },
      validateDate() {
        (this.date.length < 4) ? this.dateIsValid = false: this.dateIsValid = true  
      },
      validateTotal() {
        (this.total.length < 1 || Number.isNaN(parseFloat(this.total))) 
            ? this.totalIsValid = false 
            : this.totalIsValid = true
      },
      validateForm() {
          this.validateType()
          this.validateDate()
          this.validateTotal()

          if (!this.typeIsValid || !this.totalIsValid || !this.dateIsValid)
            return false
          else
            return true
      },
      resetForm() {
          this.type = ''
          this.total = ''
          this.date = ''
          this.note = ''
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

    .vdp-datepicker {
        color: #333;
    }

    .vdp-datepicker div > input {
        width: 20em;
    }

    .input-group>.custom-file, .input-group>.custom-select, .input-group>.form-control  {
        background-color: #fff !important;
    }

    .category-name {
        color: #DC1B59;
    }
</style>

