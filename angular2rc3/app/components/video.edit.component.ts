import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {UploadService} from "../services/upload.service";
import {LoginService} from "../services/login.service";
import {VideoService} from "../services/video.service";
import {User} from "../model/user";
import {Video} from "../model/video";

@Component({
    selector: "video-edit",
    templateUrl: "app/views/video.edit.html",
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, UploadService, VideoService]
})

export class VideoEditComponent implements OnInit{
    public titulo: string = "Modificar Video";
    public video;
    public errorMessage;
    public status;
    public status_get_video;
    public uploadedImage;
    public changeUpload;
    public identity;
    public loading;

    constructor(
        private _loginService: LoginService,
        private _uploadService: UploadService,
        private _videoService: VideoService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.uploadedImage = false;
    }

    ngOnInit(){
        this.loading = "show";
        let identity = this._loginService.getIdentity();
        this.video = new Video(1,"","","public","null","null",null,null);
        this.getVideo();
    }

    callVideoStatus(value){
        this.video.status = value;
    }

    setChangeUpload(value:string){
        this.changeUpload = value;
    }

    onSubmit(){
        this._route.params.subscribe(
            params => {
                let id = +params['id'];
                let token = this._loginService.getToken();
                this._videoService.update(token, this.video, id).subscribe(
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
                );
            }
        );
    }

    getVideo(){
        this._route.params.subscribe(params => {
            let id = +params["id"];

            this.loading = "show";
            this._videoService.getVideo(id).subscribe(
                response => {
                    this.video = response.data;
                    this.status_get_video = response.status;

                    if(this.status_get_video != "success"){
                        this._router.navigate(["/index"]);
                    }

                    if(this.identity && this.identity != null && this.identity.sub == this.video.user.id){

                    }else{
                        this._router.navigate(['/index']);
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
        });
    }

    public filesToUpload: Array<File>;
    public resultUpload;

    fileChangeEventImage(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;

        let token = this._loginService.getToken();
        let url = "http://localhost/symfony/web/app_dev.php/video/upload-image/"+this.video.id;

        this._uploadService.makeFileRequest(token, url, ['image'], this.filesToUpload).then(
            (result) => {
                this.resultUpload = result;
                this.video.image = this.resultUpload.filename;
                console.log(this.video);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    nextUploadVideo(){
        this.uploadedImage = true;
    }

    fileChangeEventVideo(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;

        let token = this._loginService.getToken();
        let url = "http://localhost/symfony/web/app_dev.php/video/upload-video/"+this.video.id;

        this._uploadService.makeFileRequest(token, url, ['video'], this.filesToUpload).then(
            (result) => {
                this.resultUpload = result;
                this.video.image = this.resultUpload.filename;
                console.log(this.video);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    redirectToVideo(){
        this._router.navigate(['/video', this.video.id]);
    }
}

