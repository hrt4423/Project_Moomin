// サンプルアプリケーション用のダミー認証モジュール
var Auth = {
    login: function (email, pass, cb) {
      // ダミーデータを使った擬似ログイン
      setTimeout(function () {
        if (email === 'vue@example.com' && pass === 'vue') {
          // ログイン成功時はローカルストレージにtokenを保存する
          localStorage.token = Math.random().toString(36).substring(7)
          if (cb) { cb(true) }
        } else {
          if (cb) { cb(false) }
        }
      }, 0)
    },
  
    logout: function () {
      delete localStorage.token
    },
  
    loggedIn: function () {
      // ローカルストレージにtokenがあればログイン状態とみなす
      return !!localStorage.token
    }
  }
  
  // ダミーデータの定義。本来はデータベースの情報をAPI経由で取得する
  var userData = [
    {
      id: 1,
      name: 'Takuya Tejima',
      description: '東南アジアで働くエンジニアです。'
    },
    {
      id: 2,
      name: 'Yohei Noda',
      description: 'アウトドア・フットサルが趣味のエンジニアです。'
    }
  ]
  
  // 擬似的にAPI経由で情報を取得したようにする
  var getUsers = function (callback) {
    setTimeout(function () {
      callback(null, userData)
    }, 1000)
  }
  
  var getUser = function (userId, callback) {
    setTimeout(function () {
      var filteredUsers = userData.filter(function (user) {
        return user.id === parseInt(userId, 10)
      })
      callback(null, filteredUsers && filteredUsers[0])
    }, 1000)
  }
  
  // 擬似的にAPI経由で情報を更新したようにする
  // 実際のWebアプリケーションではServerへPOSTリクエストを行う
  var postUser = function (params, callback) {
    setTimeout(function () {
      // idは追加されるごとに自動的にincrementされていく
      params.id = userData.length + 1
      userData.push(params)
      callback(null, params)
    }, 1000)
  }
  
  // ログインコンポーネント
  var Login = {
    template: '#login',
    data: function () {
      return {
        email: 'vue@example.com',
        pass: '',
        error: false
      }
    },
    methods: {
      login: function () {
        Auth.login(this.email, this.pass, (function (loggedIn) {
          if (!loggedIn) {
            this.error = true
          } else {
            // redirectパラメーターが付いている場合はそのパスに遷移
            this.$router.replace(this.$route.query.redirect || '/')
          }
        }).bind(this))
      }
    }
  }
  
  // ユーザーリストコンポーネント
  var UserList = {
    template: '#user-list',
    data: function () {
      return {
        loading: false,
        users: function () {
          return []
        },
        error: null
      }
    },
  
    created: function () {
      this.fetchData()
    },
  
    watch: {
      '$route': 'fetchData'
    },
  
    methods: {
      fetchData: function () {
        this.loading = true
        getUsers((function (err, users) {
          this.loading = false
          if (err) {
            this.error = err.toString()
          } else {
            this.users = users
          }
        }).bind(this))
      }
    }
  }
  
  // ユーザー詳細コンポーネント
  var UserDetail = {
    template: '#user-detail',
    data: function () {
      return {
        loading: false,
        user: null,
        error: null
      }
    },
  
    created: function () {
      this.fetchData()
    },
  
    watch: {
      '$route': 'fetchData'
    },
  
    methods: {
      fetchData: function () {
        this.loading = true
        // this.$route.params.userId に現在のURL上のパラメーターに対応したuserIdが格納される
        getUser(this.$route.params.userId, (function (err, user) {
          this.loading = false
          if (err) {
            this.error = err.toString()
          } else {
            this.user = user
          }
        }).bind(this))
      }
    }
  }
  
  // 新規ユーザー作成コンポーネント
  var UserCreate = {
    template: '#user-create',
    data: function () {
      return {
        sending: false,
        user: this.defaultUser(),
        error: null
      }
    },
  
    created: function () {
    },
  
    methods: {
      defaultUser: function () {
        return {
          name: '',
          description: ''
        }
      },
  
      createUser: function () {
        // 入力パラメーターのバリデーション
        if (this.user.name.trim() === '') {
          this.error = 'Nameは必須です'
          return
        }
        if (this.user.description.trim() === '') {
          this.error = 'Descriptionは必須です'
          return
        }
        postUser(this.user, (function (err, user) {
          this.sending = false
          if (err) {
            this.error = err.toString()
          } else {
            this.error = null
            // デフォルトでフォームをリセット
            this.user = this.defaultUser()
            alert('新規ユーザーが登録されました')
            // ユーザー一覧ページに戻る
            this.$router.push('/users')
          }
        }).bind(this))
      }
    }
  }
  
  // ルートオプションを渡してルーターインスタンスを生成
  var router = new VueRouter({
    // 各ルートにコンポーネントをマッピング
    // コンポーネントはVue.extend() によって作られたコンポーネントコンストラクタでも
    // コンポーネントオプションのオブジェクトでも渡せる
    routes: [
      {
        path: '/top',
        component: {
          template: '<div>トップページです。</div>'
        }
      },
      {
        path: '/users',
        component: UserList
      },
      {
        path: '/users/new',
        component: UserCreate,
        beforeEnter: function (to, from, next) {
          // 認証されていない状態でアクセスした時はloginページに遷移する
          if (!Auth.loggedIn()) {
            next({
              path: '/login',
              query: { redirect: to.fullPath }
            })
          } else {
            // 認証済みであればそのまま新規ユーザー作成ページへ進む
            next()
          }
        }
      },
      {
        // /users/newの前にこのルートを定義するとパターンマッチにより/users/newが動作しなくなるので注意
        path: '/users/:userId',
        component: UserDetail
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/logout',
        beforeEnter: function (to, from, next) {
          Auth.logout()
          next('/top')
        }
      },
      {
        // 定義されていないパスへの対応。トップページへリダイレクトする。
        path: '*',
        redirect: '/top'
      }
    ]
  })
  
  
  // ルーターのインスタンスをrootとなるVueインスタンスに渡す
  var app = new Vue({
    data: {
      Auth: Auth
    },
    router: router
  }).$mount('#app')