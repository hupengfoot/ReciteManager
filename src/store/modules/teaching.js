
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    
    teachingTab: 'resultsCenter'
  },

  mutations: {
    SET_TEACHINGTAB: (state, teachingTab) => {
      state.teachingTab = teachingTab
    }
  },

  actions: {
    // 登录
    teachingTab({ commit }, teachingTab) {
      commit('SET_TEACHINGTAB', teachingTab)
    },


    
  }
}

export default user
