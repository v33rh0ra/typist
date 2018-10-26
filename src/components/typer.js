import React, { Component } from 'react'

class Typer extends Component {
    constructor(props){
        super(props);
        this.state={
            test_word_arr:[],
            typed_text:{correct:'',incorrect:''},
            isStarted:false,
            isEnded:false,
            timer:'',
            secs:0,
            current_word:0,
            current_letter:0,
            errors:0,
            isError:false,
        }
    }
    componentDidMount(){
        this.generateTest();
    }
    componentWillUnmount(){

    }
    reload(){
        this.setState((prevState)=>{
            return{
                ...prevState,
                test_word_arr:[],
                typed_text:{correct:'',incorrect:''},
                isStarted:false,
                isEnded:false,
                timer:'',
                secs:0,
                current_word_pos:0,
                current_letter_pos:0,
                isError:false,
            }
        })
    }

    generateTest = () =>{
        fetch('http://www.randomtext.me/api/')
        .then(response=>response.json())
        .then(res=>{
            let text = res.text_out;
            
            text = text.replace(/<([^>]+)>/igm,'');
            text = (text.length>40)?text.substring(0,40):text;
            //Splitting each word into an array of objects with attributes
            // to be used later
            let test_word_arr = text.split(' ');
            let len = test_word_arr.length;
            let word_arr = []
            let i =0;
            test_word_arr.forEach((word)=>{
                word_arr.push({
                    id:i,
                    word:word,
                    correct:'',
                    remainder:'',
                    isTypedCorrectly:false,
                    isOver:false,
                    isCurrent:false,
                });
                i++;
                if(i < len){
                    word_arr.push({
                        id:i,
                        word:' ',
                        correct:'',
                        remainder:'',
                        isTypedCorrectly:false,
                        isOver:false,
                        isCurrent:false,    
                    });
                }
                
            })
            //setting the state var with the generated text array
            this.setState((prevState)=>{
                return{
                    ...prevState,
                    test_word_arr:word_arr,
                }
            });
        })
    }
  

  generateTestDisplay=()=>{
      let{test_word_arr,current_word_pos} = this.state; 
      console.log(test_word_arr);
    let out_text = test_word_arr.map((w,i)=>{
        if(this.state.isError){
            return<div className="word-container">
                <label></label>
            </div>
        }
    })
    return out_text;
  }
  updateValue=(e)=>{
      let val = e.target.value;
      
      let {current_word_pos,test_word_arr,isError,typed_text} = this.state;
      let current_word_obj = test_word_arr[current_word_pos];
      let current_word = current_word_obj.word;
      if (val.length>current_word.length){
          return;
      }

      let current_word_arr = current_word.split('');
      let val_arr = val.split('');
      let correct_val='',correct='',incorrect='',incorrect_val='',incorrect_pos=-1;
      if(val.length === current_word.length && val === current_word){
          current_word_obj.correct = current_word;
          current_word_obj.remainder='';
          typed_text.correct=current_word;
          typed_text.incorrect='';
          isError = false;
          current_word_obj.isOver=true;
          test_word_arr[current_word_pos] = current_word_obj;
          current_word_pos++;
        //   typed_text.correct='';
        //   typed_text.incorrect=''
      }
      else if(val.length===0){
        current_word_obj.remainder = current_word_obj.word;
        current_word_obj.correct='';
        test_word_arr[current_word_pos] = current_word_obj;
        isError = false;
      }
      else{

        val_arr.forEach((v,i)=>{
            if(v === current_word_arr[i]){
              correct+=v;
              correct_val+=v;
            }else{
              incorrect_pos = i;
              
            }
        })
        current_word_obj.correct=correct;
        //current_word_obj.remainder
        if(incorrect_pos>-1){
            current_word_obj.remainder = current_word.substring(incorrect_pos)
            isError = true;
        }else{
            current_word_obj.remainder=current_word.substring(val.length-1) 
            isError=false;
        }
        test_word_arr[current_word_pos] = current_word_obj;
          
      }
      
      
      
      
      this.setState((prevState)=>{
          return {
              ...prevState,
              typed_text:typed_text,
              isError:isError

          }

      })
  }
  render() {
      let {typed_text} = this.state;
      let timer = "00:00:00";
      let word_arr = this.generateTestDisplay();
    return (
      <div className="app-main">
        <div className="container con-1">
            <div className="word-arr">{word_arr}</div>
            <div className="timer">{timer}</div>
        </div>
        <div className="container con-2">
            {/* <input value={typed_text} onChange={this.updateValue}></input> */}
            <div contenteditable onChange={this.updateValue}>
                {typed_text.correct}
                <span style="color:red">{typed_text.incorrect}</span>
            </div>
            <button class="btn" onClick={this.reload}>Reload</button>
        </div>
        
      </div>
    )
  }
}

export default Typer;