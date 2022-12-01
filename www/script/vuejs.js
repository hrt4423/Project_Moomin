new Vue ({
    el: '#app',
    data(){
        return{
            todos: [],
            text: '',
        };
    },

    methods: {//メソッドを３つ定義している
        inputText(e){
            this.text = e.target.value;
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