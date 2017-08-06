import {Component, OnInit} from "@angular/core";
import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from "@angular/router";
import {UploadService} from "../services/upload.service";
import {LoginService} from "../services/login.service";
import {VideoService} from "../services/video.service";
import {User} from "../model/user";
import {Video} from "../model/video";

@Component({
    selector: "video-new",
    templateUrl: "app/views/video.new.html",
    directives: [ROUTER_DIRECTIVES],
    providers: [LoginService, UploadService, VideoService]
})

export class VideoNewComponent implements OnInit{
    public titulo: string = "Crear un nuevo video";
    public video;
    public errorMessage;
    public status;
    public uploadedImage;

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
        this.video = new Video(1,"","","public","null","null",null,null);
    }

    callVideoStatus(value){
        this.video.status = value;
    }

    onSubmit(){
        console.log(this.video);
        let token = this._loginService.getToken();
        this._videoService.create(token, this.video).subscribe(
            response => {
                this.status = response.status;
                if(this.status != "success"){
                    this.status = "error";
                }else{
                    this.video = response.data;
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
