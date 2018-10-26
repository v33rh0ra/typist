import React, { Component } from 'react'
import './typist.css';

class Typist extends Component {
    constructor(props){
        super(props);
        this.state={
            test_text:[],
            
            type_text:'',
            isStarted:false,
            isEnded:false,
            timer_start:false,
            secs:0,
            current:0,
            accuracy:0,
            errors:0,
            numLetters:0,
            timer:null,
            numWords:0,
            speed:0,
            wasPrevError:false,
           
        }
        this.timer = null;

    }
    componentDidMount(){
        window.addEventListener("keypress",this.textKeyPress);
        this.renderTestText();
    }
    componentWillUnmount(){
        window.removeEventListener("keypress",this.textKeyPress);
    }
    renderTestText = () =>{
        
        fetch('http://www.randomtext.me/api/')
        .then(response => response.json())
        .then(json => {
            console.log(json.text_out);
          let text = json.text_out;
              text = text.replace(/<([^>]*)>/igm,'');
              text = text.length>120?text.substring(0,120):text;
            let test_text = text.split('').map((c,i)=>{
                return {
                    position:i,
                    display:c,
                    isTyped:false,
                    isOver:false,
                    isCurrent:false,
                }
            })
            this.setState((prevState)=>{
                return {
                    ...prevState,
                    test_text:test_text,
                    numLetters:test_text.length,
                }
            })
        })
    }
    componentWillReceiveProps(nextProps){

    }
    myTimer = ()=>{
        console.log(this.state);
        this.setState( (prevState)=>{
           return {
                ...prevState,
                secs:prevState.secs+1,
           } 
        })
    }
    
    textKeyPress = (event) =>{

        let { isStarted,isEnded,current,test_text,accuracy,errors,numLetters,timer,numWords,speed,secs,prevWasError} = this.state;
        let lastElement = test_text.length -1;
        console.log(`Last Element: ${lastElement}`)
        if(current>=test_text.length){
            if(!isEnded){
                isEnded=true;
            }
            this.setState((prevState)=>{
                return {
                    ...prevState,
                    isEnded: true,
                }
            })
            return;
        }
        if(!isStarted){
            isStarted=true;
            timer = setInterval(this.myTimer,1000);
        }
        let current_text = this.state.test_text[current];

    
        const c = event.key;
        const ccode = event.keyCode;
        console.log(c,ccode);
        // if (ccode === 8 ){

        // }

        // else if (ccode === 13){

        // }else {
            
            if (current === lastElement){
                accuracy = (((numLetters - errors)/numLetters) * 100).toFixed(3);
                clearInterval(this.state.timer)
                timer = null;
                isEnded = true;
                speed = (numWords *60)/secs;
                
            }
            if(current_text.display === ' '){
                numWords++;
            }
            if(c===current_text.display){
                current_text.isTyped = true;
                current_text.isOver = true;
                prevWasError = false;
            }else if(prevWasError){
                return;
            }
            else{
                current_text.isTyped = false;
                current_text.isOver = true;
                errors++;
                prevWasError=true;
            }
            test_text[current]=current_text;
            this.setState((prevState)=>{
                return{
                    ...prevState,
                    type_text:prevState.type_text+c,
                    current:prevState.current+1,
                    test_text:test_text,
                    accuracy:accuracy,
                    errors:errors,
                    timer:timer,
                    isStarted:isStarted,
                    isEnded:isEnded,
                    numWords:numWords,
                    speed:speed,
                    prevWasError:prevWasError,
                }
            })
        // }
        
        
    }
    reload = ()=>{
        if(this.state.timer){
            clearInterval(this.state.timer);
        }
        this.setState( (prevState)=>{
            return {
                ...prevState,
                isStarted:false,
                isEnded:false,
                secs:0,
                type_text:'',
                accuracy:0,
                numLetters:0,
                errors:0,
                timer:null,
                numWords:0,
                current:0,
            }
        });
        this.renderTestText();
        window.focus();
    }

    millisecondsToTime = (msecs)=>{
        let ms=parseInt( (msecs%1000)),
        ss = parseInt( (msecs/(1000))%60),
        mm = parseInt( (msecs/(1000*60))%60),
        hh = parseInt((msecs/(1000*60*60))%24)
        hh = (hh<10)?"0"+hh:hh;
        mm = (mm<10)?"0"+mm:mm;
        ss = (ss<10)?"0"+ss:ss;
        ms = (ms<10)?"0"+ms:ms;
        return hh+":"+mm+":"+ss+"."+ms;
    }
    secondsToTime = (secs)=>{
        let ss=parseInt(secs%60),
        mm = parseInt((secs/60)%(60)),
        hh=parseInt((secs/(60*60))%24);

        hh = (hh<10)?"0"+hh:hh;
        mm = (mm<10)?"0"+mm:mm;
        ss = (ss<10)?"0"+ss:ss;
        return hh+":"+mm+":"+ss;

    }
  render() {
       let {test_text,type_text,secs}   = this.state;
       console.log(secs);
       let display_time="00:00:0000"
       if(secs>0 ){
        display_time = this.secondsToTime(secs);
       }
       let speed = 0;
       if(this.state.isEnded){
        speed = Math.floor(this.state.numWords *60 /this.state.secs);
       }
       
       console.log(test_text);

       let word=[],display_arr=[],current_word=0;
       test_text.forEach((t,i)=>{
            if(t.display===' ' && word.length>0){
                let words={...word};
                current_word++;
                console.log(words);
                display_arr.push(<div key={current_word} className="word" >{word.map((wr)=>{
                    return wr;
                })}</div>);
                
                word=[]
            }
            if(t.isOver && t.isTyped){
                word.push(<div className="char-label correct">
                <label >{t.display}</label>
            </div>)
            }else if(t.isOver && !t.isTyped){
                word.push(<div className="char-label error" >
                <label >{t.display}</label>
            </div>)
            }else if(i === this.state.current){
                word.push( <div className="char-label current" >
                <label >{t.display}</label>
            </div>)
            }else{
                word.push(<div className="char-label">
                <label >{t.display}</label>
            </div>)
            }
            
       });
       if(word.length>0){
           let words = {...word};
           current_word++;
        display_arr.push(<div className="word" id={current_word}>{word.map((wr)=>{
            return wr;
        })}</div>);
        word=[];
       }
       console.log(display_arr);
       let display_text = test_text.map( (t,i) => {
           
           let display_char = t.display;
            if (t.isOver && t.isTyped){
                return <div className="char-label correct" id={i}>
                    <label >{display_char}</label>
                </div>
            }else if (t.isOver && !t.isTyped){
                return <div className="char-label error" id={i}>
                <label >{display_char}</label>
            </div>
            }else if(i===this.state.current){
                return <div className="char-label current" id={i}>
                <label >{display_char}</label>
            </div>
            }
           else{
            return <div className="char-label" id={i}>
                <label >{display_char}</label>
            </div>
           }
       })
       console.log(display_text);
   
    return (
      <div class="app-body">
          {/* <label>{display_time}</label> */}
          <div class="container con-1">
            {display_arr}
          </div>
        {/* <div class="type-text">
        
            <textarea onKeyPress={this.textKeyPress}  value={type_text}></textarea>
        </div> */}
        <div class="container con-2">
            <button class="btn" onClick={this.reload}>Reload</button>
            
        </div>
        {this.state.isEnded && 
            <div class="container con-3">
                <label>Accuracy: {this.state.accuracy}</label>
               
                <label>Speed: {speed} WPM</label>
            </div>
        }
        
        
      </div>
    )
  }
}

export default Typist;