import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {LoginService} from "../services/login.service";
import {CommentService} from "../services/comment.service";
import {GenerateDatePipe} from "../pipes/generate.date.pipe";
import {User} from "../model/user";
import {Video} from "../model/video";

@Component({
    selector: "comments",
    templateUrl: "app/views/comments.html",
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, CommentService],
    pipes: [GenerateDatePipe]
})

export class CommentsComponent implements OnInit {
    public titulo: string = "Comentarios";
    public identity;
    public comment;
    public errorMessage;
    public status;
    public statusComments;
    public commentList;
    public loading = 'show';

    constructor(
        private _loginService: LoginService,
        private _commentService: CommentService,
        private _route: ActivatedRoute,
        private _router: Router
    ){}

    ngOnInit(){
        this.identity = this._loginService.getIdentity();

        this._route.params.subscribe(
            params => {
                let id = params["id"];
                this.comment = {
                    "video_id": id,
                    "body": ""
                };

                this.getComments(id);
            }
        );
    }

    onSubmit(){
        let token = this._loginService.getToken();
        this._commentService.create(token, this.comment).subscribe(
            response => {
                this.statusComments = response.status;
                if(this.statusComments != "success"){
                    this.statusComments = "error";
                }else{
                    this.comment.body = "";
                    this.getComments(this.comment.video_id);
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

    getComments(video_id){
        this.loading = 'show';
        this._commentService.getCommentsOfVideos(video_id).subscribe(
            response => {
                this.status = response.status;
                if(this.status != "success"){
                    this.status = "error";
                }else{
                    this.commentList = response.data;
                }
                this.loading = 'hide';
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

    deleteComment(id){
        let comment_panel = <HTMLElement>document.querySelector(".comment-panel-"+id);
        if(comment_panel != null){
            comment_panel.style.display = "none";
        }

        let token = this._loginService.getToken();
        this._commentService.delete(token, id).subscribe(
            response => {
                this.status = response.status;
                if(this.status != "success"){
                    this.status = "error";
                }else{

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