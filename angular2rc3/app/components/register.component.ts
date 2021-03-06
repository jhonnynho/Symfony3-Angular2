import {Component, OnInit} from '@angular/core';
import {LoginService} from '../services/login.service';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {User} from '../model/user';

@Component({
    selector: 'register',
    templateUrl: 'app/views/register.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService]
})

export class RegisterComponent implements OnInit{
    private titulo:string = "Registro";
    public user: User;
    public errorMessage;
    public status;

    constructor(
        private _loginService: LoginService,
        private _route: ActivatedRoute,
        private _router: Router
    ){}

    ngOnInit(){
        this.user = new User(1, "user", "", "", "", "", "null");
    }

    onSubmit(){
        console.log(this.user);
        this._loginService.register(this.user).subscribe(
            response => {
                this.status = response.status;

                if(this.status != "success"){
                    this.status = "error";
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