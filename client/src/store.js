import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const debug = require('debug')('App')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: !!localStorage.getItem('token'),
    email: localStorage.getItem('email'),
    passwordResetEmailSent: false,
    fixedExpenses: {},
    variableExpenses: {}
  },
  mutations: {
    SET_REGISTERED_USER: (state, payload) => {
      localStorage.setItem('token', payload.headers["x-auth-token"])
      localStorage.setItem('email', payload.data.email)
      state.isLoggedIn = true 
      state.email = payload.data.email      
    },
    AUTHENTICATE_USER: (state, payload) => {
      localStorage.setItem('token', payload.headers["x-auth-token"])
      localStorage.setItem('email', payload.data.email)
      state.isLoggedIn = true
      state.email = payload.data.email
    },
    SEND_PASSWORD_RESET_EMAIL: (state, payload) => {
      if (payload.status == 200) {
        state.passwordResetEmailSent = true
        localStorage.setItem('token', payload.headers["x-auth-token"])
        localStorage.setItem('email', payload.data.email)
      }
      else {
        state.passwordResetEmailSent = false
      }
    },
    RESET_EMAIL_PASSWORD: (state, payload) => {
      localStorage.removeItem('token')
      state.isLoggedIn = false
      state.email = ''
    },
    SIGN_OUT: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      state.isLoggedIn = false
      state.email = ''
    },
    SET_BUDGET_DATA: (state, payload) => {
      payload.data.groups.forEach(group => {
        if (group.name == 'Fixed Expenses'){
          state.fixedExpenses = group
        }
        if (group.name == 'Variable Expenses'){
          console.log(group.name)
          state.variableExpenses = group
        }
      })
    },
    SET_NEW_FIXED_EXPENSE: (state, payload) => {
      let fixed = state.fixedExpenses
      fixed.categories.push(payload.data)

      state.fixedExpenses = []
      state.fixedExpenses = fixed
    },
    SET_NEW_VARIABLE_EXPENSE: (state, payload) => {
      let variable = state.variableExpenses
      variable.categories.push(payload.data)

      state.variableExpenses = []
      state.variableExpenses = variable
    },
    SET_NEW_VARIABLE_TRANSACTION: (state, payload) => {
      console.log(payload.data)
      let variable = state.variableExpenses
      let catIndex = variable.categories.findIndex(x => x._id == payload.data.categoryId)
      variable.categories[catIndex].transactions.push(payload.data)
     
      state.variableExpenses = []
      state.variableExpenses = variable
    },
    END_FIXED_EXPENSE: (state, payload) => {
      let holder = state.fixedExpenses
      let updated = holder.categories.filter(cat => cat._id !== payload.data._id)
      holder.categories = updated

      state.fixedExpenses = []
      state.fixedExpenses = holder
    },
    END_VARIABLE_EXPENSE: (state, payload) => {
      console.log('END VAR EXP')
      let holder = state.variableExpenses
      let updated = holder.categories.filter(cat => cat._id !== payload.data._id)
      holder.categories = updated

      state.variableExpenses = []
      state.variableExpenses = holder
    },
    EDIT_FIXED_EXPENSE: (state, payload) => {
      let fixed = state.fixedExpenses
      let catIndex = fixed.categories.findIndex(x => x._id == payload.data._id)
      fixed.categories[catIndex] = payload.data

      state.fixedExpenses = []
      state.fixedExpenses = fixed
    }
  },
  getters: {
    getFixedExpenseTotal: (state) => {
      let total = 0

      state.fixedExpenses.categories.forEach(expense => {
        total += expense.budget
      })

      return total
    },
    getVariableExpenseTotal: (state) => {
      let total = 0

      state.variableExpenses.categories.forEach(category => {
        category.transactions.forEach(transaction => {
          total += transaction.total
        })
      })

      return total
    },
    variableCategoryTotals: (state) => {
      let totals = []

      state.variableExpenses.categories.forEach(category => {
        let total = 0
        category.transactions.forEach(transaction => {
          total += transaction.total
        })
        totals.push({ id: category._id, name: category.name, total, budget: category.budget, percentOfBudget: ((total/category.budget) * 100).toFixed(0) })
      })

      return totals
    }
  },
  actions: {
    authenticateUser: (context, body) => {
      axios.post('http://localhost:3000/api/auth', body)
          .then(response => context.commit('AUTHENTICATE_USER', response))
          .catch(error => { debug(error) })
    },
    registerUser: (context, body) => {
      axios.post('http://localhost:3000/api/users', body)
          .then(response => context.commit('SET_REGISTERED_USER', response))
          .catch(error => { debug(error) })
    },
    sendPasswordResetEmail: (context, body) => {
      axios.post('http://localhost:3000/api/users/passwordresetlink', body)
           .then(response => context.commit('SEND_PASSWORD_RESET_EMAIL', response))
           .catch(error => debug(error))
    },
    resetEmailPassword: (context, body) => {
      axios.post('http://localhost:3000/api/users/passwordreset', body)
           .then(response => context.commit('RESET_EMAIL_PASSWORD', response))
           .catch(error => debug(error))
    },
    getAll: (context, body) => {
      axios({
        url: 'http://localhost:3000/api/groups',
        method: 'get',
        headers: {
          'x-auth-token': body.token
        }
      })
      .then(response => context.commit('SET_BUDGET_DATA', response))
      .catch(error => debug(error))    
    },
    createFixedExpense: (context, body) => {
      
      axios({
        url: 'http://localhost:3000/api/categories',
        method: 'post',
        headers: {
          'x-auth-token': body.token
        },
        data: { name: body.name,  groupId: body.groupId, budget: body.budget}
      })
      .then(response => context.commit('SET_NEW_FIXED_EXPENSE', response))
      .catch(error => debug(error)) 
    },
    createVariableExpense: (context, body) => {
      axios({
        url: 'http://localhost:3000/api/categories',
        method: 'post',
        headers: {
          'x-auth-token': body.token
        },
        data: { name: body.name,  groupId: body.groupId, budget: body.budget}
      })
      .then(response => context.commit('SET_NEW_VARIABLE_EXPENSE', response))
      .catch(error => debug(error)) 
    },
    createVariableTransaction: (context, body) => {
      const url = 'http://localhost:3000/api/transactions/' + body.id

      axios({
        url,
        method: 'post',
        headers: {
          'x-auth-token': body.token
        },
        data: body
      })
      .then(response => context.commit('SET_NEW_VARIABLE_TRANSACTION', response))
      .catch(error => debug(error))  
    },
    endExpense: (context, body) => {
      const url = 'http://localhost:3000/api/categories/end/' + body.id
    
      axios({
        url,
        method: 'put',
        headers: {
          'x-auth-token': body.token
        }
      })
      .then(response => {
        if (body.group == 'fixed') {
          context.commit('END_FIXED_EXPENSE', response)
        } else if (body.group == 'variable'){
          context.commit('END_VARIABLE_EXPENSE', response)
        }
      })
      .catch(error => debug(error)) 
    },
    editFixedExpense: (context, body) => {
      const url = 'http://localhost:3000/api/categories/' + body.id

      axios({
        url,
        method: 'put',
        headers: {
          'x-auth-token': body.token
        },
        data: {
          name: body.name,
          budget: body.budget
        }
      })
      .then(response => context.commit('EDIT_FIXED_EXPENSE', response))
      .catch(error => debug(error))
    }
  }  
})
