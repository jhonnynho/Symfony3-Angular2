import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {LoginService} from "../services/login.service";
import {VideoService} from "../services/video.service";
import {GenerateDatePipe} from "../pipes/generate.date.pipe";
import {CommentsComponent} from "./comments.component";
import {User} from "../model/user";
import {Video} from "../model/video";

@Component({
    selector: "video-detail",
    templateUrl: "app/views/video.detail.html",
    directives: [ROUTER_DIRECTIVES, CommentsComponent],
    providers: [LoginService, VideoService],
    pipes: [GenerateDatePipe]
})

export class VideoDetailComponent implements OnInit{
    public errorMessage;
    public video;
    public status;
    public loading = 'show';
    public lastsVideos;
    public statusLastsVideos;
    public identity;

    constructor(
        private _loginService: LoginService,
        private _videoService: VideoService,
        private _route: ActivatedRoute,
        private _router: Router
    ){}

    ngOnInit(){
        this.identity = this._loginService.getIdentity();
        this._route.params.subscribe(params => {
           this.loading = "show";
           let id = +params["id"];

           this._videoService.getVideo(id).subscribe(
               response => {
                   this.video = response.data;
                   this.status = response.status;

                   if(this.status != "success"){
                       this._router.navigate(["/index"]);
                   }

                   this.loading = "hide";
               },
               error => {
                   this.errorMessage = <any>error;

                   if(this.errorMessage != null){
                       console.log(this.errorMessage);
                       alert("Error en la peticion");
                   }
               }
           );

           this._videoService.getLastsVideos().subscribe(
               response => {
                   this.lastsVideos = response.data;
                   this.statusLastsVideos = response.status;

                   if(this.statusLastsVideos != "success"){
                       this._router.navigate(["/index"]);
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
        });
    }
}
