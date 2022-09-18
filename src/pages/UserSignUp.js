import {signUp} from "../api/apiCalls";
import React from "react";


class UserSignUpPage extends React.Component{

    state={ 
        username: null,
        displayName: null,
        password: null,
        passwordRepeat: null,
        pendingApiCall: false, 
        // pendind api call butonun disable olmasi icin eklendi
        errors: {} // backend ten gelen errorlar bu alanda tutulacak 
        // bu alan validationerror alanina denk gelmeli

    }

    onChange= event => {  // yazilan her karakterden sonra degeri alacak value olarak ilgili alana set edecek

        const {name, value}= event.target; 
 
        // errors obj kopyalanmasi
        const errors= { ...this.state.errors}; 

        errors[name]= undefined; // bu satiri hata mesajini silmek icin yazdik ancak tam olarak anlamadim tekrar buraya bak
        // muhtemelen buradaki name tamamen bir key halinde gorev yapiyor
        
        this.setState({
            [name]:value,  
            // degisken key ifade ettigi icin parantez icerisinde yazdik
        
            errors
        })
    }
    onClickSignUp = async event=> {

        event.preventDefault(); // sayfasinin kendini yenilemesini engelledik 

        const {username, displayName, password}= this.state;

        const body={
            username: username,
            displayName: displayName,
            password: password
            //  burada sadece username displayName ve pass seklinde yazabilirdim
        
        } ;
        // kullanilan degisken isimleriyle degerler ayni isimlerle ifade ediliyorsa sadece birisinin yazilmasi yeterlidir.
        this.setState({pendingApiCall: true})

        // signUp(body)
        // .then(response =>{ this.setState({pendingApiCall:false})}) // axios uretiyor olumlu
        // .catch(error=>{ this.setState({pendingApiCall:false})});  // axios uretiyor olumsuz durumlar 
        // bu yontemden daha iyi yontemler mevcut
       
       try {
        const response=  await signUp(body);
       } catch (error) {
        //  hazirladigimiz error mesaji buraya dusecek backendden gelen 
        if(error.response.data.validationError){
            
            this.setState({errors:error.response.data.validationError});} 
        }

        // backend den gelen error objsi burada state e aliniyor 
       this.setState({pendingApiCall: false});  // bu kod butonun disable olmasi ile alakali

    }

    // ESKI YONTEM VERI ALMA
    // onChangeUserName= event=>{
    //     this.setState({
    //         username:event.target.value
    //     });
    // };

    render () {

    // obj distruction
    const {pendingApiCall, errors}  =this.state;
    const {username,displayName} = errors; // Buradaki username backendden gelip bizim errora set ettgimiz deger yani username cannot.... 
        return(
            <div className="container"> 
            <form>
            <h1 className="text-center"> USER SIGN UP PAGE</h1>
            <div className="form-group">
            <label>UserName</label>
            <input className={username?"form-control is-invalid": "form-control"} name="username" onChange={this.onChange}/>
            <div className="invalid-feedback"> {/* hata mesaji bootstrap  */}{username}     </div>
            </div>
            <div className="form-group">
            <label>Display Name</label>
            <input className={displayName?"form-control is-invalid": "form-control"} name="displayName" onChange={this.onChange}/>
            <div className="invalid-feedback"> {/* hata mesaji bootstrap  */}{displayName}     </div>
            </div>
            <div className="form-group">
            <label>Password</label>
            <input className="form-control" name= "password" type="password" onChange={this.onChange}/>
            </div>
            <div className="form-group">
            <label>Password Repeat</label>
            <input className="form-control" name= "passwordRepeat" type="password" onChange={this.onChange}/>
            </div>
            <br></br>
            <div className="text-center">
            <button className="btn btn-primary" 
            disabled={pendingApiCall} // true halinde disable olacak buton. axios + ya da - cevap donunce yeniden false olarak set edilecek

            onClick={this.onClickSignUp}>
            {pendingApiCall ? <span className="spinner-border spinner-border-sm"></span> : ''}  
            {/* className olarak butona spinner eklemis olduk */}

            {/* {this.state.pendingApiCall && <span className="spinner-border spinner-border-sm"></span> }  */}

            {/* ikinci secenek condition rendering 
                eger sol taraf true ise sag taraftaki islemi ya bir nevi ve islemi
                kisa halde if yazimindan daha mantikli olabilir kullanim senoryaolarina gore 
            */}

                Sign Up</button>
            </div>
            </form>
            </div>
         );
    }
} 

export default UserSignUpPage;