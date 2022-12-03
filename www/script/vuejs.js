new Vue ({
    el: '#app',
    data(){
        return{
            todos: [],
            text: 0,
            score: '',
            apiKey: "dee51657f9ee6f0b90fff0b1a9fa69dd557a23475814d9b9eadc7154226e41a8",
            clientKey: "8b9cbea8e8391c33cb9bd74f4177a177df679ed4d3483ccb64ac6f0ac52e1319"
        };
    },

    methods: {
        connectDataStore(){
            let ncmb = new NCMB(this.apiKey, this.clientKey);
            return ncmb;
        },

        setGameScore(){
            let ncmb = this.connectDataStore();
            // NCMB.Objectのサブクラスを生成(≒テーブルを作成)
            var GameScore = ncmb.DataStore("GameScore");
            // クラスの新しいインスタンスを生成
            var gameScore = new GameScore();

            gameScore.set("score", this.score)
                .set("playerName", "Taro")
                .set("cheatMode", false)
                .save()
                .then(function(gameScore){
                    // 保存後の処理
                })
                .catch(function(err){
                    // エラー処理
                });
            
            this.resetScore();
        },

        inputText(e){
            this.text = e.target.value;
        },

        inputScore(e){
            this.score = e.target.value;
        },

        addTodo(){
            if(!this.text) return;//textに値が入っていなかったらこのメソッドを終了
            //以下入力値があった場合の処理
            const text = this.text;
            const id = Math.ceil(Math.random()*1000);
            const todo = {
                id,
                text,
                isDone: false
            };
            this.todos.push(todo);
            this.resetText();
        },
        
        resetText(){
            this.text = '';
        },

        resetScore(){
            this.score = 0;
        },

        deleteTodo(id){
            const index = this.getIndexBy(id);
            this.todos.splice(index, 1);
        },

        toggleIsDone(id){ //トグル　indexの値を逆にしている
            const index = this.getIndexBy(id);
            this.todos[index].isDone = !this.todos[index].isDone;
        },

        getIndexBy(id){
            const filteredTodo = this.todos.filter(todo => todo.id === id)[0];
            const index = this.todos.indexOf(filteredTodo);
            return index;
        }
        


    },
    
    computed:{
        doneTodo(){
            return this.todos.filter(todo => todo.isDone === true);
        },

        incompleteTodo(){
            return this.todos.filter(todo => todo.isDone === false);
        }
    }

});