import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {LoginService} from '../services/login.service';

@Component({
    selector: 'default',
    templateUrl: "app/views/default.html",
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService]
})

export class DefaultComponent {
    public titulo = "Portada";

    public identity;

    constructor(
        private _loginService : LoginService
    ){}

    ngOnInit(){
        this.identity = this._loginService.getIdentity();
    }
}