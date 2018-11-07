import React from 'react';
import ToDo from './ToDo';
import { 
  StyleSheet
  , Text
  , View 
  , StatusBar
  , TextInput
  , Dimensions 
  , Platform //ios인지 안드로이드인지 확인해주는 것.
  , AsyncStorage
} from 'react-native';
import { white } from 'ansi-colors';
import { ScrollView } from 'react-native-gesture-handler';
import {AppLoading} from "expo";
import uuidv1 from "uuid/v1";
const {height, width} = Dimensions.get("window");

export default class App extends React.Component {
  state ={
    newToDo : "",
    loadedToDos : false,
    toDos:{}
  };
  componentDidMount=()=>{
    this._loadToDos();
  }
  render() {
    const {newToDo,loadedToDos,toDos} =this.state;
    if(!loadedToDos){
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Hiyeong To Do</Text>
        <View style={styles.card}>
          <TextInput 
            underlineColorAndroid = 'transparent'
            style={styles.input} 
            placeholder={"New To Do"} 
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={'#999'}
            returnKeyType={"done"} //키보드 속성
            autoCorrect={false}//키보드자동완성
            onSubmitEditing={this._addToDo}//완료되었을떄
          />
          <ScrollView contentContainerStyle={styles.toDos}>
              {Object.values(toDos).reverse().map(toDo=>
                <ToDo key={toDo.id}{...toDo} deleteToDo={this._deleteToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo} //얘네가 prop이다.ToDo.js에게 보냄 deleteToDo는 그냥 변수인거 알죠?
                  updateToDo={this._updateToDo}
                />
              )} 
          </ScrollView>

        </View>
      </View>
    );
  }

  _controlNewToDo = text => { //이벤트에서 텍스트를 가져옴
      this.setState({
        newToDo:text
      });
  };

  _loadToDos =async()=> {
    try{
      const toDos = await AsyncStorage.getItem("toDos");//string
      const parsedToDos=JSON.parse(toDos);//object로 변경
      console.log(toDos);
      this.setState({
        loadedToDos :true,
        toDos:parsedToDos || {}
      })

    }catch(err){
      console.log(err)
    } 
   
  };
  _addToDo = ()=>{
    const {newToDo} =this.state;
    if(newToDo!==""){
      this.setState({
        newToDo:""//비워줌
      });
     
      this.setState(prevState=>{
        const ID = uuidv1();
        const newToDoObject ={
          [ID] : {
            id :ID,
            isCompleted :false,
            text:newToDo,
            createdAt:Date.now()
          }
        };
        
        const newState={
          ...prevState, //이전 state를 보여줌.
          newToDo:'',//텍박 클리어
          toDos:{
            ...prevState.toDos,//이전 할일들
            ...newToDoObject//새로운 할일들

          }
        }
        this._saveToDos(newState.toDos);
        return {...newState};
      });
    }
  }

  _deleteToDo=(id)=>{
    this.setState(prevState=>{
      const toDos =prevState.toDos;//이전 state가져와서
      delete toDos[id];//해당 id만 삭제한다. delete from prevstate.toDos where id=id같은 원리
      const newState = {
        ...prevState,//이거 지워도 작동되는데 뭔의미지...
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return{...newState};
    })

  };
  _uncompleteToDo=(id)=>{
    this.setState(prevState =>{
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,//이전 state 플러스 밑에
          [id]:{//만약 id를 갖고 있는 새로운 게 있다면 덮어쓰도록
            ...prevState.toDos[id],//해당 id의 이전 값(텍스트, id,created at,)
            isCompleted:false//isCompleted값 변경
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    })
  }

  _completeToDo=id =>{
    this.setState(prevState =>{
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,//이전 state 플러스 밑에
          [id]:{//만약 id를 갖고 있는 새로운 게 있다면 덮어쓰도록
            ...prevState.toDos[id],//해당 id의 이전 값(텍스트, id,created at,)
            isCompleted:true//isCompleted값 변경
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _updateToDo=(id,text)=>{
    this.setState(prevState=>{
      const newState={
        ...prevState,
        toDos:{
          ...prevState.toDos,//이전 state 플러스 밑에
          [id]:{//만약 id를 갖고 있는 새로운 게 있다면 덮어쓰도록
            ...prevState.toDos[id],//해당 id의 이전 값(텍스트, id,created at,)
            text:text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };

  _saveToDos =(newToDos)=>{//newToDos에 나에게 주어지는 모든 object를 담을거임.
    console.log(newToDos)
    const _saveToDos=AsyncStorage.setItem("toDos",JSON.stringify(newToDos));//"toDos":key, value:newToDos/ AsyncStorage는 string 저장용임
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a52a2a',
    alignItems: 'center'
  },
  title: {
    color:"white",
    fontSize: 40,
    marginTop:40,
    fontWeight:"200",
    marginBottom :30
  },
  card : {
    backgroundColor:"white",
    flex:1,
    width:width-25,
    borderTopLeftRadius :10,
    borderTopRightRadius :10,
   ...Platform.select({
     ios:{
        shadowColor:"rgb{50, 50, 50}",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset:{
          height:-1,
          width:0
        }
  
     },
     android : {
        elevation:5
     }
   })
  },
  input: {
    padding :15,
    fontSize :25,
    borderBottomColor:"#bbb",
    borderBottomWidth :1,
    fontSize :25
  },
  toDos:{
    alignItems:"center"
  }
});
