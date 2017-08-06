"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var login_service_1 = require("../services/login.service");
var comment_service_1 = require("../services/comment.service");
var generate_date_pipe_1 = require("../pipes/generate.date.pipe");
var CommentsComponent = (function () {
    function CommentsComponent(_loginService, _commentService, _route, _router) {
        this._loginService = _loginService;
        this._commentService = _commentService;
        this._route = _route;
        this._router = _router;
        this.titulo = "Comentarios";
        this.loading = 'show';
    }
    CommentsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.identity = this._loginService.getIdentity();
        this._route.params.subscribe(function (params) {
            var id = params["id"];
            _this.comment = {
                "video_id": id,
                "body": ""
            };
            _this.getComments(id);
        });
    };
    CommentsComponent.prototype.onSubmit = function () {
        var _this = this;
        var token = this._loginService.getToken();
        this._commentService.create(token, this.comment).subscribe(function (response) {
            _this.statusComments = response.status;
            if (_this.statusComments != "success") {
                _this.statusComments = "error";
            }
            else {
                _this.comment.body = "";
                _this.getComments(_this.comment.video_id);
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
                alert("Error en la peticion");
            }
        });
    };
    CommentsComponent.prototype.getComments = function (video_id) {
        var _this = this;
        this.loading = 'show';
        this._commentService.getCommentsOfVideos(video_id).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.status = "error";
            }
            else {
                _this.commentList = response.data;
            }
            _this.loading = 'hide';
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
                alert("Error en la peticion");
            }
        });
    };
    CommentsComponent.prototype.deleteComment = function (id) {
        var _this = this;
        var comment_panel = document.querySelector(".comment-panel-" + id);
        if (comment_panel != null) {
            comment_panel.style.display = "none";
        }
        var token = this._loginService.getToken();
        this._commentService.delete(token, id).subscribe(function (response) {
            _this.status = response.status;
            if (_this.status != "success") {
                _this.status = "error";
            }
            else {
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
                alert("Error en la peticion");
            }
        });
    };
    CommentsComponent = __decorate([
        core_1.Component({
            selector: "comments",
            templateUrl: "app/views/comments.html",
            directives: [router_1.ROUTER_DIRECTIVES],
            providers: [login_service_1.LoginService, comment_service_1.CommentService],
            pipes: [generate_date_pipe_1.GenerateDatePipe]
        }), 
        __metadata('design:paramtypes', [login_service_1.LoginService, comment_service_1.CommentService, router_1.ActivatedRoute, router_1.Router])
    ], CommentsComponent);
    return CommentsComponent;
}());
exports.CommentsComponent = CommentsComponent;
//# sourceMappingURL=comments.component.js.map