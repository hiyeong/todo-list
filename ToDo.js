//stateless가 아닌이유
//여기서 누가 수정누르면 state를 수정모드로 변경해야하기때문
import React, {Component} from "react";
import { 
      StyleSheet
    , Text
    , View 
    ,TouchableOpacity
    , Dimensions
    ,TextInput
  } from 'react-native';
import PropTypes from "prop-types";
  const {width, height} = Dimensions.get("window");
export default class ToDO extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            isEditing: false,
            toDoValue: props.text
        };
    }
    static propTypes={
        text:PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo : PropTypes.func.isRequired,
        id:PropTypes.string.isRequired,
        uncompleteToDo:PropTypes.func.isRequired,
        completeToDo:PropTypes.func.isRequired,
        updateToDo:PropTypes.func.isRequired,

    }
    
    render(){
        const {isEditing, toDoValue} = this.state;
        const {text, id, deleteToDo, isCompleted } = this.props;
        return(
            <View style={styles.container}>
               <View style={styles.column}>
               <TouchableOpacity onPress={this._toggleComplete}>
                    <View style={[styles.circle, isCompleted ? styles.completedCircle: styles.uncompletedCircle]} />
                </TouchableOpacity>

                {isEditing? (
                    <TextInput  underlineColorAndroid = 'transparent' 
                    style={[
                        styles.text,
                        styles.input, 
                        isCompleted ? styles.completedText:styles.uncompletedText
                    ]} 
                    value={toDoValue} 
                    multiline={true}
                    onChangeText={this._controlInput}
                    returnKeyType={"done"}
                    onBlur={this._finfishEditing} //포커스를 잃었을 때 발생하는 핸들러 다른 영역 클릭했을 때
                    />
                ) :
                (
                <Text 
                    style={[styles.text, 
                            isCompleted ? styles.completedText:styles.uncompletedText
                    ]}
                >{text}
                </Text>
                )}
               </View>
               
                    {isEditing ? (
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={this._finfishEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>체크</Text>
                                    
                                </View>
                            </TouchableOpacity>
                        </View>
                    ): 
                    (
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>수정</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={(event)=>{event.stopPropagation; deleteToDo(id);}}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>삭제</Text> 
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
              

            </View>
        )
    };

   _toggleComplete =(event)=>{
       /* this.setState(prevState=>{//prevState파라미터값을 어떻게 가져오는지 의문?????
           return {
               isCompleted:!prevState.isCompleted
               
           };
       }); */
       //아래와 같이 바꿔주는 이유는 디스크에 저장해야하기 때문에 
       event.stopPropagation();
       const {isCompleted,uncompleteToDo,completeToDo,id}=this.props;
       if(isCompleted){
           uncompleteToDo(id)
       }
       else{
        completeToDo(id);

       }
           
       
   };

   _startEditing = (event) =>{
        event.stopPropagation(); 
        this.setState({
           isEditing:true,
       });
   };

   _finfishEditing =(event)=>{
    event.stopPropagation();

       const {toDoValue}=this.state;
       const{id,updateToDo}=this.props;
       updateToDo(id,toDoValue);//App.js의 _updateToDo funtion이 직동.
       this.setState({
           isEditing:false
       });
    };

   _controlInput = (text)=>
   {
       this.setState({
           toDoValue:text
       })
   }
}

const styles =StyleSheet.create({
    container:{
        width : width-50,
        borderBottomColor:"#bbb",
        borderBottomWidth:StyleSheet.hairlineWidth,
        flexDirection :"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    text:{
        fontWeight:"600",
        fontSize:18,
        marginVertical:20 //상하위 마진
    },
    circle :
    {
        width:30,
        height :30,
        borderRadius:15, //width,height의 절반이어야함. 
        marginRight:20,
        borderWidth:3
    },
    completedCircle:
    {
        borderColor:"#bbb"
    },
    uncompletedCircle :
    {
        borderColor:"#a52a2a"
    },
    completedText:
    {
        color:"#bbb",
        textDecorationLine:"line-through"

    },
    uncompletedText :
    {
        color:"#353839"
    },
    column :
    {
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
    },
    actions :
    {
        flexDirection :"row",
    },
    actionContainer:
    {
        marginVertical:10, //이렇게 마진을 주면 아이콘주변을 눌러도 인식함.
        marginHorizontal:10
    },
    input :
    {
        width:width /2,
        marginVertical:15,
        paddingBottom: 5 
    }
})