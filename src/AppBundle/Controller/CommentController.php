<?php
/**
 * Created by PhpStorm.
 * User: Jhonny Afonso
 * Date: 15/07/2017
 * Time: 06:24 PM
 */

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use BackendBundle\Entity\Comments;
use BackendBundle\Entity\Users;
use BackendBundle\Entity\Videos;

class CommentController extends Controller
{
    public function newAction (Request $request){
        $helpers = $this->get("app.helpers");

        $hash = $request->get("authorization", null);
        $authCheck = $helpers->authCheck($hash);

        if($authCheck){
            $identity = $helpers->authCheck($hash, true);

            $json = $request->get("json", null);

            if($json != null){
                $params = json_decode($json);

                $createdAt = new \DateTime("now");
                $user_id = (isset($identity->sub)) ? $identity->sub : null;
                $video_id = (isset($params->video_id)) ? $params->video_id : null;
                $body = (isset($params->body)) ? $params->body : null;

                if($user_id != null && $video_id != null){
                    $em = $this->getDoctrine()->getManager();

                    $user = $em->getRepository("BackendBundle:Users")->findOneBy(
                        array(
                            "id" => $user_id
                        )
                    );

                    $video = $em->getRepository("BackendBundle:Videos")->findOneBy(
                        array(
                            "id" => $video_id
                        )
                    );

                    $comment = new Comments();
                    $comment->setUser($user);
                    $comment->setVideo($video);
                    $comment->setBody($body);
                    $comment->setCreatedAt($createdAt);

                    $em->persist($comment);
                    $em->flush();

                    $data = array(
                        "status" => "success",
                        "code" => 200,
                        "msg" => "Comment created success"
                    );

                }else{
                    $data = array(
                        "status" => "error",
                        "code" => 400,
                        "msg" => "Comment not created"
                    );
                }
            }else{
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "msg" => "Params not valid"
                );
            }
        }else{
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Authorization not valid"
            );
        }

        return $helpers->json($data);
    }

    public function deleteAction(Request $request, $id = null){
        $helpers = $this->get("app.helpers");

        $hash = $request->get("authorization", null);
        $authCheck = $helpers->authCheck($hash);

        if($authCheck) {
            $identity = $helpers->authCheck($hash, true);

            $user_id = ($identity->sub != null) ? $identity->sub : null;

            $em = $this->getDoctrine()->getManager();

            $comment = $em->getRepository("BackendBundle:Comments")->findOneBy(
                array(
                    "id" => $id
                )
            );

            if(is_object($comment) && $user_id != null){
                if(isset($identity->sub) &&
                    ($identity->sub == $comment->getUser()->getId() ||
                     $identity->sub == $comment->getVideo()->getUser()->getId())){
                    $em->remove($comment);
                    $em->flush();

                    $data = array(
                        "status" => "success",
                        "code" => 200,
                        "msg" => "Comment deleted success"
                    );
                }else{
                    $data = array(
                        "status" => "error",
                        "code" => 400,
                        "msg" => "Comment not deleted"
                    );
                }
            }else{
                $data = array(
                    "status" => "error",
                    "code" => 400,
                    "msg" => "Comment not deleted"
                );
            }
        }else{
            $data = array(
                "status" => "error",
                "code" => 400,
                "msg" => "Authorization not valid"
            );
        }

        return $helpers->json($data);
    }

    public function listAction(Request $request, $id = null){
        $helpers = $this->get("app.helpers");

        $em = $this->getDoctrine()->getManager();

        $video = $em->getRepository("BackendBundle:Videos")->findOneBy(
            array(
                "id" => $id
            )
        );

        $comments = $em->getRepository("BackendBundle:Comments")->findBy(
            array(
                "video" => $video
            )
        , array("id" => "desc"));

        if(count($comments) >= 1){
            $data = array(
                "status" => "success",
                "code" => 200,
                "data" => $comments
            );
        }else{
            $data = array(
                "status" => "error",
                "code" => 400,
                "data" => "Dont exists comments in this video"
            );
        }

        return $helpers->json($data);
    }
}