import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/login.service';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
 
@Component({
    selector: 'login',
    templateUrl: 'app/views/login.html',
    providers: [LoginService]
})
 
export class LoginComponent implements OnInit{
    public titulo : string = "Identificate";
    public user;
    public errorMessage;
    public identity;
    public token;

    constructor(
       private _loginService: LoginService,
       private _route: ActivatedRoute,
       private _router: Router
    ){}

    ngOnInit(){

        this._route.params.subscribe(params =>{
            let logout = +params["id"];
            if(logout == 1){
                localStorage.removeItem("identity");
                localStorage.removeItem("token");
                this.identity = null;
                this.token = null;

                window.location.href = "/";

                //this._router.navigate(['/index']);
            }
        });

        this.user = {
            "email": "",
            "password": "",
            "getHash": "false"
        };

        let identity = this._loginService.getIdentity();
        if(identity != null && identity.sub){
            this._router.navigate(['/index']);
        }
    }

    onSubmit(){
        this._loginService.signUp(this.user).subscribe(
            response => {
                let identity = response;
                this.identity = identity;

                if(this.identity.length <= 0){
                    alert("Error en el servidor");
                }else{
                    if(!this.identity.status){
                        localStorage.setItem("identity", JSON.stringify(identity));
                        this.user.getHash = "true";
                        this._loginService.signUp(this.user).subscribe(
                            response => {
                                let token = response;
                                this.token = token;

                                if(this.token.length <= 0){
                                    alert("Error en el servidor");
                                }else{
                                    if(!this.token.status){
                                        localStorage.setItem("token", token);
                                        window.location.href = "/";
                                    }
                                }
                            },
                            error => {
                                this.errorMessage = <any>error;

                                if(this.errorMessage != null){
                                    console.log(this.errorMessage);
                                    alert("Error en la peticion");
                                }
                            }
                        )
                    }
                }
            },
            error => {
                this.errorMessage = <any>error;

                if(this.errorMessage != null){
                    console.log(this.errorMessage);
                    alert("Error en la peticion");
                }
            }
        );
    }
}